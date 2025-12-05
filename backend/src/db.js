// backend/src/db.js
import pg from "pg";
//import dotenv from "dotenv";

// Load environment variables
//dotenv.config();

const { Pool } = pg;

// Local database pool (for your actual nbc_world_series database)
//export const pool = new Pool({
// host: process.env.PGHOST || "localhost",
// port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
// user: process.env.PGUSER || "postgres",
// password: process.env.PGPASSWORD || "",
// database: process.env.PGDATABASE || "nbc_world_series",
//});
export const pool = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "nbc_admin",
  password: "Ghostweep147@",
  database: "nbc_world_series",
});
