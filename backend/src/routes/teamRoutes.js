// backend/src/routes/teamRoutes.js
import { Router } from "express";
import * as teamController from "../controllers/teamController.js";

const router = Router();

/*
  IMPORTANT — Route ordering:
  Specific string routes must come before dynamic :id routes
  so Express does not treat "totals" or "by-name" as an :id.
*/

// ── Global team totals (all teams, by year) ───────────────────────────────
router.get("/totals/batting", teamController.getAllTeamBattingTotalsByYear);
router.get("/totals/pitching", teamController.getAllTeamPitchingTotalsByYear);

// ── Team lookup ───────────────────────────────────────────────────────────
router.get("/", teamController.getAllTeams);
router.get("/by-name/:name", teamController.getTeamByName);

// ── Team detail subroutes (must come before /:id) ─────────────────────────
router.get("/:id/championships", teamController.getTeamChampionships);
router.get("/:id/years", teamController.getTeamYears);
router.get("/:id/batting", teamController.getTeamBatting);
router.get("/:id/pitching", teamController.getTeamPitching);
router.get("/:id/totals/batting", teamController.getTeamBattingTotalsByYear);
router.get("/:id/totals/pitching", teamController.getTeamPitchingTotalsByYear);

// ── Team detail — keep LAST ───────────────────────────────────────────────
router.get("/:id", teamController.getTeamById);

export default router;
