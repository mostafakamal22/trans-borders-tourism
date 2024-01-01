import rateLimit from "express-rate-limit";

import { Request } from "express";

const keyGenerator: (req: Request) => Promise<string> = async (req) => {
  const ipAddress =
    req.headers["x-real-ip"] || (req.socket && req.socket.remoteAddress);

  // Assuming ipAddress is always a string, if not, handle accordingly
  return Promise.resolve(ipAddress as string);
};

export const adminApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes duration window
  max: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator,
});
