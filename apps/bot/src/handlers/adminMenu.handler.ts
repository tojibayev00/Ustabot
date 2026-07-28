import type { BotContext } from "@/types/bot.types.js";
import { apiService } from "@/services/api.service.js";
import { logger } from "@/config/logger.js";
import {
  buildAdminMenuKeyboard,
  buildBackToAdminMenuKeyboard,
  buildWorkerApprovalKeyboard
} from "@/keyboards/admin.keyboard.js";

export async function handleAdminMenu(ctx: BotContext): Promise<void> {
  await ctx.editMessageText("🛠 <b>Admin Panel</b>\n\nKerakli bo'limni tanlang:", {
    parse_mode: "HTML",
    reply_markup: buildAdminMenuKeyboard()
  });
  await ctx.answerCallbackQuery();
}

export async function handlePendingWorkers(ctx: BotContext): Promise<void> {
  await ctx.answerCallbackQuery();

  try {
    const pending = await apiService.listPendingWorkers();

    if (pending.length === 0) {
      await ctx.editMessageText("✅ Hozircha kutayotgan arizalar yo'q.", {
        reply_markup: buildBackToAdminMenuKeyboard()
      });
      return;
    }

    await ctx.editMessageText(`📋 Kutayotgan arizalar: ${pending.length} ta`, {
      reply_markup: buildBackToAdminMenuKeyboard()
    });

    for (const worker of pending) {
      const text = [
        `<b>${worker.firstName} ${worker.lastName}</b>`,
        `Kategoriya: ${worker.categoryName}`,
        `Manzil: ${worker.regionName}, ${worker.districtName}`,
        `Telefon: ${worker.phone}`
      ].join("\n");

      await ctx.reply(text, {
        parse_mode: "HTML",
        reply_markup: buildWorkerApprovalKeyboard(worker.id)
      });
    }
  } catch (error) {
    logger.error({ err: error }, "Kutayotgan arizalarni olishda xatolik");
    await ctx.reply("Xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
  }
}

export async function handleReportsSummary(ctx: BotContext): Promise<void> {
  await ctx.answerCallbackQuery();
  if (!ctx.from) return;

  try {
    const count = await apiService.getPendingReportsCount(String(ctx.from.id));
    await ctx.editMessageText(`🚩 Ko'rib chiqilmagan shikoyatlar: <b>${count}</b> ta`, {
      parse_mode: "HTML",
      reply_markup: buildBackToAdminMenuKeyboard()
    });
  } catch (error) {
    logger.error({ err: error }, "Shikoyatlar sonini olishda xatolik");
    await ctx.reply("Xatolik yuz berdi.");
  }
}

export async function handleDashboardSummary(ctx: BotContext): Promise<void> {
  await ctx.answerCallbackQuery();
  if (!ctx.from) return;

  try {
    const summary = await apiService.getDashboardSummary(String(ctx.from.id));
    const c = summary.counts;

    const text = [
      "📊 <b>Statistika</b>",
      "",
      `👥 Foydalanuvchilar: ${c.totalUsers}`,
      `🛠 Ustalar (jami): ${c.totalWorkers}`,
      `⏳ Kutayotgan: ${c.pendingWorkers}`,
      `✅ Tasdiqlangan: ${c.approvedWorkers}`,
      `🚫 Bloklangan: ${c.blockedWorkers}`,
      `🚩 Kutayotgan shikoyatlar: ${c.pendingReports}`,
      `📈 Bugungi ro'yxatdan o'tishlar: ${c.todayRegistrations}`
    ].join("\n");

    await ctx.editMessageText(text, { parse_mode: "HTML", reply_markup: buildBackToAdminMenuKeyboard() });
  } catch (error) {
    logger.error({ err: error }, "Dashboard statistikasini olishda xatolik");
    await ctx.reply("Xatolik yuz berdi.");
  }
}
