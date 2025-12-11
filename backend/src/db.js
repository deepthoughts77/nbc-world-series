// backend/src/db.js
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const hasDatabaseUrl = !!process.env.DATABASE_URL;

console.log("[db] Environment:", {
  hasDatabaseUrl,
  host: process.env.PGHOST || "127.0.0.1",
  db: process.env.PGDATABASE || "nbc_world_series",
});

// Use DATABASE_URL if present (Render / Neon), otherwise local settings
const pool = hasDatabaseUrl
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.PGHOST || "127.0.0.1",
      port: process.env.PGPORT || 5432,
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "",
      database: process.env.PGDATABASE || "nbc_world_series",
    });

// IMPORTANT: always use the public schema on every new connection
pool.on("connect", (client) => {
  client
    .query("SET search_path TO public")
    .catch((err) => console.error("Failed to set search_path", err));
});

export { pool };
