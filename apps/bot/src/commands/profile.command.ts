import type { BotContext } from "@/types/bot.types.js";
import { apiService } from "@/services/api.service.js";
import { buildWorkerProfileKeyboard, buildBecomeWorkerKeyboard } from "@/keyboards/worker.keyboard.js";
import { logger } from "@/config/logger.js";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "⏳ Ko'rib chiqilmoqda",
  APPROVED: "✅ Tasdiqlangan",
  REJECTED: "❌ Rad etilgan",
  BLOCKED: "🚫 Bloklangan"
};

export async function profileCommand(ctx: BotContext): Promise<void> {
  if (!ctx.from) return;

  try {
    const user = await apiService.getUser(String(ctx.from.id));

    const roleLabel: Record<string, string> = {
      USER: "Oddiy foydalanuvchi",
      WORKER: "Usta",
      MODERATOR: "Moderator",
      ADMIN: "Admin",
      SUPER_ADMIN: "Super Admin"
    };

    const lines = [
      `👤 <b>${ctx.from.first_name}</b>`,
      `Rol: ${roleLabel[user.role] ?? user.role}`
    ];

    if (user.isWorker && user.workerStatus) {
      lines.push(`Usta profili holati: ${STATUS_LABELS[user.workerStatus] ?? user.workerStatus}`);
    }

    await ctx.reply(lines.join("\n"), {
      parse_mode: "HTML",
      reply_markup: user.isWorker ? buildWorkerProfileKeyboard() : buildBecomeWorkerKeyboard()
    });
  } catch (error) {
    logger.error({ err: error, telegramId: ctx.from.id }, "Profilni olishda xatolik");
    await ctx.reply("Profil ma'lumotlarini olishda xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
  }
}
