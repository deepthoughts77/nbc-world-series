// backend/src/db.js (ESM)
import pg from "pg";
const { Pool } = pg;

const isProd = process.env.NODE_ENV === "production";

const pool = isProd
  ? new Pool({
      connectionString: process.env.DATABASE_URL, // e.g. ...@<neon-host>/neondb?sslmode=require
      ssl: { rejectUnauthorized: false },
      keepAlive: true,
      connectionTimeoutMillis: 10000,
    })
  : new Pool({
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "",
      database: process.env.PGDATABASE || "nbc_world_series",
    });

export { pool };
