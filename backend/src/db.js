// backend/src/db.js (ESM)
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || process.env.DB_HOST || "localhost",
  port: process.env.PGPORT || process.env.DB_PORT || 5432,
  user: process.env.PGUSER || process.env.DB_USER || "postgres",
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  database: process.env.PGDATABASE || process.env.DB_NAME || "nbc_world_series",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export { pool };
