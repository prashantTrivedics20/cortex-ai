import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:8080", "http://localhost:8000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'x-user-id', 'x-user-email', 'x-user-avatar']
}));

app.use(express.json());

const port = process.env.PORT;

app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.status) {
    return res.status(err.status).json(err.data);
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

app.listen(port, () => {
  connectDB();
  console.log(`Agent service running on port ${port}`);
});
