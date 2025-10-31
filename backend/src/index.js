import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { pool } from "./db.js";
import adminRoutes from "./routes/admin.js";
import recordsRoutes from "./routes/records.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// 🔎 API tracer: logs anything that begins with /api
app.use("/api", (req, res, next) => {
  console.log("API →", req.method, req.originalUrl);
  next();
});
// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_PROD_URL,
  process.env.FRONTEND_ADMIN_URL,
  process.env.FRONTEND_ADMIN_DEV_URL,
  process.env.FRONTEND_ADMIN_PROD_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

console.log(" Starting to register routes...");

// BEFORE: app.use("/api/admin", adminRoutes);
app.use(
  "/api/admin",
  (req, res, next) => {
    console.log("ADMIN PRE →", req.method, req.originalUrl);
    next();
  },
  adminRoutes,
  (req, res) => {
    // If we land here, the admin router didn't match anything
    console.log("ADMIN 404 →", req.method, req.originalUrl);
    res
      .status(404)
      .json({ ok: false, where: "admin-post-router", path: req.originalUrl });
  }
);
console.log(" Registered: /api/admin routes");
app.get("/api/admin/_direct_ping", (req, res) => {
  res.json({ ok: true, where: "index.js (direct)" });
});

// === RECORDS ROUTES (from external file) ===
app.use("/api/records", recordsRoutes);
console.log(" Registered: /api/records routes");

// DIRECT route (bypasses admin.js). If this doesn't respond, routing/order/port is wrong.
app.get("/api/admin/ping", (req, res) => {
  res.json({ ok: true, where: "index.js (direct)" });
});
app.get("/api/admin/_rootping", (req, res) => {
  res.json({ ok: true, where: "index" });
});

// === HEALTH CHECK ===
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});
console.log(" Registered: GET /api/health");

// === DATABASE TEST ===
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as time");
    res.json({ success: true, time: result.rows[0].time });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
console.log(" Registered: GET /api/db-test");

// === STATISTICS OVERVIEW ===
app.get("/api/statistics/overview", async (req, res) => {
  try {
    const champsResult = await pool.query("SELECT COUNT(*) FROM championships");
    const total_championships = parseInt(champsResult.rows[0].count);

    const teamsResult = await pool.query("SELECT COUNT(*) FROM teams");
    const total_teams = parseInt(teamsResult.rows[0].count);

    const mlbResult = await pool.query("SELECT COUNT(*) FROM mlb_alumni");
    const mlb_alumni = parseInt(mlbResult.rows[0].count);

    const hofResult = await pool.query("SELECT COUNT(*) FROM hall_of_fame");
    const hall_of_fame_members = parseInt(hofResult.rows[0].count);

    const mostSuccessfulResult = await pool.query(`
      SELECT
        t.name,
        COUNT(c.id) as championships
      FROM teams t
      LEFT JOIN championships c ON t.id = c.champion_team_id
      GROUP BY t.id, t.name
      ORDER BY championships DESC
      LIMIT 1
    `);

    const most_successful_team = mostSuccessfulResult.rows[0] || {
      name: "—",
      championships: 0,
    };

    res.json({
      total_championships,
      total_teams,
      mlb_alumni,
      hall_of_fame_members,
      most_successful_team,
    });
  } catch (err) {
    console.error(" Overview error:", err);
    res.status(500).json({ error: err.message });
  }
});
console.log(" Registered: GET /api/statistics/overview");

// === CHAMPIONSHIPS LIST ===
app.get("/api/championships", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.year,
        c.championship_score,
        t.name as champion_name,
        t.city as champion_city,
        rt.name as runner_up_name,
        p.first_name || ' ' || p.last_name as mvp
      FROM championships c
      JOIN teams t ON c.champion_team_id = t.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      ORDER BY c.year DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch championships" });
  }
});
console.log(" Registered: GET /api/championships");

// === CHAMPIONSHIP DETAIL ===
app.get("/api/championships/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const result = await pool.query(
      `
      SELECT
        c.year,
        c.championship_score,
        t.name as champion_name,
        t.city as champion_city,
        t.state,
        rt.name as runner_up_name,
        p.first_name || ' ' || p.last_name as mvp
      FROM championships c
      JOIN teams t ON c.champion_team_id = t.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      WHERE c.year = $1
    `,
      [year]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});
console.log(" Registered: GET /api/championships/:year");

// === TEAMS LIST ===
app.get("/api/teams", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.name,
        t.city,
        t.state,
        t.league,
        COUNT(DISTINCT c.id) as championships_won,
        COUNT(DISTINCT tt.tournament_id) as appearances
      FROM teams t
      LEFT JOIN championships c ON t.id = c.champion_team_id
      LEFT JOIN tournament_teams tt ON t.id = tt.team_id
      GROUP BY t.id, t.name, t.city, t.state, t.league
      ORDER BY t.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});
