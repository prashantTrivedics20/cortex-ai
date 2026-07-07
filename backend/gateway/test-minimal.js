import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET / received");
  res.json({ 
    status: "ok", 
    message: "Gateway working!",
    services: {
      auth: process.env.AUTH_SERVICE,
      chat: process.env.CHAT_SERVICE,
      agent: process.env.AGENT_SERVICE
    }
  });
});

// Auth proxy
app.use("/api/auth", createProxyMiddleware({
    target: process.env.AUTH_SERVICE || "http://localhost:8001",
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`✅ [AUTH PROXY] ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ [AUTH RESPONSE] ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
        console.error('❌ [AUTH PROXY ERROR]', err.message);
        res.status(502).json({ success: false, message: 'Auth service unavailable' });
    }
}));

// Chat proxy
app.use("/api/chat", createProxyMiddleware({
    target: process.env.CHAT_SERVICE || "http://localhost:8002",
    changeOrigin: true,
    pathRewrite: {
        '^/api/chat': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`✅ [CHAT PROXY] ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
        console.error('❌ [CHAT PROXY ERROR]', err.message);
        res.status(502).json({ success: false, message: 'Chat service unavailable' });
    }
}));

// Agent proxy
app.use("/api/agent", createProxyMiddleware({
    target: process.env.AGENT_SERVICE || "http://localhost:8003",
    changeOrigin: true,
    pathRewrite: {
        '^/api/agent': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`✅ [AGENT PROXY] ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
        console.error('❌ [AGENT PROXY ERROR]', err.message);
        res.status(502).json({ success: false, message: 'Agent service unavailable' });
    }
}));

// Billing proxy
app.use("/api/billing", createProxyMiddleware({
    target: process.env.BILLING_SERVICE || "http://localhost:8004",
    changeOrigin: true,
    pathRewrite: {
        '^/api/billing': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`✅ [BILLING PROXY] ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
        console.error('❌ [BILLING PROXY ERROR]', err.message);
        res.status(502).json({ success: false, message: 'Billing service unavailable' });
    }
}));

// Simple /api/me endpoint
app.get("/api/me", (req, res) => {
    console.log("GET /api/me - returning 401 (no auth yet)");
    res.status(401).json({
        success: false,
        message: "Unauthorized"
    });
});

const port = 7000;

app.listen(port, () => {
  console.log(`\n✅ Gateway with proxies running on http://localhost:${port}`);
  console.log(`📡 Auth: ${process.env.AUTH_SERVICE || "http://localhost:8001"}`);
  console.log(`📡 Chat: ${process.env.CHAT_SERVICE || "http://localhost:8002"}`);
  console.log(`📡 Agent: ${process.env.AGENT_SERVICE || "http://localhost:8003"}`);
  console.log(`📡 Billing: ${process.env.BILLING_SERVICE || "http://localhost:8004"}\n`);
}).on('error', (err) => {
  console.error('❌ Failed to start:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('\n⚠️  Port 7000 is already in use!');
  }
});
