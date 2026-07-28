import type { NextFunction } from "grammy";
import type { BotContext } from "@/types/bot.types.js";
import { getPendingRejection, clearRejectFlow } from "@/scenes/rejectWorker.scene.js";
import { apiService, ApiError } from "@/services/api.service.js";
import { logger } from "@/config/logger.js";

/**
 * Agar admin avvalroq "❌ Rad etish" tugmasini bosgan bo'lsa va endi
 * matn xabar yozayotgan bo'lsa — bu matn rad etish sababi deb qabul qilinadi.
 * Aks holda oddiy keyingi middleware/handler'ga o'tkaziladi (masalan buyruqlar).
 */
export async function rejectReasonMiddleware(ctx: BotContext, next: NextFunction): Promise<void> {
  const text = ctx.message?.text;

  if (!ctx.from || !text || text.startsWith("/")) {
    await next();
    return;
  }

  const workerId = getPendingRejection(ctx.from.id);
  if (!workerId) {
    await next();
    return;
  }

  clearRejectFlow(ctx.from.id);

  try {
    await apiService.rejectWorker(String(ctx.from.id), workerId, text);
    await ctx.reply("❌ Usta rad etildi va foydalanuvchiga sabab bilan xabar yuborildi.");
  } catch (error) {
    logger.error({ err: error, workerId }, "Ustani rad etishda xatolik");
    const message = error instanceof ApiError ? error.message : "Xatolik yuz berdi";
    await ctx.reply(`Xatolik: ${message}`);
  }
}
