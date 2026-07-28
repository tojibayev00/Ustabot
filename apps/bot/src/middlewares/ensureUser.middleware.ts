import type { NextFunction } from "grammy";
import type { BotContext } from "@/types/bot.types.js";
import { apiService } from "@/services/api.service.js";
import { logger } from "@/config/logger.js";

/**
 * Har bir foydalanuvchi harakatida (buyruq, tugma bosish) uni backend'dagi
 * User jadvaliga sinxronlaydi — shu bilan bot HECH QACHON o'zi ma'lumotlar
 * bazasiga yozmaydi, faqat Backend API orqali (Part 6: "Bot must never
 * access PostgreSQL directly").
 */
export async function ensureUserMiddleware(ctx: BotContext, next: NextFunction): Promise<void> {
  if (ctx.from && !ctx.from.is_bot) {
    try {
      await apiService.syncUser({
        telegramId: String(ctx.from.id),
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        username: ctx.from.username,
        languageCode: ctx.from.language_code
      });
    } catch (error) {
      logger.error({ err: error, telegramId: ctx.from.id }, "Foydalanuvchini sinxronlashda xatolik");
    }
  }
  await next();
}
