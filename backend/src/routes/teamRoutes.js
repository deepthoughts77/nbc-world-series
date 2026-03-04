// backend/src/routes/teamRoutes.js
import { Router } from "express";
import * as teamController from "../controllers/teamController.js";

const router = Router();

router.get("/", teamController.getAllTeams);

// NEW: needed by TeamDetail hook
router.get("/by-name/:name", teamController.getTeamByName);
router.get("/:id/championships", teamController.getTeamChampionships);
router.get("/:id/years", teamController.getTeamYears);

// Existing (used by TeamDetail + PlayerStatsPage team filters)
router.get("/:id/batting", teamController.getTeamBatting);
router.get("/:id/pitching", teamController.getTeamPitching);

export default router;
