import Redis from "ioredis";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

/**
 * Yagona Redis client instance.
 * Cache, rate-limiting va BullMQ queue'lar shu instance orqali ishlaydi.
 */
export const redis = new Redis(env.REDIS_URL, {
  keyPrefix: env.REDIS_PREFIX,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: true,
  retryStrategy: (attempt: number) => Math.min(attempt * 200, 5000)
});

redis.on("connect", () => {
  logger.info("✅ Redis bilan ulanish o'rnatildi");
});

redis.on("error", (error) => {
  logger.error({ err: error }, "Redis xatoligi");
});

/**
 * BullMQ uchun alohida Redis connection (maxRetriesPerRequest null bo'lishi shart).
 * Cache uchun ishlatilgan `redis` instance'ni queue bilan aralashtirmaslik tavsiya etiladi,
 * shuning uchun ikkinchi connection yaratiladi.
 */
export function createQueueConnection(): Redis {
  return new Redis(env.REDIS_URL, {
    keyPrefix: env.REDIS_PREFIX,
    maxRetriesPerRequest: null,
    enableReadyCheck: true
  });
}

export async function connectRedis(): Promise<void> {
  await redis.connect();
}

export async function disconnectRedis(): Promise<void> {
  redis.disconnect();
  logger.info("Redis bilan ulanish yopildi");
}

export async function isRedisHealthy(): Promise<boolean> {
  try {
    const pong = await redis.ping();
    return pong === "PONG";
  } catch (error) {
    logger.error({ err: error }, "Redis health check muvaffaqiyatsiz");
    return false;
  }
}
