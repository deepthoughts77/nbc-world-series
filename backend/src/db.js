// backend/src/db.js (ESM)
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } // <- only if you later use a hosted DB that requires SSL
});

// Optional: simple health probe
export async function probeDb() {
  const { rows } = await pool.query("select 1 as ok");
  return rows[0].ok === 1;
}
