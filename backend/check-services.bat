@echo off
echo Checking service status...
echo.

echo [1] Checking Gateway (Port 8000)...
curl -s http://localhost:8000 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Gateway is running
) else (
    echo ❌ Gateway is NOT running
)

echo [2] Checking Auth (Port 8001)...
curl -s http://localhost:8001 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Auth is running
) else (
    echo ❌ Auth is NOT running
)

echo [3] Checking Chat (Port 8002)...
curl -s http://localhost:8002 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Chat is running
) else (
    echo ❌ Chat is NOT running
)

echo [4] Checking Agent (Port 8003)...
curl -s http://localhost:8003 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Agent is running
) else (
    echo ❌ Agent is NOT running
)

echo [5] Checking Billing (Port 8004)...
curl -s http://localhost:8004 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Billing is running
) else (
    echo ❌ Billing is NOT running
)

echo.
pause
