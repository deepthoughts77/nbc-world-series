import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://nbc_admin:Forthelove329@127.0.0.1:5432/nbc_world_series",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BATTING_CSV = path.join(__dirname, "../data/1955_NBC_batting.csv");
const PITCHING_CSV = path.join(__dirname, "../data/1955_NBC_pitching.csv");

const toI = (v) =>
  !v || v === "-"
    ? 0
    : parseInt(
        String(v)
          .split(".")[0]
          .replace(/[^0-9-]/g, ""),
        10,
      ) || 0;
const toF = (v) => (!v || v === "-" ? 0 : parseFloat(v) || 0);

function parseIP(val) {
  const s = String(val || "").trim();
  if (!s || s === "-" || s === "0") return 0;
  if (s.includes(" ")) {
    const [w, f] = s.split(/\s+/);
    const whole = parseFloat(w) || 0;
    if (f === "1-3" || f === "1/3") return whole + 0.33;
    if (f === "2-3" || f === "2/3") return whole + 0.67;
    return whole;
  }
  return parseFloat(s) || 0;
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i]?.trim() || "";
    });
    return row;
  });
}

async function getIds(client, team, player) {
  let tRes = await client.query(
    "INSERT INTO teams (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
    [team],
  );
  const parts = player.split(/\s+/);
  const f = parts.length > 1 ? parts[0] : "";
  const l = parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
  let pRes = await client.query(
    "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
    [f, l],
  );
  let pId =
    pRes.rows[0]?.id ||
    (
      await client.query(
        "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
        [f, l],
      )
    ).rows[0].id;
  return { tId: tRes.rows[0].id, pId };
}

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("🧹 Clearing 1955 stats...");
    await client.query("DELETE FROM batting_stats WHERE year = 1955");
    await client.query("DELETE FROM pitching_stats WHERE year = 1955");

    console.log("⚾ Importing Batting...");
    for (const r of readCsv(BATTING_CSV)) {
      if (!r.Player) continue;
      const { tId, pId } = await getIds(client, r.Team, r.Player);
      const ab = toI(r.AB),
        h = toI(r.H),
        d2 = toI(r["2B"]),
        d3 = toI(r["3B"]),
        hr = toI(r.HR);
      const tb = h + d2 + 2 * d3 + 3 * hr;
      await client.query(
        `INSERT INTO batting_stats (player_id, team_id, year, season_key, g, ab, r, h, "2b", "3b", hr, sb, sh, rbi, po, a, e, tb, avg, slg)
         VALUES ($1, $2, 1955, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          pId,
          tId,
          `1955_${r.Team}_${r.Player}`.toLowerCase().replace(/\W/g, "_"),
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
          ab > 0 ? tb / ab : 0,
        ],
      );
    }

    console.log("🥎 Importing Pitching...");
    for (const r of readCsv(PITCHING_CSV)) {
      if (!r.Pitcher) continue;
      const { tId, pId } = await getIds(client, r.Team, r.Pitcher);
      const w = toI(r.W),
        l = toI(r.L);
      await client.query(
        `INSERT INTO pitching_stats (player_id, team_id, year, season_key, w, l, ip, r, h, bb, so, wp, hbp, b_avg)
         VALUES ($1, $2, 1955, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          pId,
          tId,
          `1955_${r.Team}_${r.Pitcher}`.toLowerCase().replace(/\W/g, "_"),
          w,
          l,
          parseIP(r.IP),
          toI(r.R),
          toI(r.H),
          toI(r.BB),
          toI(r.SO),
          toI(r.WP),
          toI(r.HB),
          w + l > 0 ? w / (w + l) : 0,
        ],
      );
    }
    await client.query("COMMIT");
    console.log("✅ 1955 Import Successful");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
  } finally {
    client.release();
    await pool.end();
  }
}
run();
