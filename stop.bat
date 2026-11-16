@echo off
setlocal

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8899 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
    echo [KAINARA] Proses server PID %%a dihentikan.
)

echo [KAINARA] Server di port 8899 telah dimatikan.
