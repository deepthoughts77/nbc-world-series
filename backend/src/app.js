// backend/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import apiRouter from "./routes/index.js";
import errorHandler from "./utils/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_PROD_URL,
  process.env.FRONTEND_ADMIN_URL,
  process.env.FRONTEND_ADMIN_DEV_URL,
  process.env.FRONTEND_ADMIN_PROD_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow server-to-server requests (no Origin header) and listed origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin not allowed — ${origin}`));
    },
    credentials: true,
  }),
);

// ── Core middleware ───────────────────────────────────────────────────────
app.use(express.json());
app.use(morgan("dev"));

// ── API routes ────────────────────────────────────────────────────────────
// Single mount point. All sub-routes live in routes/index.js.
// Do NOT add duplicate app.use("/api/championships", ...) here —
// championshipRoutes is already mounted inside apiRouter.
app.use("/api", apiRouter);

// ── Serve React build ─────────────────────────────────────────────────────
const frontendBuild = path.resolve(__dirname, "..", "..", "frontend", "build");
const indexHtml = path.join(frontendBuild, "index.html");

if (fs.existsSync(indexHtml)) {
  app.use(express.static(frontendBuild));
  // Any non-API path gets the React shell
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(indexHtml));
  console.log(`Serving frontend from: ${frontendBuild}`);
} else {
  console.warn(`Frontend build not found at: ${frontendBuild}`);
  app.get("/", (_req, res) =>
    res.status(200).send("Frontend build not found. API is running."),
  );
}

// ── Error handler (must be last) ──────────────────────────────────────────
app.use(errorHandler);

export default app;
