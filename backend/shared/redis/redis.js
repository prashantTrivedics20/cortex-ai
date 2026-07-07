import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.REDIS_URL, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  lazyConnect: true
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.log("⚠️ Redis connection error (non-blocking):", err.message);
});

// Try to connect but don't block if it fails
redis.connect().catch((err) => {
  console.log("⚠️ Redis not available, continuing without cache:", err.message);
});

export default redis;