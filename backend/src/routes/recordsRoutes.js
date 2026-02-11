// backend/src/routes/recordsRoutes.js
import { Router } from "express";
import { getRecordsOverview } from "../controllers/recordsController.js";

const router = Router();

// Overview payload used by the Records page
router.get("/overview", getRecordsOverview);

export default router;
