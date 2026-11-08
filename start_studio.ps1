# Local Image Studio Startup Script
if (-not (Test-Path "D:\AI\logs")) {
    New-Item -ItemType Directory -Path "D:\AI\logs" | Out-Null
}

# 1. Check ComfyUI on 8188
$comfyConn = Get-NetTCPConnection -LocalPort 8188 -State Listen -ErrorAction SilentlyContinue
if (-not $comfyConn) {
    Write-Host "Starting ComfyUI on port 8188..."
    Start-Process -FilePath "D:\AI\ComfyUI\venv\Scripts\python.exe" `
        -ArgumentList "D:\AI\ComfyUI\main.py --listen 127.0.0.1 --port 8188 --output-directory D:\AI\outputs --temp-directory D:\AI\cache" `
        -WorkingDirectory "D:\AI\ComfyUI" `
        -WindowStyle Hidden `
        -RedirectStandardOutput "D:\AI\logs\comfyui.log" `
        -RedirectStandardError "D:\AI\logs\comfyui_err.log"
    Start-Sleep -Seconds 3
} else {
    Write-Host "ComfyUI is already running."
}

# 2. Check Studio API on 7860
$apiConn = Get-NetTCPConnection -LocalPort 7860 -State Listen -ErrorAction SilentlyContinue
if (-not $apiConn) {
    Write-Host "Starting Studio Web API on port 7860..."
    Start-Process -FilePath "D:\AI\ComfyUI\venv\Scripts\python.exe" `
        -ArgumentList "-m uvicorn main:app --host 127.0.0.1 --port 7860" `
        -WorkingDirectory "D:\AI\app\backend" `
        -WindowStyle Hidden `
        -RedirectStandardOutput "D:\AI\logs\app.log" `
        -RedirectStandardError "D:\AI\logs\app_err.log"
    Start-Sleep -Seconds 2
} else {
    Write-Host "Studio Web API is already running."
}

# 3. Open browser
Start-Process "http://127.0.0.1:7860"
