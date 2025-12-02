// backend/src/routes/statisticsRoutes.js
import { Router } from "express";
import * as statsController from "../controllers/statsController.js";

const router = Router();

// When mounted at /statistics → /api/statistics/overview
router.get("/overview", statsController.getStatsOverview);

// When mounted at /player-stats or /pitching-stats at /api
//   /api/player-stats          → list batting stats (with filters)
//   /api/player-stats/years    → batting years
//   /api/pitching-stats        → list pitching stats
//   /api/pitching-stats/years  → pitching years
router.get("/", (req, res, next) => {
  if (req.baseUrl.includes("player-stats")) {
    return statsController.getPlayerStats(req, res, next);
  }
  if (req.baseUrl.includes("pitching-stats")) {
    return statsController.getPitchingStats(req, res, next);
  }
  return next();
});

router.get("/years", (req, res, next) => {
  if (req.baseUrl.includes("player-stats")) {
    return statsController.getPlayerStatsYears(req, res, next);
  }
  if (req.baseUrl.includes("pitching-stats")) {
    return statsController.getPitchingStatsYears(req, res, next);
  }
  return next();
});

export default router;
