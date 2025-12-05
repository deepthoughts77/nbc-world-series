// backend/src/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const hasDatabaseUrl = !!process.env.DATABASE_URL;

console.log("[db] Environment:", {
  hasDatabaseUrl,
  host: process.env.PGHOST,
  db: process.env.PGDATABASE,
});

let pool;

if (hasDatabaseUrl) {
  // Use Neon (or any cloud DB) whenever DATABASE_URL is set
  console.log("[db] Using DATABASE_URL (Neon / cloud)");
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required by Neon
  });
} else {
  // Fallback: local Postgres for dev
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
