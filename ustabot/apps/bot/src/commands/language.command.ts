import type { BotContext } from "@/types/bot.types.js";
import { buildLanguageKeyboard } from "@/keyboards/main.keyboard.js";

export async function languageCommand(ctx: BotContext): Promise<void> {
  await ctx.reply("🌐 Tilni tanlang / Выберите язык / Choose language:", {
    reply_markup: buildLanguageKeyboard()
  });
}
