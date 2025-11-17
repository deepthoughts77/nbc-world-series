import { pool } from "../db.js";

export const handleSearch = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res
        .status(400)
        .json({ success: false, error: "No question provided" });
    }

    const lower = question.toLowerCase();
    console.log("🔍 Search:", question);

    // SANTA BARBARA (specific team)
    if (lower.includes("santa barbara")) {
      const result = await pool.query(`
    SELECT c.year, t.name, t.city, t.state
    FROM championships c
    JOIN teams t ON c.champion_team_id = t.id
    WHERE LOWER(t.name) LIKE '%santa barbara%'
    ORDER BY c.year DESC
  `);

      return res.json({
        success: true,
        answer: `Santa Barbara has won ${
          result.rows.length
        } championships: ${result.rows.map((r) => r.year).join(", ")}`,
        data: result.rows,
      });
    }

    // TOURNAMENT FOUNDED/HISTORY
    if (
      lower.match(
        /when.*tournament.*found|when.*tournament.*start|when.*establish|tournament.*history|how long|since when/i
      )
    ) {
      return res.json({
        success: true,
        answer:
          "The NBC World Series was founded in 1935 in Wichita, Kansas. It has been held annually for 91 tournaments spanning 90 years (1935-2025), making it one of the longest-running amateur baseball tournaments in American history.",
      });
    }

    // MVP QUERIES (check BEFORE "most championships")
    if (lower.match(/mvp|most valuable player/i)) {
      try {
        const result = await pool.query(`
      SELECT 
        CONCAT(p.first_name, ' ', p.last_name) as player_name,
        COUNT(*) as mvp_count,
        array_agg(c.year ORDER BY c.year DESC) as years
      FROM championships c
      JOIN players p ON c.mvp_player_id = p.id
      WHERE c.mvp_player_id IS NOT NULL
      GROUP BY p.id, p.first_name, p.last_name
      ORDER BY mvp_count DESC
      LIMIT 10
    `);

        if (result.rows.length > 0) {
          const top = result.rows[0];
          let answer = `${top.player_name} has won the most MVP awards with ${
            top.mvp_count
          } MVP${top.mvp_count > 1 ? "s" : ""}.`;

          if (top.years && top.years.length > 0) {
            answer += `\n\nMVP years: ${top.years.join(", ")}`;
          }

          if (result.rows.length > 1) {
            answer += "\n\nTop MVP winners:\n";
            result.rows.slice(0, 5).forEach((r, i) => {
              answer += `${i + 1}. ${r.player_name} - ${r.mvp_count} MVP${
                r.mvp_count > 1 ? "s" : ""
              }\n`;
            });
          }

          return res.json({
            success: true,
            answer: answer.trim(),
            data: result.rows,
          });
        }
      } catch (error) {
        console.error("MVP query error:", error);
      }

      return res.json({
        success: true,
        answer:
          "MVP data is limited in the database. Many historical tournaments did not record MVP awards.",
      });
    }

    // YOUNGEST/OLDEST MVP
    if (lower.match(/youngest|oldest|age/i) && lower.match(/mvp/i)) {
      return res.json({
        success: true,
        answer:
          "MVP age data is not tracked in the database. The tournament records include MVP names and years, but not player ages at the time of the award.",
      });
    }

    // PITCHING (check BEFORE batting to avoid confusion)
    if (lower.match(/pitch|pitcher|strikeout|strike out|era/i)) {
      return res.json({
        success: true,
        answer:
          "Tommy Hanson recorded 27 strikeouts for Aloha OR Knights in 2005, the most in a single tournament. For best pitching performance, he posted a dominant strikeout rate during the tournament.",
      });
    }

    // BATTING AVERAGE (now won't catch "pitching average")
    if (lower.match(/batting|bat.*average|hit.*average/i)) {
      return res.json({
        success: true,
        answer:
          "Grant Nottlemann holds the highest batting average at .750 for Great Bend KS Bat Cats in 2023 (12 hits in 16 at-bats over 5 games).",
      });
    }

    // HOME RUNS
    if (lower.match(/home run|hr|homer/i)) {
      return res.json({
        success: true,
        answer:
          "Nolan Reimold hit 4 home runs for Hays KS Larks in 2004, the most in tournament history during the modern wood bat era.",
      });
    }

    // MOST CHAMPIONSHIPS (TOTAL)
    if (lower.match(/most championship|most title|who.*won.*most/i)) {
      const result = await pool.query(`
    SELECT t.name, COUNT(*) as total
    FROM championships c
    JOIN teams t ON c.champion_team_id = t.id
    GROUP BY t.name
    ORDER BY total DESC
    LIMIT 1
  `);

      return res.json({
        success: true,
        answer: `${result.rows[0].name} has won the most championships with ${result.rows[0].total} titles.`,
        data: result.rows,
      });
    }

    // CONSECUTIVE CHAMPIONSHIPS
    if (lower.match(/consecutive|streak/i)) {
      return res.json({
        success: true,
        answer:
          "Santa Barbara Foresters hold the record with 4 consecutive championships from 1997-2000.",
      });
    }

    // WHO WON IN [YEAR]
    const yearMatch = question.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);
      const result = await pool.query(
        `
    SELECT t.name, t.city, t.state, c.year
    FROM championships c
    JOIN teams t ON c.champion_team_id = t.id
    WHERE c.year = $1
  `,
        [year]
      );

      if (result.rows.length > 0) {
        const r = result.rows[0];
        return res.json({
          success: true,
          answer: `The ${year} NBC World Series champion was ${r.name} from ${r.city}, ${r.state}.`,
          data: result.rows,
        });
      }

      return res.json({
        success: true,
        answer: `No championship data found for ${year}. The tournament may not have been held that year.`,
      });
    }

    // DEFAULT
    return res.json({
      success: true,
      answer:
        "Try asking:\n• How many championships has Santa Barbara won?\n• Who won the most championships?\n• Who won the most consecutive championships?\n• Who hit the most home runs?\n• Who has the highest batting average?\n• Who was the best pitcher?\n• Who won in [year]?",
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while processing your search",
    });
  }
};
