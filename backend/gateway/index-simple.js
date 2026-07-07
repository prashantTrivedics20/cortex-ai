import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// CORS Configuration - MUST be first
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

// Static files
app.use("/uploads", express.static("uploads"));

// Security with relaxed settings for development
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
}));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
  res.status(200).json({
    service: "gateway",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// Auth proxy - NO authentication required
app.use("/api/auth", createProxyMiddleware({
    target: process.env.AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[AUTH PROXY] ${req.method} ${req.url} -> ${process.env.AUTH_SERVICE}${proxyReq.path}`);
    },
    onError: (err, req, res) => {
        console.error('[AUTH PROXY ERROR]', err.message);
        res.status(500).json({ success: false, message: 'Proxy error' });
    }
}));

// Chat proxy - authentication handled by downstream service for now
app.use("/api/chat", createProxyMiddleware({
    target: process.env.CHAT_SERVICE,
    changeOrigin: true,
    pathRewrite: {
        '^/api/chat': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[CHAT PROXY] ${req.method} ${req.url}`);
    }
}));

// Agent proxy
app.use("/api/agent", createProxyMiddleware({
    target: process.env.AGENT_SERVICE,
    changeOrigin: true,
    pathRewrite: {
        '^/api/agent': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[AGENT PROXY] ${req.method} ${req.url}`);
    }
}));

// Billing proxy
app.use("/api/billing", createProxyMiddleware({
    target: process.env.BILLING_SERVICE,
    changeOrigin: true,
    pathRewrite: {
        '^/api/billing': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[BILLING PROXY] ${req.method} ${req.url}`);
    }
}));

// Simple /api/me endpoint (no Redis dependency)
app.get("/api/me", (req, res) => {
    const sessionId = req.cookies?.session;
    
    if (!sessionId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
    
    // For now, just return unauthorized - will fix with Redis later
    return res.status(401).json({
        success: false,
        message: "Session validation temporarily disabled"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Gateway error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

app.listen(port, () => {
  console.log(`✅ Gateway running on http://localhost:${port}`);
  console.log(`📡 Auth Service: ${process.env.AUTH_SERVICE}`);
  console.log(`📡 Chat Service: ${process.env.CHAT_SERVICE}`);
  console.log(`📡 Agent Service: ${process.env.AGENT_SERVICE}`);
  console.log(`📡 Billing Service: ${process.env.BILLING_SERVICE}`);
});
