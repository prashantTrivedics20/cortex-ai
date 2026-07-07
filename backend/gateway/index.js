import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import { protect } from "./middlewares/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// CORS configuration
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use("/uploads", express.static("uploads"));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// Helper function to forward requests
const forwardRequest = async (targetUrl, req, res, includeUser = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add user headers if authenticated
    if (includeUser && req.user) {
      headers['x-user-id'] = req.user.userId;
      headers['x-user-email'] = req.user.email;
      headers['x-user-avatar'] = req.user.avatar || '';
    }

    const options = {
      method: req.method,
      headers: headers,
    };

    // Add body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      options.body = JSON.stringify(req.body);
    }

    console.log(`Forwarding ${req.method} ${req.url} to ${targetUrl}`);
    
    const response = await fetch(targetUrl, options);
    const data = await response.json();

    // Forward cookies if present
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('set-cookie', setCookieHeader);
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Forward request error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Service unavailable',
      error: error.message
    });
  }
};

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    service: "gateway",
    status: "ok"
  });
});

// Auth service routes (no authentication required)
app.post("/api/auth/login", async (req, res) => {
  await forwardRequest(`${process.env.AUTH_SERVICE}/login`, req, res);
});

app.get("/api/auth/logout", async (req, res) => {
  await forwardRequest(`${process.env.AUTH_SERVICE}/logout`, req, res);
});

// Current user endpoint
app.get("/api/me", protect, getCurrentUser);

// Chat service - specific routes
app.get("/api/chat/get-conversations", protect, async (req, res) => {
  await forwardRequest(`${process.env.CHAT_SERVICE}/get-conversations`, req, res, true);
});

app.post("/api/chat/create-conversation", protect, async (req, res) => {
  await forwardRequest(`${process.env.CHAT_SERVICE}/create-conversation`, req, res, true);
});

app.post("/api/chat/update-conversation", protect, async (req, res) => {
  await forwardRequest(`${process.env.CHAT_SERVICE}/update-conversation`, req, res, true);
});

app.post("/api/chat/save-message", protect, async (req, res) => {
  await forwardRequest(`${process.env.CHAT_SERVICE}/save-message`, req, res, true);
});

app.get("/api/chat/get-messages/:id", protect, async (req, res) => {
  await forwardRequest(`${process.env.CHAT_SERVICE}/get-messages/${req.params.id}`, req, res, true);
});

app.delete("/api/chat/delete-conversation/:id", protect, async (req, res) => {
  await forwardRequest(`${process.env.CHAT_SERVICE}/delete-conversation/${req.params.id}`, req, res, true);
});

// Agent service - chat endpoint (raw proxy for multipart)
app.post("/api/agent/chat", protect, async (req, res) => {
  const http = (await import('http')).default;
  
  const options = {
    hostname: 'localhost',
    port: 8003,
    path: '/chat',
    method: 'POST',
    headers: {
      ...req.headers,
      'x-user-id': req.user.userId,
      'x-user-email': req.user.email,
      'x-user-avatar': req.user.avatar || ''
    }
  };

  delete options.headers.host; // Remove host header to avoid conflicts

  console.log('Proxying agent/chat with user:', req.user.userId);

  const proxyReq = http.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode);
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (error) => {
    console.error('Agent proxy error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Agent service unavailable'
      });
    }
  });

  req.pipe(proxyReq);
});

// Billing service routes
app.post("/api/billing/create-order", protect, async (req, res) => {
  await forwardRequest(`${process.env.BILLING_SERVICE}/create-order`, req, res, true);
});

app.post("/api/billing/verify-payment", protect, async (req, res) => {
  await forwardRequest(`${process.env.BILLING_SERVICE}/verify-payment`, req, res, true);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Gateway error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

app.listen(port, () => {
  console.log(`Gateway running on port ${port}`);
  console.log(`AUTH_SERVICE: ${process.env.AUTH_SERVICE}`);
  console.log(`CHAT_SERVICE: ${process.env.CHAT_SERVICE}`);
  console.log(`AGENT_SERVICE: ${process.env.AGENT_SERVICE}`);
  console.log(`BILLING_SERVICE: ${process.env.BILLING_SERVICE}`);
});
