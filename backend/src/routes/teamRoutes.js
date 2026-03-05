// backend/src/routes/teamRoutes.js
import { Router } from "express";
import * as teamController from "../controllers/teamController.js";

const router = Router();

router.get("/", teamController.getAllTeams);
router.get("/by-name/:name", teamController.getTeamByName);
router.get("/:id/championships", teamController.getTeamChampionships);
router.get("/:id/years", teamController.getTeamYears);
router.get("/:id/batting", teamController.getTeamBatting);
router.get("/:id/pitching", teamController.getTeamPitching);
router.get("/:id", teamController.getTeamById); // ← add this, must be LAST

export default router;
