// backend/scripts/importChampionshipAwardsFromJson.js
import { pool } from "../src/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clean up the "champion" name string into first/last name.
 * Handles:
 *  - extra newlines (e.g. "Jan Dukes\n\n\nBellingham, WA")
 *  - trailing stat lines ("22 IP, 4 ER", ".71 ER", etc.)
 *  - trailing city after comma
 */
function normalizeName(raw) {
  if (!raw) return { firstName: "", lastName: "", full: "" };

  // Only keep the first line if there are embedded newlines
  let cleaned = raw.split("\n")[0].trim();

  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // If there is a stat pattern (numbers / IP / ER) cut before that
  const statMatch = cleaned.match(/^(.*?)(\d|\bIP\b|\bER\b)/i);
  if (statMatch) {
    cleaned = statMatch[1].trim();
  }

  // If there's a comma, drop anything after the first comma
  const commaIdx = cleaned.indexOf(",");
  if (commaIdx !== -1) {
    cleaned = cleaned.slice(0, commaIdx).trim();
  }

  // Final collapse again just in case
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  const parts = cleaned.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  return { firstName, lastName, full: cleaned };
}

/**
 * Decide whether this JSON row is a pitcher award or an MVP award.
 * Heuristics:
 *  - If champion text looks like a stat line (IP / ER / decimals) -> pitcher
 *  - Else if runnerUp has team in parentheses (Hays Larks (KS)) -> MVP
 *  - Else fall back: first one we see for that year = pitcher, second = MVP
 */
function classifyEntry(row, existingForYear) {
  const champion = row.champion || "";
  const runnerUp = row.runnerUp || "";

  const hasStats =
    /\bIP\b/i.test(champion) ||
    /\bER\b/i.test(champion) ||
    /\d+\.\d/.test(champion); // 12.2, 0.71, etc.

  const hasParen = runnerUp.includes("(");

  if (hasStats) {
    return "pitcher";
  }

  if (hasParen) {
    return "mvp";
  }

  // Fallback: if we don't know yet, treat first as pitcher, second as MVP
  if (!existingForYear.pitcher) return "pitcher";
  if (!existingForYear.mvp) return "mvp";

  // If both already set, we don't really care, just ignore as extra
  return "ignore";
}

