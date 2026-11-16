@echo off
setlocal
cd /d "%~dp0"

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8899 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process php -ArgumentList @('artisan', 'serve', '--host=127.0.0.1', '--port=8899', '--no-reload') -WorkingDirectory '%~dp0' -WindowStyle Hidden"

echo [KAINARA] Server berjalan di background: http://127.0.0.1:8899/
