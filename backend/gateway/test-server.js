// Simple test to verify the gateway can start
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());

// Simple test endpoints
app.get("/", (req, res) => {
  res.status(200).json({
    service: "gateway",
    status: "ok"
  });
});

app.get("/api/me", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Unauthorized"
  });
});

app.listen(port, () => {
  console.log(`✅ Test Gateway running on http://localhost:${port}`);
});
