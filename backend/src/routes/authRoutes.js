import { Router } from "express";
import * as authController from "../controllers/authController.js";

const router = Router();

// @route   POST /auth/login
// (Will become /api/auth/login when mounted in index.js)
router.post("/login", authController.login);

export default router;
