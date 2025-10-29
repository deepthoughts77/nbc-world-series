// backend/src/routes/search2.js
const express = require("express");
const pool = require("../config/database");

const router = express.Router();

/* ---------- quick sanity ping ---------- */
router.get("/ping", (_req, res) => {
  res.json({ ok: true, where: "/api/search2", router: "search2" });
});

/* ---------- helpers ---------- */
const norm = (s) => String(s || "").trim();
const strong = (s) => `**${s}**`;

const looksLikeTeamChampCount = (q) =>
  /\bhow\s+many\s+time/i.test(q) && /\b(champ|title|won|crown)/i.test(q);

async function findTeamByNameFromQuery(q) {
  const cleaned = norm(q)
    .toLowerCase()
    .replace(
      /\b(how|many|time[s]?|have|has|been|crown(ed)?|won|win[s]?|the|a|an|is|are|champ(ion|ionship|ionships)?|title[s]?|by|any|team|which|most)\b/gi,
      " "
    )
    .replace(/\?/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;

  const r1 = await pool.query(
    `SELECT id, name, city, state
       FROM teams
      WHERE name ILIKE $1
      ORDER BY length(name) ASC
      LIMIT 1`,
    [`%${cleaned}%`]
  );
  if (r1.rows[0]) return r1.rows[0];

  const token = cleaned.split(" ").slice(0, 2).join(" ");
  if (!token) return null;

  const r2 = await pool.query(
    `SELECT id, name, city, state
       FROM teams
      WHERE name ILIKE $1
      ORDER BY length(name) ASC
      LIMIT 1`,
    [`%${token}%`]
  );
  return r2.rows[0] || null;
}

async function getTeamChampionshipYears(teamName) {
  const { rows } = await pool.query(
    `SELECT year, runner_up_name, championship_score, mvp
       FROM championships
      WHERE champion_name ILIKE $1
      ORDER BY year DESC`,
    [`%${teamName}%`]
  );
  return rows;
}

/* ---------- POST /api/search2/ask ---------- */
router.post("/ask", async (req, res) => {
  const question = norm(req.body?.question || "");
  const qLower = question.toLowerCase();

  try {
    // “how many times have {team} won…”
    if (looksLikeTeamChampCount(qLower)) {
      const team = await findTeamByNameFromQuery(question);
      if (!team) {
        return res.json({
          answer:
            'I couldn’t identify the team. Try: "How many times have Hutchinson Monarchs won the championship?"',
          queryType: "teamChampionshipHistory",
          data: null,
        });
      }

      const wins = await getTeamChampionshipYears(team.name);
      const count = wins.length;
      const years = wins.map((r) => r.year).sort((a, b) => b - a);

      const highlight = wins
        .slice(0, 5)
        .map((r) => {
          const bits = [String(r.year)];
          if (r.championship_score) bits.push(r.championship_score);
          if (r.runner_up_name) bits.push(`vs ${r.runner_up_name}`);
          if (r.mvp) bits.push(`MVP: ${r.mvp}`);
          return bits.join(" • ");
        })
        .join(" | ");

      return res.json({
        answer: `${strong(team.name)} have won the championship ${strong(
          String(count)
        )} ${count === 1 ? "time" : "times"}${
          years.length ? ` (Years: ${years.join(", ")})` : ""
        }${highlight ? `.  Highlights — ${highlight}.` : ""}`,
        queryType: "teamChampionshipHistory",
        data: {
          team: team.name,
          championships_won: count,
          years: wins.map((r) => ({
            year: r.year,
            runner_up: r.runner_up_name || null,
            score: r.championship_score || null,
            mvp: r.mvp || null,
          })),
        },
      });
    }

    // Fallback
    return res.json({
      answer:
        'Try: "How many times have Hutchinson Monarchs won the championship?"',
      queryType: "unknown",
      data: null,
    });
  } catch (err) {
    console.error("search2 /ask error:", err);
    res.status(500).json({ error: "Search2 failed" });
  }
});

module.exports = router;
