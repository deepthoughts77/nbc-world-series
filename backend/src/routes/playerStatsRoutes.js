// backend/src/routes/playerStatsRoutes.js
import { Router } from "express";
import {
  getPlayerStatsYears,
  getPlayerStatsByYear,
  getPlayerPitchingStatsByYear,
  getPlayerStatsLeaderboard,
  searchPlayerStats,
} from "../controllers/playerStatsController.js";

const router = Router();

// GET /api/player-stats/years
router.get("/years", getPlayerStatsYears);

// Static paths MUST come before /:year to avoid "leaderboard"/"search"
// being swallowed as a year param
router.get("/leaderboard", getPlayerStatsLeaderboard);
router.get("/search", searchPlayerStats);

// GET /api/player-stats/:year          (batting)
router.get("/:year", getPlayerStatsByYear);

// GET /api/player-stats/:year/pitching
router.get("/:year/pitching", getPlayerPitchingStatsByYear);

export default router;
