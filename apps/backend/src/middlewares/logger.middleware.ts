import { pinoHttp } from "pino-http";
import type { Request, Response } from "express";
import { logger } from "@/config/logger.js";

/**
 * Har bir so'rov/javob juftligini structured JSON log ko'rinishida yozadi.
 * requestId req.id sifatida ishlatiladi (requestId.middleware'dan keyin ulanishi kerak).
 */
export const requestLoggerMiddleware = pinoHttp({
  logger,
  genReqId: (req: Request) => req.requestId,
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (req: Request, res: Response) =>
    `${req.method} ${req.url} — ${res.statusCode}`,
  customErrorMessage: (req: Request, res: Response) =>
    `${req.method} ${req.url} — ${res.statusCode} (xatolik)`,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      requestId: req.id
    }),
    res: (res) => ({
      statusCode: res.statusCode
    })
  }
});
