import type { BotContext } from "@/types/bot.types.js";
import { buildMainKeyboard } from "@/keyboards/main.keyboard.js";

const WELCOME_MESSAGE = `👋 <b>Ustalar Topish</b>ga xush kelibsiz!

Ishonchli ustalarni tez va oson toping.

Siz quyidagilar bo'yicha qidirishingiz mumkin:
• Kategoriya
• Viloyat
• Tuman

Bir necha daqiqada usta sifatida ro'yxatdan o'tishingiz ham mumkin.

👇 Boshlash uchun ilovani oching.`;

export async function startCommand(ctx: BotContext): Promise<void> {
  await ctx.reply(WELCOME_MESSAGE, {
    parse_mode: "HTML",
    reply_markup: buildMainKeyboard()
  });
}
