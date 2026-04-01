// backend/src/controllers/unifiedSearchController.js
//
// GET /api/search?q=...
// Returns grouped results across players, teams, championships, and documents.
// Designed for the global search bar / search results page.

import { pool } from "../db.js";

const MAX_PER_GROUP = 5;

export const unifiedSearch = async (req, res) => {
  const q = (req.query.q || "").trim();

  if (!q || q.length < 2) {
    return res.status(400).json({ success: false, error: "Query too short." });
  }

  const term = `%${q}%`;

  try {
    const [playersRes, teamsRes, champsRes, docsRes] = await Promise.all([
      // ── Players ──────────────────────────────────────────────────────────
      pool.query(
        `SELECT DISTINCT
           p.id,
           p.first_name || ' ' || p.last_name AS name,
           'player' AS type,
           COALESCE(
             (SELECT t.name FROM batting_stats bs JOIN teams t ON t.id = bs.team_id
              WHERE bs.player_id = p.id ORDER BY bs.year DESC LIMIT 1),
             (SELECT t.name FROM pitching_stats ps JOIN teams t ON t.id = ps.team_id
              WHERE ps.player_id = p.id ORDER BY ps.year DESC LIMIT 1)
           ) AS subtitle,
           COALESCE(
             (SELECT MAX(bs.year) FROM batting_stats bs WHERE bs.player_id = p.id),
             (SELECT MAX(ps.year) FROM pitching_stats ps WHERE ps.player_id = p.id)
           ) AS year
         FROM players p
         WHERE (p.first_name || ' ' || p.last_name) ILIKE $1
           AND (
             EXISTS (SELECT 1 FROM batting_stats b WHERE b.player_id = p.id)
             OR EXISTS (SELECT 1 FROM pitching_stats pi WHERE pi.player_id = p.id)
           )
         ORDER BY year DESC NULLS LAST
         LIMIT $2`,
        [term, MAX_PER_GROUP],
      ),

      // ── Teams ─────────────────────────────────────────────────────────────
      pool.query(
        `SELECT
           t.id,
           t.name,
           'team' AS type,
           CASE
             WHEN t.city IS NOT NULL AND t.state IS NOT NULL
               THEN t.city || ', ' || t.state
             WHEN t.city IS NOT NULL THEN t.city
             WHEN t.state IS NOT NULL THEN t.state
             ELSE NULL
           END AS subtitle,
           COUNT(DISTINCT c.year)::int AS champ_count
         FROM teams t
         LEFT JOIN championships c ON c.champion_team_id = t.id
         WHERE t.name ILIKE $1
         GROUP BY t.id, t.name, t.city, t.state
         ORDER BY champ_count DESC, t.name ASC
         LIMIT $2`,
        [term, MAX_PER_GROUP],
      ),

      // ── Championships ─────────────────────────────────────────────────────
      pool.query(
        `SELECT
           c.id,
           c.year::text AS name,
           'championship' AS type,
           ct.name AS champion_name,
           rt.name AS runner_up_name,
           CONCAT(p.first_name, ' ', p.last_name) AS mvp_name,
           c.championship_score
         FROM championships c
         LEFT JOIN teams ct ON ct.id = c.champion_team_id
         LEFT JOIN teams rt ON rt.id = c.runner_up_team_id
         LEFT JOIN players p ON p.id = c.mvp_player_id
         WHERE
           ct.name ILIKE $1
           OR rt.name ILIKE $1
           OR (p.first_name || ' ' || p.last_name) ILIKE $1
           OR c.year::text ILIKE $1
         ORDER BY c.year DESC
         LIMIT $2`,
        [term, MAX_PER_GROUP],
      ),

      // ── Documents ─────────────────────────────────────────────────────────
      pool.query(
        `SELECT
           id,
           title AS name,
           'document' AS type,
           source_name AS subtitle,
           display_year AS year,
           doc_type,
           file_url
         FROM documents
         WHERE is_public = true
           AND (
             title ILIKE $1
             OR description ILIKE $1
             OR display_year ILIKE $1
             OR notes ILIKE $1
           )
         ORDER BY sort_year DESC NULLS LAST
         LIMIT $2`,
        [term, MAX_PER_GROUP],
      ),
    ]);

    const total =
      playersRes.rows.length +
      teamsRes.rows.length +
      champsRes.rows.length +
      docsRes.rows.length;

    return res.json({
      success: true,
      query: q,
      total,
      results: {
        players: playersRes.rows,
        teams: teamsRes.rows,
        championships: champsRes.rows,
        documents: docsRes.rows,
      },
    });
  } catch (err) {
    console.error("unifiedSearch error:", err);
    return res.status(500).json({ success: false, error: "Search failed." });
  }
};
