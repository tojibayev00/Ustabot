import type { BotContext } from "@/types/bot.types.js";
import { apiService } from "@/services/api.service.js";
import { logger } from "@/config/logger.js";

const LANGUAGE_CONFIRM: Record<string, string> = {
  uz: "✅ Til o'zbekchaga o'zgartirildi",
  ru: "✅ Язык изменён на русский",
  en: "✅ Language changed to English"
};

export async function handleLanguageSelect(ctx: BotContext): Promise<void> {
  const data = ctx.callbackQuery?.data ?? "";
  const lang = data.replace("lang:", "");

  if (!ctx.from || !LANGUAGE_CONFIRM[lang]) {
    await ctx.answerCallbackQuery();
    return;
  }

  try {
    await apiService.syncUser({
      telegramId: String(ctx.from.id),
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
      username: ctx.from.username,
      languageCode: lang
    });

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(LANGUAGE_CONFIRM[lang]);
  } catch (error) {
    logger.error({ err: error }, "Tilni saqlashda xatolik");
    await ctx.answerCallbackQuery({ text: "Xatolik yuz berdi", show_alert: true });
  }
}
