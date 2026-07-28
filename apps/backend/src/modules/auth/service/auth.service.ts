import { randomUUID } from "node:crypto";
import { authRepository } from "@/modules/auth/repository/auth.repository.js";
import { verifyTelegramInitData } from "@/shared/telegramInitData.helper.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "@/shared/jwt.helper.js";
import {
  storeRefreshSession,
  isRefreshSessionValid,
  revokeRefreshSession,
  revokeAllUserSessions
} from "@/shared/sessionStore.js";
import { parseDurationToSeconds } from "@/utils/duration.js";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { toAuthenticatedUserInfo } from "@/modules/auth/dto/auth.dto.js";
import type { AuthTokens, TelegramAuthResult, AuthenticatedUserInfo } from "@/modules/auth/types/auth.types.js";
import type { Role } from "@/constants/roles.js";
import { MESSAGES } from "@/constants/messages.js";

const REFRESH_TTL_SECONDS = parseDurationToSeconds(env.JWT_REFRESH_EXPIRES_IN);
const ACCESS_TTL_SECONDS = parseDurationToSeconds(env.JWT_ACCESS_EXPIRES_IN);

async function issueTokens(userId: string, telegramId: string, role: Role): Promise<AuthTokens> {
  const tokenId = randomUUID();

  const accessToken = signAccessToken({ sub: userId, telegramId, role });
  const refreshToken = signRefreshToken({ sub: userId, tokenId });

  await storeRefreshSession(userId, tokenId, REFRESH_TTL_SECONDS);

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TTL_SECONDS
  };
}

export const authService = {
  /**
   * Telegram Mini App orqali autentifikatsiya.
   * initData Telegram HMAC-SHA256 orqali tekshiriladi — frontend'dan kelgan
   * hech qanday foydalanuvchi ma'lumotiga bevosita ishonilmaydi (Part 9: Security).
   */
  async authenticateWithTelegram(initData: string): Promise<TelegramAuthResult> {
    const parsed = verifyTelegramInitData(initData);

    if (!parsed) {
      logger.warn("Telegram initData tekshiruvidan o'tmadi");
      throw new UnauthorizedError(MESSAGES.TELEGRAM_AUTH_FAILED);
    }

    const { user: tgUser } = parsed;
    const telegramId = String(tgUser.id);

    const user = await authRepository.upsertFromTelegram({
      telegramId,
      firstName: tgUser.first_name,
      lastName: tgUser.last_name,
      username: tgUser.username,
      languageCode: tgUser.language_code,
      photoUrl: tgUser.photo_url
    });

    if (user.isBlocked) {
      throw new ForbiddenError("Sizning hisobingiz bloklangan");
    }

    const tokens = await issueTokens(user.id, user.telegramId, user.role);

    return {
      user: toAuthenticatedUserInfo(user, { isWorker: user.worker !== null }),
      tokens
    };
  },

  /**
   * Refresh token rotation: eski token darhol bekor qilinadi,
   * yangi access + refresh token juftligi qaytariladi.
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError("Refresh token yaroqsiz yoki muddati tugagan");
    }

    const isValid = await isRefreshSessionValid(payload.sub, payload.tokenId);
    if (!isValid) {
      throw new UnauthorizedError("Refresh token bekor qilingan. Qaytadan kiring");
    }

    const user = await authRepository.findById(payload.sub);
    if (!user || user.isBlocked) {
      await revokeRefreshSession(payload.sub, payload.tokenId);
      throw new UnauthorizedError("Foydalanuvchi topilmadi yoki bloklangan");
    }

    // Eski tokenni darhol bekor qilamiz (rotation)
    await revokeRefreshSession(payload.sub, payload.tokenId);

    return issueTokens(user.id, user.telegramId, user.role);
  },

  async logout(userId: string, refreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      if (payload.sub === userId) {
        await revokeRefreshSession(userId, payload.tokenId);
      }
    } catch {
      // Token allaqachon yaroqsiz bo'lsa ham logout muvaffaqiyatli hisoblanadi
    }
  },

  async logoutAllDevices(userId: string): Promise<void> {
    await revokeAllUserSessions(userId);
  },

  async getMe(userId: string): Promise<AuthenticatedUserInfo> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedError();
    }
    return toAuthenticatedUserInfo(user, { isWorker: user.worker !== null });
  }
};
