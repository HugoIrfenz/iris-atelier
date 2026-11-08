import os
import sys
import io
import zipfile
import json
import uuid
import time
import asyncio
import subprocess
import shutil
from datetime import datetime
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from pydantic import BaseModel
import httpx
import websockets

import database
import downloader
from pose_library import get_pose_burst_modifiers

COMFY_HTTP = "http://127.0.0.1:8188"
COMFY_WS = "ws://127.0.0.1:8188/ws"
WORKFLOW_GGUF = r"D:\AI\workflows\anima_turbo_api.json"
WORKFLOW_CHECKPOINT = r"D:\AI\workflows\checkpoint_api.json"
OUTPUTS_DIR = r"D:\AI\outputs"
CLIENT_ID = str(uuid.uuid4())

app = FastAPI(title="Local Image Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database.init_db()

connected_clients: List[WebSocket] = []

# Safe Sequential Queue State
pending_queue: List[Dict[str, Any]] = []
active_job: Optional[Dict[str, Any]] = None
active_prompt_id: Optional[str] = None
completed_event = asyncio.Event()

current_job: Dict[str, Any] = {
    "status": "idle",
    "job_id": None,
    "prompt_id": None,
    "step": 0,
    "total_steps": 8,
    "elapsed": 0.0,
    "start_time": 0.0,
    "message": "",
    "image_url": None,
    "metadata": None,
    "queue_size": 0,
    "batch_index": 0,
    "batch_total": 0,
    "queue_items": [],
}

class GenerateRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = "worst quality, low quality, blurry, deformed"
    model: Optional[str] = "anima-turbo-v1.1-Q5_K_M.gguf"
    aspect_ratio: Optional[str] = "Portrait"
    width: Optional[int] = 768
    height: Optional[int] = 1152
    steps: Optional[int] = 8
    cfg: Optional[float] = 1.0
    sampler: Optional[str] = "euler"
    scheduler: Optional[str] = "sgm_uniform"
    seed: Optional[int] = -1
    batch_count: Optional[int] = 1

class MultiPromptRequest(BaseModel):
    prompts: List[str]
    negative_prompt: Optional[str] = "worst quality, low quality, blurry, deformed"
    model: Optional[str] = "anima-turbo-v1.1-Q5_K_M.gguf"
    aspect_ratio: Optional[str] = "Portrait"
    width: Optional[int] = 768
    height: Optional[int] = 1152
    steps: Optional[int] = 8
    cfg: Optional[float] = 1.0
    sampler: Optional[str] = "euler"
    scheduler: Optional[str] = "sgm_uniform"
    seed: Optional[int] = -1

class PoseBurstRequest(BaseModel):
    prompt: str
    negative_prompt: Optional[str] = "worst quality, low quality, blurry, deformed"
    model: Optional[str] = "anima-turbo-v1.1-Q5_K_M.gguf"
    aspect_ratio: Optional[str] = "Portrait"
    width: Optional[int] = 768
    height: Optional[int] = 1152
    steps: Optional[int] = 8
    cfg: Optional[float] = 1.0
    sampler: Optional[str] = "euler"
    scheduler: Optional[str] = "sgm_uniform"
    seed: Optional[int] = -1
    burst_count: int = 100
    album_name: Optional[str] = None
    album_id: Optional[int] = None

class LocalImportRequest(BaseModel):
    source_path: str
    target_type: str = "checkpoints" # unet, checkpoints, loras, vae
    custom_name: Optional[str] = None

class DownloadRequest(BaseModel):
    url: str
    target_type: str = "unet" # unet, checkpoints, loras, vae
    filename: Optional[str] = None
    api_key: Optional[str] = None

class CharacterModel(BaseModel):
    id: str
    name: str
    tagline: Optional[str] = ""
    color: Optional[str] = "blue"
    prompt: str
    is_default: Optional[int] = 0

class BatchGalleryRequest(BaseModel):
    job_ids: List[str]

class CreateAlbumRequest(BaseModel):
    name: str

class AlbumItemsRequest(BaseModel):
    job_ids: List[str]

async def broadcast_state():
    if current_job["start_time"] > 0 and current_job["status"] in ["loading", "sampling", "decoding"]:
        current_job["elapsed"] = round(time.time() - current_job["start_time"], 1)
        
    for client in list(connected_clients):
        try:
            await client.send_json(current_job)
        except Exception:
            connected_clients.remove(client)

async def comfy_ws_listener():
    """Background listener for ComfyUI websocket events."""
    while True:
        try:
            url = f"{COMFY_WS}?clientId={CLIENT_ID}"
            async with websockets.connect(url, max_size=100_000_000) as ws:
                while True:
                    msg = await ws.recv()
                    if isinstance(msg, str):
                        data = json.loads(msg)
                        msg_type = data.get("type")
                        payload = data.get("data", {})
                        
                        prompt_id = payload.get("prompt_id")
                        if active_prompt_id and prompt_id == active_prompt_id:
                            if msg_type == "status":
                                queue_remaining = payload.get("status", {}).get("exec_info", {}).get("queue_remaining", 0)
                                if current_job["status"] == "queued" and queue_remaining > 0:
                                    current_job["message"] = f"Queued in engine (position: {queue_remaining})"
                                    await broadcast_state()
                                    
                            elif msg_type == "execution_start":
                                current_job["status"] = "loading"
                                idx_str = f" ({current_job['batch_index']}/{current_job['batch_total']})" if current_job.get("batch_total", 0) > 1 else ""
                                current_job["message"] = f"Initializing engine{idx_str} & loading models..."
                                await broadcast_state()
                                    
                            elif msg_type == "executing":
                                node_id = payload.get("node")
                                idx_str = f" ({current_job['batch_index']}/{current_job['batch_total']})" if current_job.get("batch_total", 0) > 1 else ""
                                if node_id is None:
                                    pass
                                elif node_id in ["1", "2", "3"]:
                                    current_job["status"] = "loading"
                                    current_job["message"] = f"Loading model components{idx_str}..."
                                    await broadcast_state()
                                elif node_id in ["5", "7"]: # KSampler in checkpoint or gguf workflow
                                    current_job["status"] = "sampling"
                                    current_job["message"] = f"Sampling diffusion steps{idx_str}..."
                                    await broadcast_state()
                                elif node_id in ["6", "8"]: # VAEDecode
                                    current_job["status"] = "decoding"
                                    current_job["message"] = f"Decoding VAE to image pixels{idx_str}..."
                                    await broadcast_state()
                                    
                            elif msg_type == "progress":
                                current_job["status"] = "sampling"
                                current_job["step"] = payload.get("value", 0)
                                current_job["total_steps"] = payload.get("max", current_job["total_steps"])
                                idx_str = f" [{current_job['batch_index']}/{current_job['batch_total']}]" if current_job.get("batch_total", 0) > 1 else ""
                                current_job["message"] = f"Sampling{idx_str}: Step {current_job['step']}/{current_job['total_steps']}"
                                await broadcast_state()
                                
                            elif msg_type == "executed":
                                output = payload.get("output", {})
                                if "images" in output and len(output["images"]) > 0:
                                    img_info = output["images"][0]
                                    filename = img_info.get("filename")
                                    full_path = os.path.join(OUTPUTS_DIR, filename)
                                    
                                    elapsed = round(time.time() - current_job["start_time"], 2)
                                    current_job["status"] = "complete"
                                    current_job["elapsed"] = elapsed
                                    current_job["image_url"] = f"/api/outputs/{filename}"
                                    idx_str = f" ({current_job['batch_index']}/{current_job['batch_total']})" if current_job.get("batch_total", 0) > 1 else ""
                                    current_job["message"] = f"Generated image{idx_str} in {elapsed}s"
                                    
                                    meta = current_job.get("metadata", {})
                                    meta["filename"] = filename
                                    meta["file_path"] = full_path
                                    meta["elapsed_seconds"] = elapsed
                                    meta["created_at"] = datetime.now().isoformat()
                                    
                                    sidecar_path = os.path.splitext(full_path)[0] + ".json"
                                    try:
                                        with open(sidecar_path, "w", encoding="utf-8") as sf:
                                             json.dump(meta, sf, indent=2)
                                    except Exception as e:
                                        print("Failed to write sidecar:", e)
                                        
                                    try:
                                        database.save_generation(meta)
                                    except Exception as e:
                                        print("Failed to save to db:", e)
                                        
                                    await broadcast_state()
                                    completed_event.set()
                                    
                            elif msg_type == "execution_error":
                                current_job["status"] = "error"
                                current_job["message"] = payload.get("exception_message", "Error during execution")
                                await broadcast_state()
                                completed_event.set()
                                
        except Exception:
            await asyncio.sleep(2)

async def queue_worker():
    """Background loop that executes queued generation jobs sequentially one by one."""
    global active_job, active_prompt_id
    while True:
        try:
            if not pending_queue:
                await asyncio.sleep(0.3)
                continue

            # Pop the first job in FIFO order
            job = pending_queue.pop(0)
            active_job = job
            completed_event.clear()

            # Update current_job
            current_job["status"] = "queued"
            current_job["job_id"] = job["job_id"]
            current_job["prompt_id"] = None
            current_job["step"] = 0
            current_job["total_steps"] = job["steps"]
            current_job["start_time"] = time.time()
            current_job["elapsed"] = 0.0
            current_job["message"] = f"Preparing image ({job['batch_index']}/{job['batch_total']})..."
            current_job["metadata"] = job["metadata"]
            current_job["queue_size"] = len(pending_queue)
            current_job["batch_index"] = job["batch_index"]
            current_job["batch_total"] = job["batch_total"]
            current_job["queue_items"] = [
                {"job_id": q["job_id"], "seed": q["seed"], "index": q["batch_index"], "total": q["batch_total"]}
                for q in pending_queue
            ]
            await broadcast_state()

            # Submit workflow to ComfyUI
            payload = {
                "prompt": job["workflow"],
                "client_id": CLIENT_ID
            }
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(f"{COMFY_HTTP}/prompt", json=payload)
                    if resp.status_code != 200:
                        raise Exception(f"ComfyUI rejected prompt: {resp.text}")
                    data = resp.json()
                    prompt_id = data.get("prompt_id")
                    active_prompt_id = prompt_id
                    current_job["prompt_id"] = prompt_id
                    job["metadata"]["prompt_id"] = prompt_id
            except Exception as e:
                print(f"Error submitting to ComfyUI: {e}")
                current_job["status"] = "error"
                current_job["message"] = f"ComfyUI submission error: {str(e)}"
                active_job = None
                active_prompt_id = None
                await broadcast_state()
                await asyncio.sleep(1)
                continue

            # Wait for completion (up to 10 minutes)
            try:
                await asyncio.wait_for(completed_event.wait(), timeout=600.0)
            except asyncio.TimeoutError:
                print(f"Job {job['job_id']} timed out")
                current_job["status"] = "error"
                current_job["message"] = "Job timed out"
                await broadcast_state()

            # Clear active pointers
            active_job = None
            active_prompt_id = None
            current_job["queue_size"] = len(pending_queue)
            current_job["queue_items"] = [
                {"job_id": q["job_id"], "seed": q["seed"], "index": q["batch_index"], "total": q["batch_total"]}
                for q in pending_queue
            ]

            if not pending_queue:
                await broadcast_state()
            else:
                # Give a 0.5s pause between jobs so PyTorch garbage collection & VRAM offload clean up safely
                await asyncio.sleep(0.5)

        except Exception as e:
            print("Exception in queue_worker:", e)
            await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(comfy_ws_listener())
    asyncio.create_task(queue_worker())

@app.websocket("/api/ws/status")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        await websocket.send_json(current_job)
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in connected_clients:
            connected_clients.remove(websocket)

# Models & Importer Endpoints
@app.get("/api/models")
async def get_models():
    """List all installed base models (GGUF & Checkpoints)."""
    return downloader.get_installed_models()

@app.get("/api/models/scan-downloads")
async def scan_downloads():
    """Scan user Downloads directory for models."""
    return downloader.scan_downloads_folder()

@app.post("/api/models/import-local")
async def import_local(req: LocalImportRequest):
    """Import model from local computer path."""
    try:
        res = downloader.import_local_file(req.source_path, req.target_type, req.custom_name)
        return {"success": True, "model": res}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/models/download")
async def start_download(req: DownloadRequest):
    """Start asynchronous background download of a model."""
    download_id = str(uuid.uuid4())
    downloader.active_downloads[download_id] = {
        "id": download_id,
        "url": req.url,
        "target_type": req.target_type,
        "filename": req.filename or "Detecting...",
        "status": "pending",
        "downloaded_bytes": 0,
        "total_bytes": 0,
        "progress": 0.0,
        "speed_mb_s": 0.0,
        "error": None,
        "cancelled": False
    }
    asyncio.create_task(
        downloader.download_file_task(
            download_id=download_id,
            url=req.url,
            target_type=req.target_type,
            filename=req.filename,
            api_key=req.api_key
        )
    )
    return {"success": True, "download_id": download_id}

@app.get("/api/models/downloads")
async def get_downloads():
    """Check status of active downloads."""
    return list(downloader.active_downloads.values())

@app.post("/api/models/downloads/{download_id}/cancel")
async def cancel_download(download_id: str):
    if download_id in downloader.active_downloads:
        downloader.active_downloads[download_id]["cancelled"] = True
        return {"success": True}
    raise HTTPException(status_code=404, detail="Download not found")

@app.delete("/api/models/{target_type}/{filename}")
async def delete_model(target_type: str, filename: str):
    target_dir = downloader.TARGET_DIRS.get(target_type)
    if not target_dir:
        raise HTTPException(status_code=400, detail="Invalid target type")
    file_path = os.path.join(target_dir, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"success": True}
    raise HTTPException(status_code=404, detail="Model file not found")

# Character Templates Endpoints
@app.get("/api/characters")
async def get_characters():
    return database.list_characters()

@app.post("/api/characters")
async def save_character(char: CharacterModel):
    database.save_character(char.dict())
    return {"success": True, "characters": database.list_characters()}

@app.delete("/api/characters/{char_id}")
async def delete_character(char_id: str):
    database.delete_character(char_id)
    return {"success": True, "characters": database.list_characters()}

@app.post("/api/characters/reset")
async def reset_characters():
    database.reset_default_characters()
    return {"success": True, "characters": database.list_characters()}

@app.get("/api/system/status")
async def get_system_status():
    gpu_info = {"available": False, "name": "N/A", "vram_used_mb": 0, "vram_total_mb": 4096, "utilization": 0}
    try:
        res = subprocess.run(
            ["nvidia-smi", "--query-gpu=name,memory.used,memory.total,utilization.gpu", "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=3
        )
        if res.returncode == 0 and res.stdout.strip():
            parts = [p.strip() for p in res.stdout.strip().split(",")]
            if len(parts) >= 4:
                gpu_info = {
                    "available": True,
                    "name": parts[0],
                    "vram_used_mb": int(parts[1]),
                    "vram_total_mb": int(parts[2]),
                    "utilization": int(parts[3])
                }
    except Exception:
        pass

    def get_disk_gb(path):
        try:
            total, used, free = shutil.disk_usage(path)
            return {"free_gb": round(free / (1024**3), 1), "total_gb": round(total / (1024**3), 1)}
        except Exception:
            return {"free_gb": 0, "total_gb": 0}

    comfy_online = False
    try:
        async with httpx.AsyncClient(timeout=1.5) as client:
            r = await client.get(f"{COMFY_HTTP}/system_stats")
            comfy_online = (r.status_code == 200)
    except Exception:
        pass

    return {
        "comfyui_online": comfy_online,
        "gpu": gpu_info,
        "storage": {
            "d_drive": get_disk_gb("D:\\"),
            "c_drive": get_disk_gb("C:\\")
        }
    }

@app.post("/api/generate")
async def generate_image(req: GenerateRequest):
    import random
    count = max(1, min(10, req.batch_count or 1)) # clamp between 1 and 10 safe jobs
    base_seed = req.seed if (req.seed is not None and req.seed >= 0) else None

    # Determine workflow template based on model type
    is_gguf = req.model.endswith(".gguf") or "Q5" in req.model or "Q4" in req.model
    workflow_path = WORKFLOW_GGUF if is_gguf else WORKFLOW_CHECKPOINT
    
    with open(workflow_path, "r", encoding="utf-8") as f:
        base_wf = json.load(f)

    created_jobs = []
    for i in range(count):
        job_id = str(uuid.uuid4())
        # Generate independent random seeds for each image in batch, or seed + i for fixed seeds
        if base_seed is None:
            job_seed = random.randint(1, 9999999999)
        else:
            job_seed = base_seed + i

        wf = json.loads(json.dumps(base_wf))
        if is_gguf:
            wf["1"]["inputs"]["unet_name"] = req.model
            wf["4"]["inputs"]["width"] = req.width
            wf["4"]["inputs"]["height"] = req.height
            wf["5"]["inputs"]["text"] = req.prompt
            wf["6"]["inputs"]["text"] = req.negative_prompt
            wf["7"]["inputs"]["seed"] = job_seed
            wf["7"]["inputs"]["steps"] = req.steps
            wf["7"]["inputs"]["cfg"] = req.cfg
            wf["7"]["inputs"]["sampler_name"] = req.sampler
            wf["7"]["inputs"]["scheduler"] = req.scheduler
        else:
            wf["1"]["inputs"]["ckpt_name"] = req.model
            wf["2"]["inputs"]["width"] = req.width
            wf["2"]["inputs"]["height"] = req.height
            wf["3"]["inputs"]["text"] = req.prompt
            wf["4"]["inputs"]["text"] = req.negative_prompt
            wf["5"]["inputs"]["seed"] = job_seed
            wf["5"]["inputs"]["steps"] = req.steps
            wf["5"]["inputs"]["cfg"] = req.cfg
            wf["5"]["inputs"]["sampler_name"] = req.sampler
            wf["5"]["inputs"]["scheduler"] = req.scheduler

        meta = {
            "job_id": job_id,
            "prompt": req.prompt,
            "negative_prompt": req.negative_prompt,
            "model": req.model,
            "aspect_ratio": req.aspect_ratio,
            "width": req.width,
            "height": req.height,
            "steps": req.steps,
            "cfg": req.cfg,
            "sampler": req.sampler,
            "scheduler": req.scheduler,
            "seed": job_seed,
            "favorite": 0
        }

        job_item = {
            "job_id": job_id,
            "workflow": wf,
            "seed": job_seed,
            "steps": req.steps,
            "batch_index": i + 1,
            "batch_total": count,
            "metadata": meta
        }
        pending_queue.append(job_item)
        created_jobs.append({"job_id": job_id, "seed": job_seed})

    current_job["queue_size"] = len(pending_queue)
    current_job["queue_items"] = [
        {"job_id": q["job_id"], "seed": q["seed"], "index": q["batch_index"], "total": q["batch_total"]}
        for q in pending_queue
    ]
    await broadcast_state()

    return {
        "status": "queued",
        "batch_count": count,
        "jobs": created_jobs,
        "queue_size": len(pending_queue)
    }

@app.post("/api/generate-multiprompt")
async def generate_multiprompt(req: MultiPromptRequest):
    import random
    cleaned_prompts = [p.strip() for p in req.prompts if p and p.strip()][:10]
    if not cleaned_prompts:
        raise HTTPException(status_code=400, detail="At least one valid prompt is required.")

    count = len(cleaned_prompts)
    base_seed = req.seed if (req.seed is not None and req.seed >= 0) else None

    # Determine workflow template based on model type
    is_gguf = req.model.endswith(".gguf") or "Q5" in req.model or "Q4" in req.model
    workflow_path = WORKFLOW_GGUF if is_gguf else WORKFLOW_CHECKPOINT
    
    with open(workflow_path, "r", encoding="utf-8") as f:
        base_wf = json.load(f)

    created_jobs = []
    for i, prompt_text in enumerate(cleaned_prompts):
        job_id = str(uuid.uuid4())
        if base_seed is None:
            job_seed = random.randint(1, 9999999999)
        else:
            job_seed = base_seed + i

        wf = json.loads(json.dumps(base_wf))
        if is_gguf:
            wf["1"]["inputs"]["unet_name"] = req.model
            wf["4"]["inputs"]["width"] = req.width
            wf["4"]["inputs"]["height"] = req.height
            wf["5"]["inputs"]["text"] = prompt_text
            wf["6"]["inputs"]["text"] = req.negative_prompt
            wf["7"]["inputs"]["seed"] = job_seed
            wf["7"]["inputs"]["steps"] = req.steps
            wf["7"]["inputs"]["cfg"] = req.cfg
            wf["7"]["inputs"]["sampler_name"] = req.sampler
            wf["7"]["inputs"]["scheduler"] = req.scheduler
        else:
            wf["1"]["inputs"]["ckpt_name"] = req.model
            wf["2"]["inputs"]["width"] = req.width
            wf["2"]["inputs"]["height"] = req.height
            wf["3"]["inputs"]["text"] = prompt_text
            wf["4"]["inputs"]["text"] = req.negative_prompt
            wf["5"]["inputs"]["seed"] = job_seed
            wf["5"]["inputs"]["steps"] = req.steps
            wf["5"]["inputs"]["cfg"] = req.cfg
            wf["5"]["inputs"]["sampler_name"] = req.sampler
            wf["5"]["inputs"]["scheduler"] = req.scheduler

        meta = {
            "job_id": job_id,
            "prompt": prompt_text,
            "negative_prompt": req.negative_prompt,
            "model": req.model,
            "aspect_ratio": req.aspect_ratio,
            "width": req.width,
            "height": req.height,
            "steps": req.steps,
            "cfg": req.cfg,
            "sampler": req.sampler,
            "scheduler": req.scheduler,
            "seed": job_seed,
            "favorite": 0
        }

        job_item = {
            "job_id": job_id,
            "workflow": wf,
            "seed": job_seed,
            "steps": req.steps,
            "batch_index": i + 1,
            "batch_total": count,
            "metadata": meta
        }
        pending_queue.append(job_item)
        created_jobs.append({"job_id": job_id, "seed": job_seed, "prompt": prompt_text[:30]})

    current_job["queue_size"] = len(pending_queue)
    current_job["queue_items"] = [
        {"job_id": q["job_id"], "seed": q["seed"], "index": q["batch_index"], "total": q["batch_total"], "prompt": q["metadata"]["prompt"][:35]}
        for q in pending_queue
    ]
    await broadcast_state()

    return {
        "status": "queued",
        "batch_count": count,
        "jobs": created_jobs,
        "queue_size": len(pending_queue)
    }

@app.post("/api/generate-pose-burst")
async def generate_pose_burst(req: PoseBurstRequest):
    import random
    base_prompt = req.prompt.strip()
    if not base_prompt:
        raise HTTPException(status_code=400, detail="Base prompt is required.")

    # Clamp burst_count strictly to 10, 50, or 100
    if req.burst_count <= 10:
        count = 10
    elif req.burst_count <= 50:
        count = 50
    else:
        count = 100

    modifiers = get_pose_burst_modifiers(count)

    # Resolve or create album
    album_id = req.album_id
    album_name = req.album_name
    if not album_id:
        if not album_name or not album_name.strip():
            # Clean character/prompt name for album title
            first_words = " ".join(base_prompt.split()[:4]).replace(",", "")
            album_name = f"{first_words} - {count} Angles"
        created_alb = database.create_album(album_name.strip())
        album_id = created_alb["id"]
        album_name = created_alb["name"]

    base_seed = req.seed if (req.seed is not None and req.seed >= 0) else None

    # Determine workflow template based on model type
    is_gguf = req.model.endswith(".gguf") or "Q5" in req.model or "Q4" in req.model
    workflow_path = WORKFLOW_GGUF if is_gguf else WORKFLOW_CHECKPOINT
    
    with open(workflow_path, "r", encoding="utf-8") as f:
        base_wf = json.load(f)

    created_jobs = []
    job_ids_for_album = []
    for i, mod in enumerate(modifiers):
        job_id = str(uuid.uuid4())
        job_ids_for_album.append(job_id)
        if base_seed is None:
            job_seed = random.randint(1, 9999999999)
        else:
            job_seed = base_seed + i

        # Combine cleanly: base prompt + angle modifier
        clean_base = base_prompt.rstrip(", ")
        combined_prompt = f"{clean_base}, {mod['prompt']}"

        wf = json.loads(json.dumps(base_wf))
        if is_gguf:
            wf["1"]["inputs"]["unet_name"] = req.model
            wf["4"]["inputs"]["width"] = req.width
            wf["4"]["inputs"]["height"] = req.height
            wf["5"]["inputs"]["text"] = combined_prompt
            wf["6"]["inputs"]["text"] = req.negative_prompt
            wf["7"]["inputs"]["seed"] = job_seed
            wf["7"]["inputs"]["steps"] = req.steps
            wf["7"]["inputs"]["cfg"] = req.cfg
            wf["7"]["inputs"]["sampler_name"] = req.sampler
            wf["7"]["inputs"]["scheduler"] = req.scheduler
        else:
            wf["1"]["inputs"]["ckpt_name"] = req.model
            wf["2"]["inputs"]["width"] = req.width
            wf["2"]["inputs"]["height"] = req.height
            wf["3"]["inputs"]["text"] = combined_prompt
            wf["4"]["inputs"]["text"] = req.negative_prompt
            wf["5"]["inputs"]["seed"] = job_seed
            wf["5"]["inputs"]["steps"] = req.steps
            wf["5"]["inputs"]["cfg"] = req.cfg
            wf["5"]["inputs"]["sampler_name"] = req.sampler
            wf["5"]["inputs"]["scheduler"] = req.scheduler

        meta = {
            "job_id": job_id,
            "prompt": combined_prompt,
            "negative_prompt": req.negative_prompt,
            "model": req.model,
            "aspect_ratio": req.aspect_ratio,
            "width": req.width,
            "height": req.height,
            "steps": req.steps,
            "cfg": req.cfg,
            "sampler": req.sampler,
            "scheduler": req.scheduler,
            "seed": job_seed,
            "favorite": 0,
            "album_id": album_id
        }

        job_item = {
            "job_id": job_id,
            "workflow": wf,
            "seed": job_seed,
            "steps": req.steps,
            "batch_index": i + 1,
            "batch_total": len(modifiers),
            "metadata": meta
        }
        pending_queue.append(job_item)
        created_jobs.append({"job_id": job_id, "seed": job_seed, "pose": mod["name"]})

    # Associate job IDs with the album right away
    if album_id and job_ids_for_album:
        database.add_to_album(album_id, job_ids_for_album)

    current_job["queue_size"] = len(pending_queue)
    current_job["queue_items"] = [
        {"job_id": q["job_id"], "seed": q["seed"], "index": q["batch_index"], "total": q["batch_total"], "prompt": q["metadata"]["prompt"][:35]}
        for q in pending_queue
    ]
    await broadcast_state()

    return {
        "status": "queued",
        "burst_count": len(modifiers),
        "album_id": album_id,
        "album_name": album_name,
        "jobs": created_jobs,
        "queue_size": len(pending_queue)
    }

@app.post("/api/cancel")
async def cancel_job():
    """Cancels the active job and allows queue worker to proceed to next item."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            await client.post(f"{COMFY_HTTP}/interrupt")
    except Exception:
        pass
    current_job["status"] = "cancelled"
    current_job["message"] = "Active job cancelled."
    completed_event.set()
    await broadcast_state()
    return {"status": "cancelled"}

@app.post("/api/queue/clear")
async def clear_queue():
    """Clears all pending jobs waiting in queue without interrupting active job."""
    pending_queue.clear()
    current_job["queue_size"] = 0
    current_job["queue_items"] = []
    await broadcast_state()
    return {"status": "cleared", "queue_size": 0}

@app.post("/api/cancel-all")
async def cancel_all():
    """Cancels active job AND clears all queued jobs immediately."""
    pending_queue.clear()
    current_job["queue_size"] = 0
    current_job["queue_items"] = []
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            await client.post(f"{COMFY_HTTP}/interrupt")
    except Exception:
        pass
    current_job["status"] = "idle"
    current_job["message"] = "All jobs and queue cancelled."
    completed_event.set()
    await broadcast_state()
    return {"status": "cancelled_all"}

@app.get("/api/queue")
async def get_queue_status():
    return {
        "active_job": active_job,
        "queue_size": len(pending_queue),
        "items": [
            {"job_id": q["job_id"], "seed": q["seed"], "index": q["batch_index"], "total": q["batch_total"]}
            for q in pending_queue
        ]
    }

@app.get("/api/gallery")
async def get_gallery(limit: int = 500, offset: int = 0, search: Optional[str] = None, favorites_only: bool = False, album_id: Optional[int] = None):
    items = database.list_generations(limit, offset, search, favorites_only, album_id)
    for item in items:
        item["image_url"] = f"/api/outputs/{item['filename']}"
    return items

@app.get("/api/albums")
async def get_albums():
    return database.list_albums()

@app.post("/api/albums")
async def create_new_album(req: CreateAlbumRequest):
    name = req.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Album name cannot be empty")
    album = database.create_album(name)
    return album

@app.delete("/api/albums/{album_id}")
async def delete_existing_album(album_id: int):
    database.delete_album(album_id)
    return {"success": True}

@app.post("/api/albums/{album_id}/add")
async def add_images_to_album(album_id: int, req: AlbumItemsRequest):
    if not req.job_ids:
        raise HTTPException(status_code=400, detail="No images provided")
    count = database.add_to_album(album_id, req.job_ids)
    return {"success": True, "added_count": count}

@app.post("/api/albums/{album_id}/remove")
async def remove_images_from_album(album_id: int, req: AlbumItemsRequest):
    if not req.job_ids:
        raise HTTPException(status_code=400, detail="No images provided")
    count = database.remove_from_album(album_id, req.job_ids)
    return {"success": True, "removed_count": count}

@app.post("/api/gallery/{job_id}/favorite")
async def toggle_fav(job_id: str):
    res = database.toggle_favorite(job_id)
    return {"favorite": res}

@app.delete("/api/gallery/{job_id}")
async def delete_image(job_id: str):
    database.delete_generation(job_id)
    return {"success": True}

@app.post("/api/gallery/batch-delete")
async def batch_delete_gallery(req: BatchGalleryRequest):
    count = database.batch_delete_generations(req.job_ids)
    return {"success": True, "deleted_count": count}

@app.post("/api/gallery/export-zip")
async def export_gallery_zip(req: BatchGalleryRequest):
    if not req.job_ids:
        raise HTTPException(status_code=400, detail="No images selected")

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for job_id in req.job_ids:
            row = database.get_generation_by_job_id(job_id)
            if row and row.get("file_path") and os.path.exists(row["file_path"]):
                zip_file.write(row["file_path"], arcname=os.path.basename(row["file_path"]))
                sidecar = os.path.splitext(row["file_path"])[0] + ".json"
                if os.path.exists(sidecar):
                    zip_file.write(sidecar, arcname=os.path.basename(sidecar))

    zip_buffer.seek(0)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"LocalStudio_Images_{timestamp}.zip"

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )

@app.get("/api/outputs/{filename}")
async def get_output_image(filename: str):
    file_path = os.path.join(OUTPUTS_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Image not found")

@app.post("/api/system/shutdown")
async def shutdown_system():
    print("Initiating system shutdown requested by user...")
    def kill_processes():
        time.sleep(1)
        subprocess.run(["powershell", "-NoProfile", "-Command", "Get-Process python, pythonw | Where-Object { $_.Path -like '*D:\\AI\\*' } | Stop-Process -Force"], capture_output=True)
        os._exit(0)

    import threading
    threading.Thread(target=kill_processes).start()
    return {"status": "shutting_down", "message": "All AI generation services are stopping..."}

FRONTEND_DIST = r"D:\AI\app\web\dist"
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
