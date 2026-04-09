import rateLimit from "express-rate-limit";

/**
 * Global rate limiter middleware.
 */
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

