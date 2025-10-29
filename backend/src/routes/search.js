import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    const q = question.toLowerCase();

    console.log("Search query:", question);

    // ============================================
    // CHAMPIONSHIPS QUERIES
    // ============================================

    // Who won in [year]?
    const yearMatch = q.match(/(?:who won|winner|champion).*?(\d{4})/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      const result = await pool.query(
        `
        SELECT 
          c.year,
          ct.name as champion_name,
          ct.city as champion_city,
          ct.state,
          rt.name as runner_up_name,
          c.championship_score,
          p.first_name || ' ' || p.last_name as mvp
        FROM championships c
        JOIN teams ct ON c.champion_team_id = ct.id
        LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
        LEFT JOIN players p ON c.mvp_player_id = p.id
        WHERE c.year = $1
      `,
        [year]
      );

      if (result.rows.length > 0) {
        const champ = result.rows[0];
        return res.json({
          answer: `**${
            champ.champion_name
          }** won the ${year} NBC World Series, defeating ${
            champ.runner_up_name || "the runner-up"
          } with a final score of **${champ.championship_score}**.${
            champ.mvp ? `\n\nMVP: **${champ.mvp}**` : ""
          }`,
          data: champ,
          queryType: "championship",
        });
      } else {
        return res.json({
          answer: `No championship data found for ${year}.`,
          data: null,
          queryType: "championship",
        });
      }
    }

    // Recent champions
    if (
      q.includes("recent") &&
      (q.includes("champion") || q.includes("winner"))
    ) {
      const result = await pool.query(`
        SELECT 
          c.year,
          ct.name as champion_name,
          rt.name as runner_up_name,
          c.championship_score,
          p.first_name || ' ' || p.last_name as mvp
        FROM championships c
        JOIN teams ct ON c.champion_team_id = ct.id
        LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
        LEFT JOIN players p ON c.mvp_player_id = p.id
        ORDER BY c.year DESC
        LIMIT 5
      `);

      const champions = result.rows
        .map(
          (r) =>
            `**${r.year}**: ${r.champion_name} defeated ${
              r.runner_up_name || "runner-up"
            } (${r.championship_score})`
        )
        .join("\n");

      return res.json({
        answer: `Here are the most recent NBC World Series champions:\n\n${champions}`,
        data: result.rows,
        queryType: "recentChampions",
      });
    }

    // ============================================
    // MVP QUERIES
    // ============================================

    if (q.includes("mvp")) {
      const yearMatch = q.match(/\d{4}/);
      if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        const result = await pool.query(
          `
          SELECT 
            c.year,
            p.first_name || ' ' || p.last_name as mvp,
            ct.name as team_name
          FROM championships c
          JOIN players p ON c.mvp_player_id = p.id
          JOIN teams ct ON c.champion_team_id = ct.id
          WHERE c.year = $1
        `,
          [year]
        );

        if (result.rows.length > 0) {
          const mvp = result.rows[0];
          return res.json({
            answer: `The ${year} NBC World Series MVP was **${mvp.mvp}** from the ${mvp.team_name}.`,
            data: mvp,
            queryType: "mvp",
          });
        }
      }
    }

    // ============================================
    // RECORDS QUERIES
    // ============================================

    // Batting average record
    if (
      q.includes("batting average") ||
      q.includes("highest avg") ||
      q.includes("batting avg")
    ) {
      const result = await pool.query(`
        SELECT * FROM alltime_records
        WHERE category = 'individual_batting' 
        AND subcategory = 'highest_batting_average'
        AND era = 'modern_wood'
      `);

      if (result.rows.length > 0) {
        const record = result.rows[0];
        return res.json({
          answer: `The highest batting average in the Modern Wood Era is **${record.value_text}** by **${record.player_name}** (${record.team_name}) in ${record.year}. ${record.description}`,
          data: record,
          queryType: "record",
        });
      }
    }

    // Most hits record
    if (q.includes("most hits") || q.includes("hit record")) {
      const result = await pool.query(`
        SELECT * FROM alltime_records
        WHERE category = 'individual_batting' 
        AND subcategory = 'most_hits'
        AND era = 'modern_wood'
      `);

      if (result.rows.length > 0) {
        const record = result.rows[0];
        return res.json({
          answer: `The record for most hits in a single tournament is **${record.value_text}** by **${record.player_name}** (${record.team_name}) in ${record.year}.`,
          data: record,
          queryType: "record",
        });
      }
    }

    // Most RBIs record
    if (
      q.includes("most rbi") ||
      q.includes("rbi record") ||
      q.includes("runs batted in")
    ) {
      const result = await pool.query(`
        SELECT * FROM alltime_records
        WHERE category = 'individual_batting' 
        AND subcategory = 'most_rbis'
        AND era = 'modern_wood'
      `);

      if (result.rows.length > 0) {
        const record = result.rows[0];
        return res.json({
          answer: `The record for most RBIs in a single tournament is **${record.value_text}** by **${record.player_name}** (${record.team_name}) in ${record.year}.`,
          data: record,
          queryType: "record",
        });
      }
    }

    // Most strikeouts (pitcher)
    if (q.includes("strikeout") && q.includes("record")) {
      const result = await pool.query(`
        SELECT * FROM alltime_records
        WHERE category = 'individual_pitching' 
        AND subcategory = 'most_strikeouts'
        AND era = 'modern_wood'
      `);

      if (result.rows.length > 0) {
        const record = result.rows[0];
        return res.json({
          answer: `The record for most strikeouts in a single tournament is **${record.value_text}** by **${record.player_name}** (${record.team_name}) in ${record.year}.`,
          data: record,
          queryType: "record",
        });
      }
    }

    // All records
    if (
      q.includes("all records") ||
      q.includes("show records") ||
      (q.includes("records") && !q.includes("record for"))
    ) {
      const result = await pool.query(`
        SELECT * FROM alltime_records
        WHERE era = 'modern_wood'
        ORDER BY category, subcategory
      `);

      return res.json({
        answer: `Found **${result.rows.length}** Modern Wood Era records. These include batting, pitching, and fielding achievements from 2000-2025.`,
        data: result.rows,
        queryType: "allRecords",
      });
    }

    // ============================================
    // PLAYER STATS QUERIES
    // ============================================

    const playerNameMatch = q.match(
      /(?:stats for|statistics for|about) (.+?)(?:\?|$)/
    );
    if (playerNameMatch || q.includes("stats") || q.includes("statistics")) {
      let playerName = playerNameMatch ? playerNameMatch[1].trim() : null;

      // Try to extract player name from simpler queries
      if (!playerName) {
        const words = q.split(" ");
        const nameWords = words.filter(
          (w) =>
            w.length > 2 &&
            !["stats", "for", "about", "the", "show", "get", "find"].includes(w)
        );
        if (nameWords.length >= 2) {
          playerName = nameWords.join(" ");
        }
      }

      if (playerName) {
        // Search for player
        const result = await pool.query(
          `
          SELECT 
            p.id,
            p.first_name,
            p.last_name,
            p.first_name || ' ' || p.last_name as full_name,
            t.name as team_name,
            p.is_hall_of_fame,
            p.mlb_team
          FROM players p
          LEFT JOIN teams t ON p.team_id = t.id
          WHERE LOWER(p.first_name || ' ' || p.last_name) LIKE $1
          LIMIT 5
        `,
          [`%${playerName}%`]
        );

        if (result.rows.length > 0) {
          const player = result.rows[0];
          let answer = `**${player.full_name}**`;

          if (player.team_name) {
            answer += ` played for the ${player.team_name}`;
          }

          if (player.is_hall_of_fame) {
            answer += `\n\n🏆 **Hall of Fame Member**`;
          }

          if (player.mlb_team) {
            answer += `\n\nMLB Career: ${player.mlb_team}`;
          }

          return res.json({
            answer,
            data: player,
            queryType: "playerStats",
          });
        } else {
          return res.json({
            answer: `No player found matching "${playerName}". Try searching by full name.`,
            data: null,
            queryType: "playerStats",
          });
        }
      }
    }

    // ============================================
    // TOP BATTERS / PITCHERS
    // ============================================

    if (
      q.includes("top batter") ||
      q.includes("best batter") ||
      q.includes("batting leaders")
    ) {
      const yearMatch = q.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 2024;

      return res.json({
        answer: `Top batters data for ${year} would be displayed here. This feature requires tournament statistics to be imported.`,
        data: null,
        queryType: "topBatters",
      });
    }

    // ============================================
    // TEAMS
    // ============================================

    if (
      q.includes("all teams") ||
      q.includes("show teams") ||
      q.includes("list teams")
    ) {
      const result = await pool.query(`
        SELECT name, city, state, league
        FROM teams
        ORDER BY name
      `);

      return res.json({
        answer: `Found **${result.rows.length}** teams in the database.`,
        data: result.rows,
        queryType: "allTeams",
      });
    }

    // ============================================
    // HALL OF FAME
    // ============================================

    if (q.includes("hall of fame")) {
      const result = await pool.query(`
        SELECT 
          p.first_name || ' ' || p.last_name as name,
          t.name as team_name
        FROM players p
        LEFT JOIN teams t ON p.team_id = t.id
        WHERE p.is_hall_of_fame = true
        ORDER BY p.last_name
      `);

      return res.json({
        answer: `Found **${result.rows.length}** Hall of Fame members.`,
        data: result.rows,
        queryType: "hallOfFame",
      });
    }

    // ============================================
    // DEFAULT: NO MATCH
    // ============================================

    return res.json({
      answer: `I couldn't find specific information for that query. Try asking about:\n\n• Championships (e.g., "Who won in 2024?")\n• MVP awards\n• Player statistics\n• Records\n• Hall of Fame members`,
      data: null,
      queryType: "unknown",
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Search failed",
      message: error.message,
    });
  }
});

export default router;
