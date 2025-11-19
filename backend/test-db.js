// backend/test-db.js
import "dotenv/config";
import { pool } from "./src/db.js";

async function main() {
  try {
    console.log(" Testing database connection...");

    const { rows } = await pool.query("SELECT NOW() AS now");

    console.log(" Connected successfully!");
    console.log("   Server time:", rows[0].now);
  } catch (err) {
    console.error(" Connection failed:", err.message);
    // Optional: debug more details
    if (err.code) console.error("   code:", err.code);
    if (err.stack) console.error(err.stack);
  } finally {
    // Close pool cleanly so Node can exit
    await pool.end();
    process.exit(0);
  }
}

main();
