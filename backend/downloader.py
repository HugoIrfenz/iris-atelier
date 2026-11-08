import os
import time
import asyncio
import uuid
import shutil
import urllib.parse
from typing import Dict, Any, List, Optional
import httpx

COMFY_MODELS_ROOT = r"D:\AI\ComfyUI\models"

# Target directories mapping
TARGET_DIRS = {
    "unet": os.path.join(COMFY_MODELS_ROOT, "unet"),
    "checkpoints": os.path.join(COMFY_MODELS_ROOT, "checkpoints"),
    "loras": os.path.join(COMFY_MODELS_ROOT, "loras"),
    "vae": os.path.join(COMFY_MODELS_ROOT, "vae"),
}

# Download tasks memory store
active_downloads: Dict[str, Dict[str, Any]] = {}

def get_installed_models() -> List[Dict[str, Any]]:
    models = []
    
    # 1. GGUF / UNet models
    unet_dir = TARGET_DIRS["unet"]
    if os.path.exists(unet_dir):
        for f in os.listdir(unet_dir):
            if f.endswith((".gguf", ".safetensors", ".bin")):
                full = os.path.join(unet_dir, f)
                models.append({
                    "filename": f,
                    "type": "gguf",
                    "category": "unet",
                    "size_gb": round(os.path.getsize(full) / (1024**3), 2),
                    "path": full
                })

    # 2. Checkpoint models
    ckpt_dir = TARGET_DIRS["checkpoints"]
    if os.path.exists(ckpt_dir):
        for f in os.listdir(ckpt_dir):
            if f.endswith((".safetensors", ".ckpt", ".pt")):
                full = os.path.join(ckpt_dir, f)
                models.append({
                    "filename": f,
                    "type": "checkpoint",
                    "category": "checkpoints",
                    "size_gb": round(os.path.getsize(full) / (1024**3), 2),
                    "path": full
                })
                
    return models

def scan_downloads_folder() -> List[Dict[str, Any]]:
    downloads_path = os.path.join(os.path.expanduser("~"), "Downloads")
    results = []
    if os.path.exists(downloads_path):
        for root, _, files in os.walk(downloads_path):
            for file in files:
                if file.lower().endswith((".safetensors", ".gguf", ".ckpt")):
                    full = os.path.join(root, file)
                    results.append({
                        "filename": file,
                        "path": full,
                        "size_gb": round(os.path.getsize(full) / (1024**3), 2),
                        "suggested_type": "unet" if file.lower().endswith(".gguf") else "checkpoints"
                    })
    return results

def import_local_file(source_path: str, target_type: str, custom_name: Optional[str] = None) -> Dict[str, Any]:
    if not os.path.exists(source_path):
        raise FileNotFoundError(f"File not found: {source_path}")
        
    target_dir = TARGET_DIRS.get(target_type)
    if not target_dir:
        raise ValueError(f"Invalid target type: {target_type}")
        
    os.makedirs(target_dir, exist_ok=True)
    filename = custom_name.strip() if custom_name else os.path.basename(source_path)
    dest_path = os.path.join(target_dir, filename)
    
    # Check disk space
    _, _, free_space = shutil.disk_usage("D:\\")
    file_size = os.path.getsize(source_path)
    if file_size > free_space - (2 * 1024**3): # keep 2GB buffer
        raise ValueError(f"Not enough free space on D: drive ({round(free_space/(1024**3), 1)} GB free, need {round(file_size/(1024**3), 1)} GB)")

    # Copy file
    shutil.copy2(source_path, dest_path)
    return {
        "filename": filename,
        "type": target_type,
        "size_gb": round(os.path.getsize(dest_path) / (1024**3), 2),
        "path": dest_path
    }

async def download_file_task(download_id: str, url: str, target_type: str, filename: Optional[str] = None, api_key: Optional[str] = None):
    target_dir = TARGET_DIRS.get(target_type, TARGET_DIRS["unet"])
    os.makedirs(target_dir, exist_ok=True)
    
    info = active_downloads[download_id]
    info["status"] = "connecting"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) LocalImageStudio/1.0"
    }
    if api_key and api_key.strip():
        # Civitai token or Hugging Face Bearer token
        if "civitai.com" in url:
            if "?" in url:
                url += f"&token={api_key.strip()}"
            else:
                url += f"?token={api_key.strip()}"
        else:
            headers["Authorization"] = f"Bearer {api_key.strip()}"

    try:
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            async with client.stream("GET", url, headers=headers) as resp:
                if resp.status_code >= 400:
                    raise Exception(f"HTTP {resp.status_code}: {resp.reason_phrase}")
                
                # Determine filename if not given
                if not filename:
                    # Check Content-Disposition
                    cd = resp.headers.get("content-disposition", "")
                    if "filename=" in cd:
                        import re
                        m = re.search(r'filename\*?=(?:UTF-8\'\')?"?([^";]+)"?', cd)
                        if m:
                            filename = urllib.parse.unquote(m.group(1).strip())
                    if not filename:
                        # Parse from URL path
                        parsed = urllib.parse.urlparse(str(resp.url))
                        filename = os.path.basename(parsed.path) or f"model_{int(time.time())}.safetensors"

                dest_path = os.path.join(target_dir, filename)
                temp_path = dest_path + ".part"
                
                total_bytes = int(resp.headers.get("content-length", 0))
                info["filename"] = filename
                info["dest_path"] = dest_path
                info["total_bytes"] = total_bytes
                info["status"] = "downloading"
                
                # Check disk space
                if total_bytes > 0:
                    _, _, free_space = shutil.disk_usage("D:\\")
                    if total_bytes > free_space - (2 * 1024**3):
                        raise Exception(f"Not enough disk space ({round(free_space/(1024**3), 1)} GB free, need {round(total_bytes/(1024**3), 1)} GB)")

                downloaded = 0
                last_time = time.time()
                last_bytes = 0
                
                with open(temp_path, "wb") as f:
                    async for chunk in resp.aiter_bytes(chunk_size=1024 * 1024):
                        if info.get("cancelled"):
                            f.close()
                            if os.path.exists(temp_path):
                                os.remove(temp_path)
                            info["status"] = "cancelled"
                            return
                            
                        f.write(chunk)
                        downloaded += len(chunk)
                        info["downloaded_bytes"] = downloaded
                        
                        now = time.time()
                        dt = now - last_time
                        if dt >= 1.0:
                            speed = (downloaded - last_bytes) / dt / (1024 * 1024)
                            info["speed_mb_s"] = round(speed, 2)
                            if total_bytes > 0:
                                info["progress"] = round((downloaded / total_bytes) * 100, 1)
                            last_time = now
                            last_bytes = downloaded

                # Move temp to final
                if os.path.exists(dest_path):
                    os.remove(dest_path)
                os.rename(temp_path, dest_path)
                
                info["status"] = "completed"
                info["progress"] = 100.0
                info["speed_mb_s"] = 0.0

    except Exception as e:
        info["status"] = "failed"
        info["error"] = str(e)
        temp_path = info.get("dest_path", "") + ".part"
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
