// src/config/database.js
const { Pool } = require("pg");
require("dotenv").config();

/**
 * Use a single Pool for the whole app.
 * Reads credentials from .env (DATABASE_URL).
 * Example:
 *   DATABASE_URL=postgresql://nbc_admin:YourPass%40@127.0.0.1:5432/nbc_world_series
 * If your password has special characters like @ or :, URL-encode them.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false } // typical for managed Postgres over TLS
      : false, // local dev: usually no SSL
});

// Optional: test once on startup so failures are obvious
(async () => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("Database connected at:", rows[0].now);
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
})();

module.exports = pool;
