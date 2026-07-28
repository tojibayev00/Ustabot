import { Router } from "express";
import { isDatabaseHealthy } from "@/config/database.js";
import { isRedisHealthy } from "@/config/redis.js";
import { isCloudinaryHealthy } from "@/config/cloudinary.js";
import { env } from "@/config/env.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const healthRouter = Router();

const startedAt = Date.now();

/**
 * GET /health
 * Umumiy tizim holatini va infratuzilma komponentlarining ishlashini qaytaradi.
 * Public — autentifikatsiya talab qilinmaydi.
 */
healthRouter.get(
  "/health",
  asyncHandler(async (_req, res) => {
    const [databaseOk, redisOk, cloudinaryOk] = await Promise.all([
      isDatabaseHealthy(),
      isRedisHealthy(),
      isCloudinaryHealthy()
    ]);

    const memoryUsage = process.memoryUsage();
    const allHealthy = databaseOk && redisOk && cloudinaryOk;

    res.status(allHealthy ? 200 : 503).json({
      success: allHealthy,
      data: {
        status: allHealthy ? "healthy" : "degraded",
        version: env.APP_VERSION,
        environment: env.NODE_ENV,
        serverTime: new Date().toISOString(),
        uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
        memory: {
          rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
          heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024)
        },
        services: {
          database: databaseOk ? "up" : "down",
          redis: redisOk ? "up" : "down",
          cloudinary: cloudinaryOk ? "up" : "down"
        }
      },
      meta: {},
      message: allHealthy ? "Tizim sog'lom" : "Ba'zi servislar ishlamayapti"
    });
  })
);

/**
 * GET /ready
 * Faqat Database va Redis ulanishini tekshiradi — Docker/K8s "readiness probe" uchun.
 */
healthRouter.get(
  "/ready",
  asyncHandler(async (_req, res) => {
    const [databaseOk, redisOk] = await Promise.all([isDatabaseHealthy(), isRedisHealthy()]);
    const ready = databaseOk && redisOk;

    res.status(ready ? 200 : 503).json({
      success: ready,
      data: { ready },
      meta: {},
      message: ready ? "Tayyor" : "Hali tayyor emas"
    });
  })
);
