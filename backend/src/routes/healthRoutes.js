import { Router } from "express";
import * as healthController from "../controllers/healthController.js";

const router = Router();

router.get("/health", healthController.getHealth);
router.get("/db-test", healthController.getDbTest);
router.get("/which-db", healthController.getWhichDb);
router.get("/dbcheck", healthController.getDbCheck);

export default router;
