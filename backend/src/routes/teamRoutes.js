import { Router } from "express";
import * as teamController from "../controllers/teamController.js";

const router = Router();

router.get("/", teamController.getAllTeams);
router.get("/:id/batting", teamController.getTeamBatting);
router.get("/:id/pitching", teamController.getTeamPitching);

export default router;
