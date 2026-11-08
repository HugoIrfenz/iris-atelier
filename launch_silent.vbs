Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "D:\AI\ComfyUI\venv\Scripts\pythonw.exe" & chr(34) & " " & chr(34) & "D:\AI\launch_studio.py" & chr(34), 0, False
Set WshShell = Nothing
