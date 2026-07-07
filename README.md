# CortexAI - Multi-Agent AI Platform

A full-stack AI platform with microservices architecture, featuring Firebase authentication, Redis session management, and multiple AI agents.

## 🏗️ Architecture

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express (Microservices)
- **Database**: MongoDB
- **Cache**: Redis
- **Authentication**: Firebase Admin SDK

## 📁 Project Structure

```
cortex-ai/
├── frontend/               # React frontend
├── backend/
│   ├── gateway/           # API Gateway (Port 8000)
│   ├── services/
│   │   ├── auth/          # Auth Service (Port 8001)
│   │   ├── chat/          # Chat Service (Port 8002)
│   │   ├── agent/         # Agent Service (Port 8003)
│   │   └── billing/       # Billing Service (Port 8004)
│   └── shared/            # Shared utilities (Redis, etc.)
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB
- Redis (via Docker)
- Firebase Project

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cortex-ai
```

### 2. Setup Environment Variables

Copy `.env.example` files and fill in your values:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Gateway
cp backend/gateway/.env.example backend/gateway/.env

# Auth Service
cp backend/services/auth/.env.example backend/services/auth/.env
```

### 3. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend Gateway
cd ../backend/gateway
npm install

# Auth Service
cd ../services/auth
npm install

# Chat Service
cd ../chat
npm install

# Agent Service
cd ../agent
npm install

# Billing Service
cd ../billing
npm install
```

### 4. Setup Firebase

1. Create a Firebase project
2. Enable Google Authentication
3. Download `serviceAccount.json`
4. Place it in `backend/services/auth/serviceAccount.json`

### 5. Start Redis

```bash
cd backend
docker-compose up -d
```

### 6. Start All Services

**Terminal 1 - Gateway:**
```bash
cd backend/gateway
npm run dev
```

**Terminal 2 - Auth:**
```bash
cd backend/services/auth
npm run dev
```

**Terminal 3 - Chat:**
```bash
cd backend/services/chat
npm run dev
```

**Terminal 4 - Agent:**
```bash
cd backend/services/agent
npm run dev
```

**Terminal 5 - Billing:**
```bash
cd backend/services/billing
npm run dev
```

**Terminal 6 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the App

Open [http://localhost:5173](http://localhost:5173)

## 🔧 Configuration

### Gateway (.env)
```
PORT=8000
REDIS_URL="redis://localhost:6379"
AUTH_SERVICE="http://localhost:8001"
CHAT_SERVICE="http://localhost:8002"
AGENT_SERVICE="http://localhost:8003"
BILLING_SERVICE="http://localhost:8004"
```

### Auth Service (.env)
```
PORT=8001
MONGODB_URL="your-mongodb-connection-string"
FRONTEND_URL="http://localhost:5173"
```

### Frontend (.env)
```
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_SERVER_URL="http://localhost:8000"
VITE_RAZORPAY_KEY="your-razorpay-key"
```

## 🛠️ Development

### Running Individual Services

Each service can be run independently:

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

### Testing Services

Check if all services are running:

```bash
curl http://localhost:8000  # Gateway
curl http://localhost:8001  # Auth
curl http://localhost:8002  # Chat
curl http://localhost:8003  # Agent
curl http://localhost:8004  # Billing
```

## 📝 Important Notes

1. **Firebase Setup**: Make sure `serviceAccount.json` is NOT committed to Git
2. **MongoDB**: Ensure MongoDB is running before starting services
3. **Redis**: Required for session management
4. **Ports**: Default ports are 8000-8004, change in .env if needed

## 🐛 Troubleshooting

### Login Issues
- Check if all services are running
- Verify Firebase configuration
- Check Redis connection
- Look at browser console for errors

### CORS Errors
- Ensure frontend URL is `http://localhost:5173`
- Check CORS settings in gateway and services

### Service Not Starting
- Check if port is already in use
- Verify .env file exists and is correct
- Check MongoDB connection
- Look at service logs for errors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Prashant Trivedi

## 🙏 Acknowledgments

- Firebase for authentication
- Redis for session management
- MongoDB for data storage
