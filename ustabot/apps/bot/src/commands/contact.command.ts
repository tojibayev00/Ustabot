import type { BotContext } from "@/types/bot.types.js";
import { env } from "@/config/env.js";
import { apiService } from "@/services/api.service.js";
import { logger } from "@/config/logger.js";

export async function contactCommand(ctx: BotContext): Promise<void> {
  let supportUsername = env.SUPPORT_USERNAME;

  try {
    const settings = await apiService.getSettings();
    supportUsername = settings.supportUsername ?? supportUsername;
  } catch (error) {
    logger.warn({ err: error }, "Sozlamalarni olishda xatolik");
  }

  if (!supportUsername) {
    await ctx.reply("Hozircha qo'llab-quvvatlash kontakti sozlanmagan.");
    return;
  }

  await ctx.reply(`💬 Savollaringiz bo'lsa, quyidagi kontakt orqali bog'laning:\n\n@${supportUsername}`);
}
