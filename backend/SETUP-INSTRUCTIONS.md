# CortexAI Backend Setup Instructions

## Prerequisites
- Node.js installed
- Docker Desktop running (for Redis)
- MongoDB installed and running

## Steps to Fix CORS and Network Errors

### 1. Install Missing Dependencies

Run these commands to install the `cors` package in services that need it:

```bash
# Install cors in agent service
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend\services\agent"
npm install cors

# Install cors in chat service
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend\services\chat"
npm install cors
```

### 2. Start Redis (Required)

```bash
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend"
docker-compose up
```

### 3. Option A: Start All Services Using the Script

Double-click `start-all.bat` in the backend folder, or run:

```bash
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend"
start-all.bat
```

This will start all services in separate windows:
- Gateway (Port 8000)
- Auth Service (Port 8001)
- Chat Service (Port 8002)
- Agent Service (Port 8003)
- Billing Service (Port 8004)

### 3. Option B: Start Services Manually

Open 5 separate terminals and run:

**Terminal 1 - Gateway:**
```bash
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend\gateway"
npm run dev
```

**Terminal 2 - Auth:**
```bash
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend\services\auth"
npm run dev
```

**Terminal 3 - Chat:**
```bash
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend\services\chat"
npm run dev
```

**Terminal 4 - Agent:**
```bash
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend\services\agent"
npm run dev
```

**Terminal 5 - Billing:**
```bash
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend\services\billing"
npm run dev
```

### 4. Verify Services are Running

Double-click `check-services.bat` or run:

```bash
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\backend"
check-services.bat
```

### 5. Start Frontend

In a new terminal:

```bash
cd "c:\Users\Prashant trivedi\Downloads\cortex-ai\frontend"
npm run dev
```

Access the app at: http://localhost:5173

## What Was Fixed

1. **CORS Configuration**: Added proper CORS headers to all services (gateway, auth, agent, chat, billing)
2. **Helmet Security**: Relaxed Helmet CSP and cross-origin policies for development
3. **Redis Connection**: Made Redis connection non-blocking so gateway starts even if Redis is down
4. **Port Configuration**: Ensured gateway uses port 8000 (matching frontend config)

## Troubleshooting

### Still Getting CORS Errors?

1. Make sure ALL services are running (use `check-services.bat`)
2. Clear browser cache and cookies
3. Check browser console for specific error messages
4. Verify MongoDB is running
5. Verify Redis is running via Docker

### Services Won't Start?

1. Check if ports are already in use
2. Make sure .env files exist in each service folder
3. Check MongoDB connection strings in .env files
4. Look at terminal output for specific error messages

### Network Errors?

1. Ensure you're accessing http://localhost:5173 (not 127.0.0.1)
2. Check that the gateway is running on port 8000
3. Verify frontend .env has VITE_SERVER_URL="http://localhost:8000"
