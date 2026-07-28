import type { NextFunction, Request, Response } from "express";
import { env } from "@/config/env.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";

/**
 * Faqat Telegram Bot (apps/bot) backend bilan gaplashishi uchun ishlatiladigan
 * server-to-server autentifikatsiya. Foydalanuvchi JWT'siga bog'liq emas —
 * chunki botdagi buyruqlar (/start, /admin) Mini App orqali o'tmaydi.
 *
 * Bot har bir so'rovda `x-internal-api-key` headerini yuboradi, u esa
 * .env'dagi INTERNAL_API_KEY bilan solishtiriladi. Bu qiymat hech qachon
 * clientga (Mini App/brauzerga) oshkor qilinmaydi.
 */
export function requireInternalApiKey(req: Request, _res: Response, next: NextFunction): void {
  const providedKey = req.headers["x-internal-api-key"];

  if (providedKey !== env.INTERNAL_API_KEY) {
    next(new UnauthorizedError("Ichki API kaliti yaroqsiz"));
    return;
  }

  next();
}
