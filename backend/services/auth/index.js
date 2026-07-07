import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// CORS configuration - allow requests from gateway and frontend
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:8080", "http://localhost:8000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

app.use(express.json());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).json({
    service: "auth",
    status: "ok"
  });
});

app.use("/", router);

app.listen(port, () => {
  connectDB();
  console.log(`Auth service running on port ${port}`);
});
