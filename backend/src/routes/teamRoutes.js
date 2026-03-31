// backend/src/routes/teamRoutes.js
import { Router } from "express";
import * as teamController from "../controllers/teamController.js";

const router = Router();

/*
  IMPORTANT:
  Put specific routes before dynamic :id routes
  so Express does not treat "totals" as an :id.
*/

// Global team totals page endpoints
router.get("/totals/batting", teamController.getAllTeamBattingTotalsByYear);
router.get("/totals/pitching", teamController.getAllTeamPitchingTotalsByYear);

// Team lookup routes
router.get("/", teamController.getAllTeams);
router.get("/by-name/:name", teamController.getTeamByName);

// Team detail subroutes
router.get("/:id/championships", teamController.getTeamChampionships);
router.get("/:id/years", teamController.getTeamYears);
router.get("/:id/batting", teamController.getTeamBatting);
router.get("/:id/pitching", teamController.getTeamPitching);

// Team detail route - keep LAST
router.get("/:id", teamController.getTeamById);

export default router;
