import { logger } from "@services/logger";
import type { NextFunction, Request, Response } from "express";

export function logRequests(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  logger.info("📥 Incoming request", {
    method: req.method,
    url: req.url,
    body: req.body,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (res.statusCode >= 200 && res.statusCode < 400) {
      logger.info("✅ Response sent", {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${duration}ms`,
      });
    } else {
      logger.error("❌ Response sent with error", {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: `${duration}ms`,
        body: req.body,
      });
    }
  });

  next();
}
