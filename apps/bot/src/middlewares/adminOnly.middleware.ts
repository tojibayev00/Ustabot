import type { NextFunction } from "grammy";
import type { BotContext } from "@/types/bot.types.js";
import { apiService } from "@/services/api.service.js";
import { logger } from "@/config/logger.js";

const ADMIN_ROLES = new Set(["MODERATOR", "ADMIN", "SUPER_ADMIN"]);

export async function adminOnlyMiddleware(ctx: BotContext, next: NextFunction): Promise<void> {
  if (!ctx.from) {
    return;
  }

  try {
    const user = await apiService.getUser(String(ctx.from.id));

    if (!ADMIN_ROLES.has(user.role)) {
      await ctx.reply("⛔ Ushbu buyruq faqat administratorlar uchun.");
      return;
    }

    await next();
  } catch (error) {
    logger.error({ err: error, telegramId: ctx.from.id }, "Admin tekshiruvida xatolik");
    await ctx.reply("⛔ Ruxsatni tekshirishda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
  }
}
