import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import pinoHttp from "pino-http";
import routes from "./routes/index.js";
import logger from "./utils/logger.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimit.js";
import prisma from "./config/database.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(pinoHttp({ logger }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || "./uploads";
const resolvedUploadDir = path.resolve(process.cwd(), uploadDir);
app.use("/uploads", express.static(resolvedUploadDir));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/admin/auth", authLimiter);
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter, routes);

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
      version: pkg.version
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "disconnected",
      version: pkg.version
    });
  }
});

app.use(notFound);
app.use(errorHandler);

export default app;
