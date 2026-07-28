import { InlineKeyboard } from "grammy";
import { env } from "@/config/env.js";

export function buildMainKeyboard(): InlineKeyboard {
  const keyboard = new InlineKeyboard().webApp("📱 Ilovani ochish", env.WEBAPP_URL).row();

  keyboard.text("❓ Yordam", "help");

  if (env.CHANNEL_URL) {
    keyboard.url("📢 Rasmiy kanal", env.CHANNEL_URL);
  }

  return keyboard;
}

export function buildLanguageKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("🇺🇿 O'zbekcha", "lang:uz")
    .text("🇷🇺 Русский", "lang:ru")
    .row()
    .text("🇬🇧 English", "lang:en");
}