async function importChampionshipAwardsFromJson() {
  const client = await pool.connect();

  try {
    console.log(
      "🚀 Importing ALL championship awards from championship_awards.json...\n"
    );

    const jsonPath = path.join(__dirname, "../data/championship_awards.json");
    console.log(`📂 Reading JSON: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`championship_awards.json not found at ${jsonPath}`);
    }

    const raw = fs.readFileSync(jsonPath, "utf8");
    const entries = JSON.parse(raw); // array of { year, champion, runnerUp }

    // Build a map: year -> { mvpRow, pitcherRow }
    const byYear = new Map();

    for (const row of entries) {
      const year = parseInt(row.year, 10);
      if (!Number.isFinite(year)) continue;

      const existing = byYear.get(year) || { mvp: null, pitcher: null };
      const kind = classifyEntry(row, existing);

      if (kind === "mvp" && !existing.mvp) {
        existing.mvp = row;
      } else if (kind === "pitcher" && !existing.pitcher) {
        existing.pitcher = row;
      }

      byYear.set(year, existing);
    }

    console.log(`📌 Loaded awards for ${byYear.size} years from JSON\n`);

    // Get all championships we actually have in the DB
    const { rows: champsRows } = await client.query(
      `
      SELECT id, year
      FROM championships
      ORDER BY year
    `
    );

    const champsByYear = new Map(
      champsRows.map((r) => [r.year, { id: r.id, year: r.year }])
    );

    console.log(
      `📊 Found ${champsRows.length} championship rows in the database\n`
    );

    await client.query("BEGIN");

    let updatedMvp = 0;
    let updatedPitcher = 0;
    let skipped = 0;

    for (const [year, award] of byYear.entries()) {
      const champRow = champsByYear.get(year);
      if (!champRow) {
        console.warn(
          `⚠️  Year ${year} exists in JSON but not in championships table, skipping`
        );
        skipped++;
        continue;
      }

      const updates = {};
      let mvpNameStr = null;
      let pitcherNameStr = null;

      // MVP
      if (award.mvp) {
        const { champion: mvpRaw } = award.mvp;
        const { firstName, lastName, full } = normalizeName(mvpRaw);

        if (firstName && lastName) {
          let playerId;
          const existingPlayer = await client.query(
            `
            SELECT id
            FROM players
            WHERE first_name = $1 AND last_name = $2
            LIMIT 1
          `,
            [firstName, lastName]
          );

          if (existingPlayer.rows.length > 0) {
            playerId = existingPlayer.rows[0].id;
            console.log(
              `👤 [${year}] MVP: found existing player "${full}" (id=${playerId})`
            );
          } else {
            const inserted = await client.query(
              `
              INSERT INTO players (first_name, last_name)
              VALUES ($1, $2)
              RETURNING id
            `,
              [firstName, lastName]
            );
            playerId = inserted.rows[0].id;
            console.log(
              `🆕 [${year}] MVP: created new player "${full}" (id=${playerId})`
            );
          }

          updates.mvp_player_id = playerId;
          mvpNameStr = full;
          updatedMvp++;
        } else {
          console.warn(
            `⚠️  [${year}] Could not parse MVP name from "${mvpRaw}", leaving mvp_player_id unchanged`
          );
        }
      }

      // Leading pitcher
      if (award.pitcher) {
        const { champion: pitchRaw } = award.pitcher;
        const { firstName, lastName, full } = normalizeName(pitchRaw);

        if (firstName && lastName) {
          let playerId;
          const existingPlayer = await client.query(
            `
            SELECT id
            FROM players
            WHERE first_name = $1 AND last_name = $2
            LIMIT 1
          `,
            [firstName, lastName]
          );

          if (existingPlayer.rows.length > 0) {
            playerId = existingPlayer.rows[0].id;
            console.log(
              `👤 [${year}] Pitcher: found existing player "${full}" (id=${playerId})`
            );
          } else {
            const inserted = await client.query(
              `
              INSERT INTO players (first_name, last_name)
              VALUES ($1, $2)
              RETURNING id
            `,
              [firstName, lastName]
            );
            playerId = inserted.rows[0].id;
            console.log(
              `🆕 [${year}] Pitcher: created new player "${full}" (id=${playerId})`
            );
          }

          updates.leading_pitcher_id = playerId;
          pitcherNameStr = full;
          updatedPitcher++;
        } else {
          console.warn(
            `⚠️  [${year}] Could not parse pitcher name from "${pitchRaw}", leaving leading_pitcher_id unchanged`
          );
        }
      }

      // If we have no updates for this year, just skip quietly
      if (!updates.mvp_player_id && !updates.leading_pitcher_id) {
        continue;
      }

      // Build dynamic UPDATE
      const setClauses = [];
      const values = [];
      let idx = 1;

      if (updates.mvp_player_id) {
        setClauses.push(`mvp_player_id = $${idx++}`);
        values.push(updates.mvp_player_id);
      }
      if (updates.leading_pitcher_id) {
        setClauses.push(`leading_pitcher_id = $${idx++}`);
        values.push(updates.leading_pitcher_id);
      }

      values.push(year); // final param for WHERE

      const sql = `
        UPDATE championships
        SET ${setClauses.join(", ")}
        WHERE year = $${idx}
      `;

      await client.query(sql, values);

      console.log(
        `✅ [${year}] Updated awards: ${
          mvpNameStr ? `MVP=${mvpNameStr} ` : ""
        }${pitcherNameStr ? `Pitcher=${pitcherNameStr}` : ""}`.trim()
      );
    }

    await client.query("COMMIT");

    console.log("\n================================================");
    console.log(
      "🎉 Championship awards import complete (from championship_awards.json)"
    );
    console.log("================================================");
    console.log(`🏆 MVP rows updated:        ${updatedMvp}`);
    console.log(`⚾ Leading pitcher updated: ${updatedPitcher}`);
    console.log(`⏭️  JSON years skipped:      ${skipped}`);
    console.log("================================================\n");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error during awards import:", err.message);
    console.error(err.stack);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

importChampionshipAwardsFromJson()
  .then(() => {
    console.log("✅ Script finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Script failed:", err);
    process.exit(1);
  });
