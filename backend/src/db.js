import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env (for local)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const { Pool } = pg;

const isRender = !!process.env.RENDER;

console.log("[db] Environment:", {
  isRender,
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  host: process.env.PGHOST,
  db: process.env.PGDATABASE,
});

let pool;

if (isRender && process.env.DATABASE_URL) {
  // On Render → use Neon via DATABASE_URL
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // Local dev
  pool = new Pool({
    host: process.env.PGHOST || "127.0.0.1",
    port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
    user: process.env.PGUSER || "nbc_admin",
    password: process.env.PGPASSWORD || "",
    database: process.env.PGDATABASE || "nbc_world_series",
  });
}

export { pool };
