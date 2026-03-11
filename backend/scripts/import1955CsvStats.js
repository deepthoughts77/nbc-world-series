// backend/scripts/import1955CsvStats.js
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

const pool = new Pool({
  user: "nbc_admin",
  host: "127.0.0.1",
  database: "nbc_world_series",
  password: "Ghostweep147@",
  port: 5432,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BATTING_CSV = path.join(__dirname, "../data/1955_NBC_batting.csv");
const PITCHING_CSV = path.join(__dirname, "../data/1955_NBC_pitching.csv");

// Cleans numbers: handles "0.0", "-", or empty strings
const toI = (v) => {
  if (v === undefined || v === null || v === "" || v === "-") return 0;
  const n = parseInt(
    String(v)
      .split(".")[0]
      .replace(/[^0-9-]/g, ""),
    10,
  );
  return isNaN(n) ? 0 : n;
};

const toF = (v) => {
  if (!v || v === "-") return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

function parseIP(val) {
  const s = String(val || "").trim();
  if (!s || s === "-" || s === "0") return 0;
  if (s.includes(" ")) {
    const [whole, frac] = s.split(/\s+/);
    const w = parseFloat(whole) || 0;
    if (frac === "1-3" || frac === "1/3") return w + 0.33;
    if (frac === "2-3" || frac === "2/3") return w + 0.67;
    if (frac === "1-2" || frac === "1/2") return w + 0.5;
    return w;
  }
  return parseFloat(s) || 0;
}

function getCsvData(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : "";
    });
    return row;
  });
}

async function getIds(client, teamName, playerName) {
  let tRes = await client.query(
    "INSERT INTO teams (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
    [teamName],
  );
  const tId = tRes.rows[0].id;

  const parts = playerName.split(/\s+/);
  const f = parts.length > 1 ? parts[0] : "";
  const l = parts.length > 1 ? parts.slice(1).join(" ") : parts[0];

  let pRes = await client.query(
    "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
    [f, l],
  );
  let pId = pRes.rows[0]?.id;
  if (!pId) {
    pRes = await client.query(
      "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
      [f, l],
    );
    pId = pRes.rows[0].id;
  }
  return { tId, pId };
}

async function run() {
  const client = await pool.connect();
  try {
    const battingRows = getCsvData(BATTING_CSV);
    const pitchingRows = getCsvData(PITCHING_CSV);

    await client.query("BEGIN");
    await client.query("DELETE FROM batting_stats WHERE year = 1955");
    await client.query("DELETE FROM pitching_stats WHERE year = 1955");

    console.log(`⚾ Importing ${battingRows.length} Batting Rows...`);
    for (let i = 0; i < battingRows.length; i++) {
      const r = battingRows[i];
      if (!r.Player || !r.Team) continue;

      const { tId, pId } = await getIds(client, r.Team, r.Player);
      const ab = toI(r.AB),
        h = toI(r.H),
        d2 = toI(r["2B"]),
        d3 = toI(r["3B"]),
        hr = toI(r.HR);
      const tb = h + d2 + 2 * d3 + 3 * hr;

      if (i === 0)
        console.log(
          `🔍 Mapping Check: ${r.Player} -> SH:${r.SH}, PO:${r.PO}, A:${r.A}, E:${r.E}`,
        );

      await client.query(
        `INSERT INTO batting_stats (
          player_id, team_id, year, season_key, g, ab, r, h, "2b", "3b", hr, 
          sb, sh, rbi, po, a, e, tb, avg, slg
        ) VALUES ($1, $2, 1955, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          pId,
          tId,
          `1955_${r.Team}_${r.Player}`
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, ""),
          toI(r.G),
          ab,
          toI(r.R),
          h,
          d2,
          d3,
          hr,
          toI(r.SB),
          toI(r.SH),
          toI(r.RBI),
          toI(r.PO),
          toI(r.A),
          toI(r.E),
          tb,
          toF(r.Pct),
          ab > 0 ? Math.round((tb / ab) * 1000) / 1000 : 0,
        ],
      );
    }

    console.log(`🥎 Importing ${pitchingRows.length} Pitching Rows...`);
    for (const r of pitchingRows) {
      if (!r.Pitcher || !r.Team) continue;
      const { tId, pId } = await getIds(client, r.Team, r.Pitcher);
      const w = toI(r.W),
        l = toI(r.L);

      await client.query(
        `INSERT INTO pitching_stats (
          player_id, team_id, year, season_key, w, l, ip, h, r, bb, so, wp, hbp, b_avg
        ) VALUES ($1, $2, 1955, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          pId,
          tId,
          `1955_${r.Team}_${r.Pitcher}`
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, ""),
          w,
          l,
          parseIP(r.IP),
          toI(r.H),
          toI(r.R),
          toI(r.BB),
          toI(r.SO),
          toI(r.WP),
          toI(r.HB),
          w + l > 0 ? Math.round((w / (w + l)) * 1000) / 1000 : 0,
        ],
      );
    }

    await client.query("COMMIT");
    console.log("🎉 1955 IMPORT SUCCESSFUL!");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ ERROR:", e.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
