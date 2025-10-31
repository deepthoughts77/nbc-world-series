import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_q2XRW3bhOVSF@ep-divine-fog-ah0jvjnf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) as championships FROM public.championships;"
    );
    console.log("✅ Connected! Championships:", result.rows[0].championships);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    pool.end();
  }
})();
