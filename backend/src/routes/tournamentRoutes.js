import { Router } from "express";
import * as tournamentController from "../controllers/tournamentController.js";

const router = Router();

// @route   GET /api/tournaments/:year
// @desc    Get tournament details and all participating teams
router.get("/:year", tournamentController.getTournamentByYear);

export default router;
