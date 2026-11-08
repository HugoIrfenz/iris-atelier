@echo off
echo Stopping Local Image Studio...
powershell -NoProfile -Command "Get-Process python, pythonw -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*D:\AI\*' } | Stop-Process -Force"
echo.
echo Local Image Studio and ComfyUI have been turned off.
echo All GPU memory has been freed.
timeout /t 3 >nul
exit /b 0
