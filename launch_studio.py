import os
import sys
import time
import socket
import subprocess
import webbrowser

AI_ROOT = r"D:\AI"
LOGS_DIR = os.path.join(AI_ROOT, "logs")
PYTHON_EXE = os.path.join(AI_ROOT, r"ComfyUI\venv\Scripts\python.exe")
COMFY_DIR = os.path.join(AI_ROOT, "ComfyUI")
APP_DIR = os.path.join(AI_ROOT, r"app\backend")

os.makedirs(LOGS_DIR, exist_ok=True)

# Flags: CREATE_BREAKAWAY_FROM_JOB (0x01000000) | DETACHED_PROCESS (0x00000008) | CREATE_NO_WINDOW (0x08000000)
SPAWN_FLAGS = 0x01000000 | 0x00000008 | 0x08000000

def is_port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(('127.0.0.1', port)) == 0

def launch_comfyui():
    if is_port_open(8188):
        print("ComfyUI is already running on port 8188.")
        return
    print("Starting ComfyUI on port 8188...")
    out_file = open(os.path.join(LOGS_DIR, "comfyui.log"), "a", encoding="utf-8")
    err_file = open(os.path.join(LOGS_DIR, "comfyui_err.log"), "a", encoding="utf-8")
    
    cmd = [
        PYTHON_EXE,
        os.path.join(COMFY_DIR, "main.py"),
        "--listen", "127.0.0.1",
        "--port", "8188",
        "--output-directory", os.path.join(AI_ROOT, "outputs"),
        "--temp-directory", os.path.join(AI_ROOT, "cache")
    ]
    subprocess.Popen(
        cmd,
        cwd=COMFY_DIR,
        stdout=out_file,
        stderr=err_file,
        creationflags=SPAWN_FLAGS
    )

def launch_app():
    if is_port_open(7860):
        print("Studio Web App is already running on port 7860.")
        return
    print("Starting Studio Web App on port 7860...")
    out_file = open(os.path.join(LOGS_DIR, "app.log"), "a", encoding="utf-8")
    err_file = open(os.path.join(LOGS_DIR, "app_err.log"), "a", encoding="utf-8")
    
    cmd = [
        PYTHON_EXE,
        "-m", "uvicorn",
        "main:app",
        "--host", "127.0.0.1",
        "--port", "7860"
    ]
    subprocess.Popen(
        cmd,
        cwd=APP_DIR,
        stdout=out_file,
        stderr=err_file,
        creationflags=SPAWN_FLAGS
    )

def main():
    launch_comfyui()
    launch_app()
    
    print("Waiting for Studio Web UI to come online...")
    for _ in range(40):
        if is_port_open(7860):
            print("Studio is online! Opening browser...")
            webbrowser.open("http://127.0.0.1:7860")
            break
        time.sleep(0.5)

if __name__ == "__main__":
    main()
