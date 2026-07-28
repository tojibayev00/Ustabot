import { redis } from "@/config/redis.js";
import { logger } from "@/config/logger.js";

/**
 * Cache TTL qiymatlari (Part 4: "CACHE RULES").
 */
export const CACHE_TTL = {
  CATEGORIES: 60 * 60, // 1 soat
  REGIONS: 60 * 60 * 24, // 24 soat
  DISTRICTS: 60 * 60 * 24,
  VILLAGES: 60 * 60 * 24,
  SETTINGS: 60 * 60 * 24,
  WORKERS_LIST: 60 * 5, // 5 daqiqa
  DASHBOARD: 60 * 2, // 2 daqiqa
  SEARCH: 60 * 5
} as const;

/**
 * Cache'dan qiymatni o'qiydi; topilmasa `fetcher` orqali hisoblab, keshlaydi va qaytaradi.
 * Redis o'zi ishlamay qolsa ham (masalan vaqtinchalik uzilish), so'rov `fetcher` orqali
 * to'g'ridan-to'g'ri davom etadi — cache hech qachon ilovani to'xtatib qo'ymasligi kerak.
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (error) {
    logger.warn({ err: error, key }, "Cache'dan o'qishda xatolik, to'g'ridan-to'g'ri DB'ga murojaat qilinmoqda");
  }

  const value = await fetcher();

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    logger.warn({ err: error, key }, "Cache'ga yozishda xatolik");
  }

  return value;
}

export async function invalidateCache(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch (error) {
    logger.warn({ err: error, keys }, "Cache'ni tozalashda xatolik");
  }
}

/** Naqsh (masalan "workers:list:*") bo'yicha barcha kalitlarni topib o'chiradi */
export async function invalidateCacheByPattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      // keyPrefix ioredis tomonidan avtomatik qo'shilgani uchun `del` originalKeys bilan ishlaydi
      await redis.del(...keys.map((k) => k.replace(redis.options.keyPrefix ?? "", "")));
    }
  } catch (error) {
    logger.warn({ err: error, pattern }, "Naqsh bo'yicha cache tozalashda xatolik");
  }
}
