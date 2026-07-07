@echo off
echo Starting all services...
echo.

REM Start Redis with Docker Compose
echo [1/6] Starting Redis...
start "Redis" cmd /k "cd /d "%~dp0" && docker-compose up"
timeout /t 5 /nobreak > nul

REM Start Gateway Service
echo [2/6] Starting Gateway Service (Port 8000)...
start "Gateway" cmd /k "cd /d "%~dp0gateway" && npm run dev"
timeout /t 3 /nobreak > nul

REM Start Auth Service
echo [3/6] Starting Auth Service (Port 8001)...
start "Auth" cmd /k "cd /d "%~dp0services\auth" && npm run dev"
timeout /t 3 /nobreak > nul

REM Start Chat Service
echo [4/6] Starting Chat Service (Port 8002)...
start "Chat" cmd /k "cd /d "%~dp0services\chat" && npm run dev"
timeout /t 3 /nobreak > nul

REM Start Agent Service
echo [5/6] Starting Agent Service (Port 8003)...
start "Agent" cmd /k "cd /d "%~dp0services\agent" && npm run dev"
timeout /t 3 /nobreak > nul

REM Start Billing Service
echo [6/6] Starting Billing Service (Port 8004)...
start "Billing" cmd /k "cd /d "%~dp0services\billing" && npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo Gateway:  http://localhost:8000
echo Auth:     http://localhost:8001
echo Chat:     http://localhost:8002
echo Agent:    http://localhost:8003
echo Billing:  http://localhost:8004
echo ========================================
