import fs from "fs";
import csv from "csv-parser";
import { pool } from "../../src/db.js";

const CSV_PATH = "data/playerstats_1966_raw.csv";

function toInt(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  if (s === "") return null;
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

function toNumericString(value) {
  // For numeric/decimal columns like pct:
  // - "" or whitespace -> null
  // - otherwise return trimmed string (Postgres will cast to numeric)
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  if (s === "") return null;
  return s;
}

export async function run() {
  console.log(`\n Seeding player_stats from CSV: ${CSV_PATH}`);

  // 1) Read CSV into memory
  const rows = await new Promise((resolve, reject) => {
    const result = [];

    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", (row) => {
        result.push(row);
      })
      .on("end", () => {
        console.log(`   Loaded ${result.length} rows from CSV`);
        resolve(result);
      })
      .on("error", (err) => {
        console.error("   Error reading CSV:", err);
        reject(err);
      });
  });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Idempotent: clear 1966 stats before re-inserting
    await client.query("DELETE FROM player_stats WHERE year = 1966");
    console.log("   Deleted existing 1966 rows from player_stats");

    for (const row of rows) {
      const year = toInt(row.Year ?? row.year) ?? 1966; // fallback: 1966 if not present in CSV

      const teamName = row.Team ?? row.team ?? row.team_name ?? null;
      const playerName = row.Player ?? row.player ?? row.player_name ?? null;
      const position = row.Pos ?? row.position ?? null;

      const pct = toNumericString(row.Pct ?? row.pct);

      const values = [
        year, // year
        teamName, // team_name
        playerName, // player_name
        position, // position
        toInt(row.G ?? row.g), // g
        toInt(row.AB ?? row.ab), // ab
        toInt(row.R ?? row.r), // r
        toInt(row.H ?? row.h), // h
        toInt(row["2B"] ?? row["2b"]), // "2b"
        toInt(row["3B"] ?? row["3b"]), // "3b"
        toInt(row.HR ?? row.hr), // hr
        toInt(row.SB ?? row.sb), // sb
        toInt(row.SH ?? row.sh), // sh
        toInt(row.RBI ?? row.rbi), // rbi
        toInt(row.PO ?? row.po), // po
        toInt(row.A ?? row.a), // a
        toInt(row.E ?? row.e), // e
        pct, // pct (numeric as string or null)
      ];

      await client.query(
        `
        INSERT INTO player_stats (
          year, team_name, player_name, position,
          g, ab, r, h, "2b", "3b", hr, sb, sh, rbi, po, a, e, pct
        )
        VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18
        )
      `,
        values
      );
    }

    await client.query("COMMIT");
    console.log(
      ` Uploaded ${rows.length} rows from ${CSV_PATH} into 'player_stats' (year = 1966).`
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(" Seed 040 - player_stats failed:", err);
    throw err;
  } finally {
    client.release();
  }
}
