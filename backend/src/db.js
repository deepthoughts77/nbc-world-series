// backend/src/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Detect if we're running on Render (Render sets this automatically)
const isRender = !!process.env.RENDER;

// Log once so we can see what it's doing
console.log("[db] Environment:", {
  isRender,
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  host: process.env.PGHOST,
  db: process.env.PGDATABASE,
});

let pool;

if (isRender && process.env.DATABASE_URL) {
  // ---------- PRODUCTION on Render: use Neon ----------
  console.log("[db] Using DATABASE_URL (Neon) on Render");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // ---------- LOCAL DEVELOPMENT: use local Postgres ----------
  console.log("[db] Using local PG settings");
  pool = new Pool({
    host: process.env.PGHOST || "127.0.0.1",
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER || "nbc_admin",
    password: process.env.PGPASSWORD || "",
    database: process.env.PGDATABASE || "nbc_world_series",
  });
}

export { pool };
