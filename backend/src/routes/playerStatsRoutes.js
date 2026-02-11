// backend/src/routes/playerStatsRoutes.js
import { Router } from "express";
import {
  getPlayerStatsYears,
  getPlayerStatsByYear,
  getPlayerPitchingStatsByYear,
} from "../controllers/playerStatsController.js";

const router = Router();

// GET /api/player-stats/years
router.get("/years", getPlayerStatsYears);

// GET /api/player-stats/:year  (batting or combined table)
router.get("/:year", getPlayerStatsByYear);

// GET /api/player-stats/:year/pitching (pitching table)
router.get("/:year/pitching", getPlayerPitchingStatsByYear);

export default router;
