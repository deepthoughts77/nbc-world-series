import { pool } from "../db.js";

export const getHealth = (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
};

export const getDbTest = async (_req, res) => {
  try {
    const r = await pool.query("SELECT NOW() AS time");
    const time = r?.rows?.[0]?.time ?? null;
    if (!time) {
      return res
        .status(500)
        .json({ success: false, error: "db-test: no row returned" });
    }
    res.json({ success: true, time });
  } catch (err) {
    console.error("db-test error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getWhichDb = async (_req, res) => {
  try {
    const r = await pool.query(`
      SELECT
        current_database() AS db,
        inet_server_addr()::text AS host_ip,
        current_setting('server_version') AS server_version,
        current_setting('ssl') AS ssl_on
    `);
    res.json(r?.rows?.[0] ?? {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getDbCheck = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "select count(*)::int as championships from public.championships"
    );
    res.json({ ok: true, championships: rows[0].championships });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
};
