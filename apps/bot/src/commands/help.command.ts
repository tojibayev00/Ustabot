import type { BotContext } from "@/types/bot.types.js";
import { env } from "@/config/env.js";
import { apiService } from "@/services/api.service.js";
import { logger } from "@/config/logger.js";
import { InlineKeyboard } from "grammy";

export async function helpCommand(ctx: BotContext): Promise<void> {
  let supportUsername = env.SUPPORT_USERNAME;
  let channelUrl = env.CHANNEL_URL;

  try {
    const settings = await apiService.getSettings();
    supportUsername = settings.supportUsername ?? supportUsername;
    channelUrl = settings.telegramChannel ?? channelUrl;
  } catch (error) {
    logger.warn({ err: error }, "Sozlamalarni olishda xatolik, standart qiymatlar ishlatildi");
  }

  const lines = [
    "❓ <b>Yordam</b>",
    "",
    "<b>Ustalar Topish</b> — professional ustalarni topish platformasi.",
    "",
    "📱 Ilovani ochish orqali kategoriyalar bo'yicha qidiring, ustalar profilini ko'ring va ular bilan bevosita bog'laning.",
    "",
    "<b>Foydali buyruqlar:</b>",
    "/start — botni qayta ishga tushirish",
    "/profile — profilingiz",
    "/language — tilni o'zgartirish"
  ];

  const keyboard = new InlineKeyboard().webApp("📱 Ilovani ochish", env.WEBAPP_URL);

  if (supportUsername) {
    lines.push("", `💬 Savollar bo'yicha: @${supportUsername}`);
    keyboard.row().url("💬 Qo'llab-quvvatlash", `https://t.me/${supportUsername}`);
  }

  if (channelUrl) {
    keyboard.row().url("📢 Rasmiy kanal", channelUrl);
  }

  await ctx.reply(lines.join("\n"), { parse_mode: "HTML", reply_markup: keyboard });
}
