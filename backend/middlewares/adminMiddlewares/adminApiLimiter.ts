import rateLimit from "express-rate-limit";

export const adminApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes duration window
  max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
