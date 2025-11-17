import { Router } from "express";
import * as hofController from "../controllers/hofController.js";

const router = Router();

// @route   GET /api/hall-of-fame/
// @desc    Get all HOF members (with search & pagination)
router.get("/", hofController.getAllHallOfFameMembers);

// @route   GET /api/hall-of-fame/:id
// @desc    Get a single HOF member by ID
router.get("/:id", hofController.getHallOfFameMemberById);

export default router;
