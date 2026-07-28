import type { BotContext } from "@/types/bot.types.js";
import { buildAdminMenuKeyboard } from "@/keyboards/admin.keyboard.js";

export async function adminCommand(ctx: BotContext): Promise<void> {
  await ctx.reply("🛠 <b>Admin Panel</b>\n\nKerakli bo'limni tanlang:", {
    parse_mode: "HTML",
    reply_markup: buildAdminMenuKeyboard()
  });
}
