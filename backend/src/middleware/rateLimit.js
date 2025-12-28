import rateLimit from "express-rate-limit";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const authLimit = Number(process.env.AUTH_RATE_LIMIT) || 10;
const apiLimit = Number(process.env.API_RATE_LIMIT) || 100;

export const authLimiter = rateLimit({
  windowMs,
  limit: authLimit,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: "Too many login attempts. Please try again later." }
});

export const apiLimiter = rateLimit({
  windowMs,
  limit: apiLimit,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests. Please slow down." }
});
