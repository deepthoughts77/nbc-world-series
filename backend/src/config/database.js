// src/config/database.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Test connection once on startup
(async () => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("Database connected at:", rows[0].now);
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
})();

module.exports = pool;
