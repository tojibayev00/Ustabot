import type { BotContext } from "@/types/bot.types.js";
import { apiService, ApiError } from "@/services/api.service.js";
import { startRejectFlow } from "@/scenes/rejectWorker.scene.js";
import { logger } from "@/config/logger.js";

function extractWorkerId(callbackData: string, prefix: string): string | null {
  if (!callbackData.startsWith(prefix)) return null;
  return callbackData.slice(prefix.length);
}

export async function handleApproveWorker(ctx: BotContext): Promise<void> {
  const data = ctx.callbackQuery?.data ?? "";
  const workerId = extractWorkerId(data, "worker:approve:");

  if (!workerId || !ctx.from) {
    await ctx.answerCallbackQuery();
    return;
  }

  try {
    await apiService.approveWorker(String(ctx.from.id), workerId);
    await ctx.answerCallbackQuery({ text: "✅ Tasdiqlandi" });
    await ctx.editMessageReplyMarkup(undefined);
    await ctx.reply("✅ Usta tasdiqlandi va foydalanuvchiga xabar yuborildi.");
  } catch (error) {
    logger.error({ err: error, workerId }, "Ustani tasdiqlashda xatolik");
    const message = error instanceof ApiError ? error.message : "Xatolik yuz berdi";
    await ctx.answerCallbackQuery({ text: message, show_alert: true });
  }
}

export async function handleRejectWorkerPrompt(ctx: BotContext): Promise<void> {
  const data = ctx.callbackQuery?.data ?? "";
  const workerId = extractWorkerId(data, "worker:reject:");

  if (!workerId || !ctx.from) {
    await ctx.answerCallbackQuery();
    return;
  }

  startRejectFlow(ctx.from.id, workerId);
  await ctx.answerCallbackQuery();
  await ctx.reply("✍️ Rad etish sababini yozib yuboring (matn ko'rinishida):");
}
