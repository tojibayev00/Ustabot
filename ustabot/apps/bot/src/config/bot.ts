import { Bot } from "grammy";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import type { BotContext } from "@/types/bot.types.js";

import { ensureUserMiddleware } from "@/middlewares/ensureUser.middleware.js";
import { adminOnlyMiddleware } from "@/middlewares/adminOnly.middleware.js";
import { rejectReasonMiddleware } from "@/handlers/rejectReason.handler.js";

import { startCommand } from "@/commands/start.command.js";
import { helpCommand } from "@/commands/help.command.js";
import { contactCommand } from "@/commands/contact.command.js";
import { languageCommand } from "@/commands/language.command.js";
import { profileCommand } from "@/commands/profile.command.js";
import { adminCommand } from "@/commands/admin.command.js";

import {
  handleAdminMenu,
  handlePendingWorkers,
  handleReportsSummary,
  handleDashboardSummary
} from "@/handlers/adminMenu.handler.js";
import { handleApproveWorker, handleRejectWorkerPrompt } from "@/handlers/workerApproval.handler.js";
import { handleLanguageSelect } from "@/handlers/language.handler.js";

export function createBot(): Bot<BotContext> {
  const bot = new Bot<BotContext>(env.TELEGRAM_BOT_TOKEN);

  // ---------- Global middlewares ----------
  bot.use(ensureUserMiddleware);
  bot.use(rejectReasonMiddleware);

  // ---------- Commands ----------
  bot.command("start", startCommand);
  bot.command("help", helpCommand);
  bot.command("contact", contactCommand);
  bot.command("language", languageCommand);
  bot.command("profile", profileCommand);
  bot.command("admin", adminOnlyMiddleware, adminCommand);

  // ---------- Callback queries ----------
  bot.callbackQuery("admin:menu", adminOnlyMiddleware, handleAdminMenu);
  bot.callbackQuery("admin:pending", adminOnlyMiddleware, handlePendingWorkers);
  bot.callbackQuery("admin:reports", adminOnlyMiddleware, handleReportsSummary);
  bot.callbackQuery("admin:dashboard", adminOnlyMiddleware, handleDashboardSummary);
  bot.callbackQuery(/^worker:approve:.+/, adminOnlyMiddleware, handleApproveWorker);
  bot.callbackQuery(/^worker:reject:.+/, adminOnlyMiddleware, handleRejectWorkerPrompt);
  bot.callbackQuery(/^lang:(uz|ru|en)$/, handleLanguageSelect);
  bot.callbackQuery("help", async (ctx) => {
    await ctx.answerCallbackQuery();
    await helpCommand(ctx);
  });

  // ---------- Xatoliklar ----------
  bot.catch((err) => {
    logger.error({ err: err.error, updateId: err.ctx.update.update_id }, "Bot xatoligi");
  });

  return bot;
}
