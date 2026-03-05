import { GoogleGenerativeAI } from "@google/generative-ai";
import { pool } from "../db.js";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Gemini doesn't support role:"system" — prepend schema context as a
// user/model exchange so the model has full schema awareness.
const SCHEMA_EXCHANGE = [
  {
    role: "user",
    parts: [
      {
        text: `
You are a PostgreSQL expert for the NBC World Series baseball archive.
Here is the exact schema you must use — no other tables or columns exist:

  teams        (id, name, city, state)
  players      (id, first_name, last_name)
  player_stats (id, player_id, team_id, year,
                g, ab, r, h, "2b", "3b", hr, rbi, bb, so,
                sb, sh, hbp, gdp, tb, avg, obp, slg,
                po, a, e, fld)
  pitching_stats (id, player_id, team_id, year,
                  w, l, era, app, gs, cg, sho, cbo, sv,
                  ip, h, r, er, bb, so, "2b", "3b", hr,
                  wp, hbp, bk)
  championships (id, year, champion_team_id, runner_up_team_id,
                 mvp_player_id, mvp_player_id2, championship_score)

Rules:
1. Return ONLY a valid PostgreSQL SELECT statement — no markdown, no explanation.
2. Use ILIKE for name searches.
3. Quote digit-leading column names: "2b", "3b".
4. Always JOIN players/teams when human-readable names are needed.
5. If the question cannot be answered from this schema, return:
   SELECT 'Data not found' AS error;

Acknowledge with: "Ready."
    `.trim(),
      },
    ],
  },
  {
    role: "model",
    parts: [{ text: "Ready." }],
  },
];

export const handleAiQuery = async (req, res) => {
  const prompt = (req.body?.prompt ?? "").toString().trim();

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt." });
  }
  if (!genAI) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY on server." });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent({
      contents: [
        ...SCHEMA_EXCHANGE,
        { role: "user", parts: [{ text: prompt }] },
      ],
    });

    const raw = (result?.response?.text?.() ?? "").trim();

    // Strip accidental markdown fences just in case
    const sql = raw
      .replace(/^```sql\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    if (!sql) {
      return res.status(400).json({ error: "AI returned empty SQL." });
    }

    // Only allow SELECT statements
    if (!/^select\b/i.test(sql)) {
      return res
        .status(400)
        .json({ error: "Invalid query generated.", generatedSql: sql });
    }

    // Block multiple statements (allow a single trailing semicolon)
    const withoutTrailingSemi = sql.replace(/;\s*$/, "");
    if (withoutTrailingSemi.includes(";")) {
      return res
        .status(400)
        .json({
          error: "Invalid query (multiple statements).",
          generatedSql: sql,
        });
    }

    const dbResult = await pool.query(sql);
    return res.json({ data: dbResult.rows, generatedSql: sql });
  } catch (error) {
    console.error("AI Error:", error);

    // Surface DB errors separately so the client can distinguish them
    if (error?.code) {
      return res.status(400).json({
        error: `Database error: ${error.message}`,
        hint: error.hint ?? null,
      });
    }

    return res
      .status(500)
      .json({ error: "The AI couldn't generate a valid query for that." });
  }
};
