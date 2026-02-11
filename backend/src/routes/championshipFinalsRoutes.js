// backend/src/routes/championshipFinalsRoutes.js
import { Router } from "express";
import {
  getFinalForYear,
  getFinalsForYear,
  getFinalsForTeam,
  getMvpForYear,
} from "../controllers/championshipFinalsController.js";

const router = Router();

// The endpoint your frontend is calling:
router.get("/:year/final", getFinalForYear);

// Compatibility (if any older code uses plural):
router.get("/:year/finals", getFinalsForYear);

// Team finals (if you ever link it)
router.get("/:year/finals/team/:teamId", getFinalsForTeam);

// MVP endpoint:
router.get("/:year/mvp", getMvpForYear);

export default router;
