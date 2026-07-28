import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import type { Request, Response } from "express";
import { redis } from "@/config/redis.js";
import { env } from "@/config/env.js";
import { MESSAGES } from "@/constants/messages.js";

function buildRedisStore(prefix: string): RedisStore {
  return new RedisStore({
    // @ts-expect-error — ioredis'ning call signature'i rate-limit-redis kutgan tipdan farq qiladi, runtime'da mos
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: `rl:${prefix}:`
  });
}

function tooManyRequestsHandler(_req: Request, res: Response): void {
  res.status(429).json({
    success: false,
    error: {
      message: MESSAGES.TOO_MANY_REQUESTS,
      status: 429,
      code: "TOO_MANY_REQUESTS",
      details: []
    }
  });
}

/** Umumiy API uchun: 100 so'rov/daqiqa */
export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildRedisStore("general"),
  handler: tooManyRequestsHandler
});

/** Autentifikatsiya endpointlari uchun: 20 so'rov/daqiqa */
export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildRedisStore("auth"),
  handler: tooManyRequestsHandler
});

/** Fayl yuklash uchun: 10 so'rov/daqiqa */
export const uploadRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_UPLOAD_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildRedisStore("upload"),
  handler: tooManyRequestsHandler
});

/** Shikoyat yuborish uchun: 20 so'rov/soat */
export const reportRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: env.RATE_LIMIT_REPORT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildRedisStore("report"),
  handler: tooManyRequestsHandler
});
