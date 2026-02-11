// backend/src/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Prefer DATABASE_URL when present (Neon/Render). Otherwise fall back to PG* vars.
const hasDatabaseUrl = !!process.env.DATABASE_URL;

const pool = new Pool(
  hasDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
      }
    : {
        host: process.env.PGHOST || "127.0.0.1",
        port: Number(process.env.PGPORT || 5432),
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "",
        database: process.env.PGDATABASE || "nbc_world_series",
      },
);

// Simple helper to match code that expects `query(...)`
export async function query(text, params) {
  return pool.query(text, params);
}

export { pool };
export default pool;

// Helpful log once at startup (safe, no secrets)
console.log("[db] Environment:", {
  hasDatabaseUrl,
  host: process.env.PGHOST || "127.0.0.1",
  db: process.env.PGDATABASE || "nbc_world_series",
});
