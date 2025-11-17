import { Router } from "express";
import * as statsController from "../controllers/statsController.js";

const router = Router();

// When mounted at /statistics → /api/statistics/overview
router.get("/overview", statsController.getStatsOverview);

// When mounted at /pitching-stats → /api/pitching-stats/ and /api/pitching-stats/years
router.get("/", (req, res, next) => {
  // Determine which controller to use based on the mount path
  if (req.baseUrl.includes("player-stats")) {
    return statsController.getPlayerStats(req, res, next);
  } else if (req.baseUrl.includes("pitching-stats")) {
    return statsController.getPitchingStats(req, res, next);
  }
  next();
});

router.get("/years", (req, res, next) => {
  if (req.baseUrl.includes("player-stats")) {
    return statsController.getPlayerStatsYears(req, res, next);
  } else if (req.baseUrl.includes("pitching-stats")) {
    return statsController.getPitchingStatsYears(req, res, next);
  }
  next();
});

export default router;
