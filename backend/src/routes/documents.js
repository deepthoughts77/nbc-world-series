// src/routes/documents.js
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentYears,
  deleteDocument,
} from "../controllers/documentsController.js";

const router = Router();

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
      cb(null, safeName);
    },
  }),
  limits: {
    fileSize: 300 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."), false);
    }
  },
});

router.get("/years", getDocumentYears);
router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.post("/upload", upload.single("file"), uploadDocument);
router.delete("/:id", deleteDocument);

export default router;
