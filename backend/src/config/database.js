// src/config/database.js
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Check if Railway or local environment, enable SSL only in production
const useSSL =
  process.env.NODE_ENV === "production" ||
  /railway\.app|render\.com|neon\.tech/i.test(process.env.DATABASE_URL || "");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

// optional: test the connection on startup
pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));
