import type { NextFunction, Request, Response } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { verifyAccessToken } from "@/shared/jwt.helper.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length).trim();
}

/**
 * `Authorization: Bearer <token>` headerini tekshiradi va
 * to'g'ri bo'lsa `req.user` ni to'ldiradi. Token bo'lmasa yoki
 * yaroqsiz bo'lsa 401 xatolik qaytaradi.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);

  if (!token) {
    next(new UnauthorizedError("Access token topilmadi"));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      telegramId: payload.telegramId,
      role: payload.role
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new UnauthorizedError("Access token muddati tugagan"));
      return;
    }
    if (error instanceof JsonWebTokenError) {
      next(new UnauthorizedError("Access token yaroqsiz"));
      return;
    }
    next(error);
  }
}

/**
 * Token mavjud bo'lsa foydalanuvchini aniqlaydi, lekin bo'lmasa xatolik bermaydi.
 * Public endpointlarda (masalan worker profilini ko'rish) ixtiyoriy autentifikatsiya uchun.
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      telegramId: payload.telegramId,
      role: payload.role
    };
  } catch {
    // Ixtiyoriy autentifikatsiyada yaroqsiz token bo'lsa ham so'rov davom etadi
  }
  next();
}
