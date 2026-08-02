import { Redis } from "ioredis";
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
 * BullMQ uchun alohida Redis connection.
 * DIQQAT: bu yerda `keyPrefix` ISHLATILMAYDI — BullMQ ioredis'ning
 * o'z key-prefiksini qo'llab-quvvatlamaydi ("BullMQ: ioredis does not
 * support ioredis prefixes, use the prefix option instead"). Prefiks kerak
 * bo'lsa, u BullMQ Queue/Worker yaratilayotganda `prefix` optioni orqali
 * beriladi (config/queue.ts).
 */
export function createQueueConnection(): Redis {
  return new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true
  });
}

/**
 * DIQQAT: Redis'ga birinchi ulanish urinishi vaqtincha muvaffaqiyatsiz bo'lishi mumkin
 * (masalan Railway'ning ichki tarmog'ida qisqa "ECONNRESET" holati) — bu KUTILGAN va
 * halokatli emas. `retryStrategy` orqali ioredis orqa fonda avtomatik qayta ulanishda
 * davom etadi. Shuning uchun bu yerda xatolik butun serverni to'xtatib qo'ymaydi,
 * faqat ogohlantirish sifatida logga yoziladi.
 */
export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (error) {
    logger.warn(
      { err: error },
      "Redis'ga birinchi urinishda ulanib bo'lmadi — orqa fonda avtomatik qayta urinilmoqda"
    );
  }
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
