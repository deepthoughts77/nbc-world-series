import { Router } from "express";
import * as statsController from "../controllers/statsController.js";

const router = Router();

// @route   GET /api/statistics/overview
// @desc    Get high-level stats (total championships, teams, etc.)
router.get("/overview", statsController.getStatsOverview);

// @route   GET /api/player-stats
// @desc    Get batting stats, optionally filtered by year
router.get("/player-stats", statsController.getPlayerStats);

// @route   GET /api/player-stats/years
// @desc    Get list of available years for player stats
router.get("/player-stats/years", statsController.getPlayerStatsYears);

// @route   GET /api/pitching-stats
// @desc    Get pitching stats (placeholder for now)
router.get("/pitching-stats", statsController.getPitchingStats);

// @route   GET /api/pitching-stats/years
// @desc    Get available years for pitching stats
router.get("/pitching-stats/years", statsController.getPitchingStatsYears);

export default router;