console.log(" Registered: GET /api/teams");

// === TEAM BATTING STATS ===
app.get("/api/teams/:id/batting", async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    const { rows } = await pool.query(
      `SELECT * FROM public.vw_batting_expanded
       WHERE team_id = $1 AND year = $2
       ORDER BY last_name`,
      [id, year]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});
console.log(" Registered: GET /api/teams/:id/batting");

// === TEAM PITCHING STATS ===
app.get("/api/teams/:id/pitching", async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    const { rows } = await pool.query(
      `SELECT * FROM public.vw_pitching_expanded
       WHERE team_id = $1 AND year = $2
       ORDER BY last_name`,
      [id, year]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});
console.log(" Registered: GET /api/teams/:id/pitching");

// === HALL OF FAME ===
app.get("/api/hall-of-fame", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        COALESCE(name, inductee_name) as inductee_name,
        induction_year,
        category,
        bio,
        player_id
      FROM hall_of_fame
      ORDER BY induction_year DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Hall of Fame" });
  }
});
console.log(" Registered: GET /api/hall-of-fame");

// === ENHANCED SEARCH ROUTE ===
app.post("/api/search/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Please provide a question",
      });
    }

    const lower = question.toLowerCase();
    console.log(" Search query:", question);

    // === WHO WON / CHAMPION QUERIES ===
    if (lower.match(/who won|champion|winner/)) {
      const yearMatch = question.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 2025;

      const result = await pool.query(
        `
        SELECT 
          c.year,
          t.name as champion,
          t.city,
          t.state,
          c.championship_score,
          p.first_name || ' ' || p.last_name as mvp,
          rt.name as runner_up
        FROM championships c
        JOIN teams t ON c.champion_team_id = t.id
        LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
        LEFT JOIN players p ON c.mvp_player_id = p.id
        WHERE c.year = $1
      `,
        [year]
      );

      if (result.rows.length > 0) {
        const champ = result.rows[0];
        return res.json({
          success: true,
          answer: `🏆 The ${year} NBC World Series champion was the **${
            champ.champion
          }** from ${champ.city}, ${champ.state}.${
            champ.runner_up ? ` They defeated the ${champ.runner_up}` : ""
          }${
            champ.championship_score
              ? ` with a final score of ${champ.championship_score}`
              : ""
          }.${champ.mvp ? `\n\n⭐ Tournament MVP: **${champ.mvp}**` : ""}`,
          data: result.rows[0],
          queryType: "championship",
        });
      } else {
        return res.json({
          success: true,
          answer: `No championship data found for ${year}.`,
          data: null,
        });
      }
    }

    // === MVP QUERIES ===
    if (lower.match(/mvp|most valuable/)) {
      const yearMatch = question.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0]) : 2025;

      const result = await pool.query(
        `
        SELECT 
          c.year,
          p.first_name || ' ' || p.last_name as mvp,
          t.name as team
        FROM championships c
        LEFT JOIN players p ON c.mvp_player_id = p.id
        LEFT JOIN teams t ON c.champion_team_id = t.id
        WHERE c.year = $1
      `,
        [year]
      );

      if (result.rows.length > 0 && result.rows[0].mvp) {
        const data = result.rows[0];
        return res.json({
          success: true,
          answer: `⭐ The ${year} NBC World Series MVP was **${data.mvp}** from the **${data.team}**.`,
          data: result.rows[0],
          queryType: "mvp",
        });
      } else {
        return res.json({
          success: true,
          answer: `No MVP data available for ${year}.`,
          data: null,
        });
      }
    }

    // === TEAM CHAMPIONSHIP COUNT ===
    if (lower.match(/how many.*champion|total.*champion|championship.*count/)) {
      const teamMatch = lower.match(
        /hutchinson|monarchs|santa barbara|foresters|hays|larks|seattle|studs|liberal|bee jays/i
      );

      if (teamMatch) {
        const searchTerm = `%${teamMatch[0]}%`;
        const result = await pool.query(
          `
          SELECT 
            t.name,
            COUNT(c.id) as championships,
            array_agg(c.year ORDER BY c.year) as years
          FROM teams t
          JOIN championships c ON t.id = c.champion_team_id
          WHERE LOWER(t.name) LIKE $1
          GROUP BY t.name
        `,
          [searchTerm]
        );

        if (result.rows.length > 0) {
          const team = result.rows[0];
          const yearsList = team.years.join(", ");
          return res.json({
            success: true,
            answer: `🏆 **${team.name}** has won **${
              team.championships
            }** NBC World Series championship${
              team.championships > 1 ? "s" : ""
            }.\n\n Years: ${yearsList}`,
            data: team,
            queryType: "teamChampionships",
          });
        }
      }
    }

    // === DECADE QUERIES ===
    if (lower.match(/\d{4}s|decade/)) {
      const decadeMatch = lower.match(/(\d{4})s/);
      if (decadeMatch) {
        const startYear = parseInt(decadeMatch[1]);
        const endYear = startYear + 9;

        const result = await pool.query(
          `
          SELECT 
            c.year,
            t.name as champion,
            p.first_name || ' ' || p.last_name as mvp
          FROM championships c
          JOIN teams t ON c.champion_team_id = t.id
          LEFT JOIN players p ON c.mvp_player_id = p.id
          WHERE c.year BETWEEN $1 AND $2
          ORDER BY c.year
        `,
          [startYear, endYear]
        );

        if (result.rows.length > 0) {
          return res.json({
            success: true,
            answer: ` NBC World Series Champions in the **${startYear}s**:`,
            data: result.rows,
            queryType: "decadeChampions",
          });
        }
      }
    }

    // === STREAK QUERIES ===
    if (lower.match(/streak|consecutive|row|back.?to.?back/)) {
      const result = await pool.query(`
        WITH championship_streaks AS (
          SELECT 
            t.name,
            c.year,
            c.year - ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY c.year) as streak_group
          FROM championships c
          JOIN teams t ON c.champion_team_id = t.id
        ),
        longest_streaks AS (
          SELECT 
            name,
            MIN(year) as start_year,
            MAX(year) as end_year,
            COUNT(*) as consecutive_wins
          FROM championship_streaks
          GROUP BY name, streak_group
        )
        SELECT * FROM longest_streaks
        WHERE consecutive_wins > 1
        ORDER BY consecutive_wins DESC, end_year DESC
        LIMIT 5
      `);

      if (result.rows.length > 0) {
        return res.json({
          success: true,
          answer: ` **Longest Championship Streaks:**`,
          data: result.rows,
          queryType: "championshipStreaks",
        });
      }
    }

    // === WHEN DID TEAM WIN ===
    if (lower.match(/when did|what year.*win|last time.*won/)) {
      const teamMatch = lower.match(
        /hutchinson|monarchs|santa barbara|foresters|hays|larks|seattle|studs|liberal|bee jays|el dorado|broncos/i
      );

      if (teamMatch) {
        const searchTerm = `%${teamMatch[0]}%`;
        const result = await pool.query(
          `
          SELECT 
            c.year,
            t.name as champion,
            c.championship_score,
            p.first_name || ' ' || p.last_name as mvp
          FROM championships c
          JOIN teams t ON c.champion_team_id = t.id
          LEFT JOIN players p ON c.mvp_player_id = p.id
          WHERE LOWER(t.name) LIKE $1
          ORDER BY c.year DESC
          LIMIT 1
        `,
          [searchTerm]
        );

        if (result.rows.length > 0) {
          const champ = result.rows[0];
          return res.json({
            success: true,
            answer: `🏆 **${champ.champion}** last won in **${champ.year}**${
              champ.championship_score
                ? ` with a final score of ${champ.championship_score}`
                : ""
            }.${champ.mvp ? `\n\n⭐ MVP: ${champ.mvp}` : ""}`,
            data: champ,
            queryType: "lastChampionship",
          });
        }
      }
    }

    // === LOCATION QUERIES ===
    if (lower.match(/where.*held|location|venue|stadium|wichita/)) {
      return res.json({
        success: true,
        answer: ` **NBC World Series Location**\n\nThe tournament has been held in **Wichita, Kansas** since **1935**.\n\n📍 **Current Venue**: Riverfront Stadium (formerly Lawrence-Dumont Stadium)\n\n🎟️ The tournament typically runs in late July through early August each year.`,
        data: {
          city: "Wichita",
          state: "Kansas",
          since: 1935,
          venue: "Riverfront Stadium",
        },
        queryType: "location",
      });
    }

    // === SCORING QUERIES ===
    if (lower.match(/highest.*scor|most.*run|biggest.*win/)) {
      return res.json({
        success: true,
        answer: ` **Modern Wood Era Scoring Records:**\n\n🔥 Most runs in a game: **24** by Great Bend KS (vs Hutchinson, 2019)\n\n💪 Most runs in a tournament: **89** by Liberal KS (2015, 11 games)`,
        data: {
          most_runs_game: { team: "Great Bend KS", runs: 24, year: 2019 },
          most_runs_tournament: { team: "Liberal KS", runs: 89, year: 2015 },
        },
        queryType: "scoringRecords",
      });
    }

    // === MLB QUERIES ===
    if (lower.match(/mlb|major league|professional/)) {
      return res.json({
        success: true,
        answer: ` **MLB Alumni from NBC World Series:**\n\nMany NBC players went on to MLB careers, including:\n• **Lance Berkman** (Hays Larks, 1995)\n• **Barry Bonds** (Alaska Goldpanners)\n• **Roger Clemens** (Liberal Bee Jays)\n• **Randy Johnson** (Fairbanks Goldpanners)\n\nCheck the **Hall of Fame** tab for more legendary players!`,
        data: null,
        queryType: "mlbAlumni",
      });
    }

    // === RECENT CHAMPIONS ===
    if (lower.match(/recent|latest|last.*champion/)) {
      const result = await pool.query(`
        SELECT 
          c.year,
          t.name as champion,
          c.championship_score,
          p.first_name || ' ' || p.last_name as mvp
        FROM championships c
        JOIN teams t ON c.champion_team_id = t.id
        LEFT JOIN players p ON c.mvp_player_id = p.id
        ORDER BY c.year DESC
        LIMIT 5
      `);

      if (result.rows.length > 0) {
        return res.json({
          success: true,
          answer: ` Recent NBC World Series Champions:`,
          data: result.rows,
          queryType: "recentChampions",
        });
      }
    }

    // === MOST CHAMPIONSHIPS ===
    if (lower.match(/most championships|most titles|who has won the most/)) {
      const result = await pool.query(`
        SELECT 
          t.name,
          COUNT(c.id) as championships,
          array_agg(c.year ORDER BY c.year) as years
        FROM teams t
        JOIN championships c ON t.id = c.champion_team_id
        GROUP BY t.name
        ORDER BY championships DESC
        LIMIT 5
      `);

      if (result.rows.length > 0) {
        return res.json({
          success: true,
          answer: ` Teams with the most NBC World Series championships:`,
          data: result.rows,
          queryType: "mostChampionships",
        });
      }
    }

    // === FIRST CHAMPION ===
    if (lower.match(/first champion|first winner|earliest/)) {
      const result = await pool.query(`
        SELECT c.year, t.name as champion, t.city, t.state
        FROM championships c
        JOIN teams t ON c.champion_team_id = t.id
        ORDER BY c.year ASC
        LIMIT 1
      `);

      if (result.rows.length > 0) {
        const first = result.rows[0];
        return res.json({
          success: true,
          answer: ` The first NBC World Series champion was the **${first.champion}** from ${first.city}, ${first.state} in **${first.year}**.`,
          data: result.rows[0],
          queryType: "firstChampion",
        });
      }
    }

    // === DEFAULT: HELP ===
    return res.json({
      success: true,
      answer: `I didn't quite understand that question. Here are some things you can ask:\n\n🏆 **Championships:**\n• "Who won in 2025?"\n• "Who was MVP in 2025?"\n• "Recent champions"\n• "Champions in the 2010s"\n• "Championship streaks"\n\n📊 **Teams:**\n• "How many championships has Hutchinson won?"\n• "When did Santa Barbara last win?"\n• "Most championships record"\n\n📍 **Tournament Info:**\n• "Where is the tournament held?"\n• "Highest scoring game"\n• "MLB players from NBC"`,
      data: null,
      queryType: "help",
    });
  } catch (err) {
    console.error(" Search error:", err);
    return res.status(500).json({
      success: false,
      error: "Query failed",
      message: err.message,
    });
  }
});
console.log(" Registered: POST /api/search/ask");

console.log("\n All routes registered successfully!\n");

// ---- Serve React build (after API routes) ----
const frontendBuild = path.resolve(__dirname, "..", "..", "frontend", "build");
app.use(express.static(frontendBuild));
const indexHtml = path.join(frontendBuild, "index.html");

// Avoid hijacking API or static asset requests; send index.html for everything else
// Serve React index.html for anything NOT starting with /api
if (fs.existsSync(indexHtml)) {
  app.use(express.static(frontendBuild));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendBuild, "index.html"));
  });
} else {
  // helpful message in case the build isn't there
  app.get("/", (req, res) => {
    res.status(200).send("Frontend build not found yet. API is running.");
  });
}
const PORT = process.env.PORT || 5000;

// For Vercel serverless - just export the app
export default app;

// Only start server if running locally (not on Vercel)
if (process.env.NODE_ENV !== "1") {
  app.listen(PORT, () => {
    console.log(` API running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health\n`);
  });
}
