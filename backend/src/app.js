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

// Basic request tracer
app.use((req, _res, next) => {
  console.log("", req.method, req.url);
  next();
});

// CORS
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
    origin: (origin, cb) => {
      // allow server-to-server, curl, Postman
      if (!origin) return cb(null, true);

      // allow anything in allowed list
      if (allowedOrigins.includes(origin)) return cb(null, true);

      // allow any onrender.com subdomain (handy if you redeploy)
      if (origin.endsWith(".onrender.com")) return cb(null, true);

      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan("dev"));

// API routes
app.use("/api", apiRouter);

// error handler (if you use it in your project)
app.use(errorHandler);

// Serve React build if present
const frontendBuild = path.resolve(__dirname, "..", "..", "frontend", "build");
const indexHtml = path.join(frontendBuild, "index.html");

if (fs.existsSync(indexHtml)) {
  app.use(express.static(frontendBuild));

  // Any route NOT starting with /api -> React
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(indexHtml);
  });

  console.log(` Serving frontend from: ${frontendBuild}`);
} else {
  console.warn(` Frontend build not found at: ${frontendBuild}`);
  app.get("/", (_req, res) => {
    res.status(200).send("Frontend build not found. API is running.");
  });
}

export default app;
