import { redis } from "@/config/redis.js";

const REFRESH_TOKEN_PREFIX = "session:refresh:";
const USER_SESSIONS_PREFIX = "session:user:";

/**
 * Har bir refresh token uchun Redis'da bitta yozuv saqlanadi:
 *   session:refresh:{tokenId} -> userId   (TTL = refresh token muddati)
 * Va foydalanuvchining barcha faol session'lari to'plami:
 *   session:user:{userId} -> Set<tokenId>
 *
 * Bu ikkalasi orqali:
 *  - Bitta tokenni tekshirish/bekor qilish (rotation)
 *  - Foydalanuvchining BARCHA qurilmalaridan chiqarish (logout all devices)
 * imkoniyati beriladi.
 */
export async function storeRefreshSession(
  userId: string,
  tokenId: string,
  ttlSeconds: number
): Promise<void> {
  const multi = redis.multi();
  multi.set(`${REFRESH_TOKEN_PREFIX}${tokenId}`, userId, "EX", ttlSeconds);
  multi.sadd(`${USER_SESSIONS_PREFIX}${userId}`, tokenId);
  multi.expire(`${USER_SESSIONS_PREFIX}${userId}`, ttlSeconds);
  await multi.exec();
}

export async function isRefreshSessionValid(userId: string, tokenId: string): Promise<boolean> {
  const storedUserId = await redis.get(`${REFRESH_TOKEN_PREFIX}${tokenId}`);
  return storedUserId === userId;
}

export async function revokeRefreshSession(userId: string, tokenId: string): Promise<void> {
  const multi = redis.multi();
  multi.del(`${REFRESH_TOKEN_PREFIX}${tokenId}`);
  multi.srem(`${USER_SESSIONS_PREFIX}${userId}`, tokenId);
  await multi.exec();
}

/** Foydalanuvchining barcha faol refresh sessionlarini bekor qiladi ("Logout from all devices") */
export async function revokeAllUserSessions(userId: string): Promise<void> {
  const tokenIds = await redis.smembers(`${USER_SESSIONS_PREFIX}${userId}`);

  if (tokenIds.length > 0) {
    const multi = redis.multi();
    for (const tokenId of tokenIds) {
      multi.del(`${REFRESH_TOKEN_PREFIX}${tokenId}`);
    }
    multi.del(`${USER_SESSIONS_PREFIX}${userId}`);
    await multi.exec();
  }
}

export async function countActiveSessions(userId: string): Promise<number> {
  return redis.scard(`${USER_SESSIONS_PREFIX}${userId}`);
}
