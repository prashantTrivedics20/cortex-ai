import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/billing.routes.js";

dotenv.config();

const port = process.env.PORT;
const app = express();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:8080", "http://localhost:8000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'x-user-id', 'x-user-email', 'x-user-avatar']
}));

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/", router);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Billing Service Running"
  });
});

app.listen(port, () => {
  connectDB();
  console.log(`Billing service running on port ${port}`);
});