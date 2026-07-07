@echo off
echo.
echo ========================================
echo Restarting Gateway
echo ========================================
echo.

echo [1/2] Killing old gateway process on port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Found process: %%a
    taskkill /F /PID %%a 2>nul
)

echo.
echo [2/2] Waiting 2 seconds...
timeout /t 2 /nobreak > nul

echo.
echo [3/3] Starting minimal test gateway...
echo.
node test-minimal.js

pause
