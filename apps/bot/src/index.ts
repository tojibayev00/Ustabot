import { createBot } from "@/config/bot.js";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

/**
 * Bot ishga tushirish strategiyasi:
 * - Development: long polling (webhook sozlash shart emas, lokal ishlaydi)
 * - Production: agar TELEGRAM_WEBHOOK_URL berilgan bo'lsa webhook, aks holda polling
 *
 * Bot HECH QACHON to'g'ridan-to'g'ri PostgreSQL'ga ulanmaydi — barcha ma'lumotlar
 * Backend API (`services/api.service.ts`) orqali olinadi/yoziladi (Part 6 talabi).
 */
async function bootstrap(): Promise<void> {
  logger.info(`🤖 Ustalar Topish bot ishga tushmoqda (${env.NODE_ENV})...`);

  const bot = createBot();

  const me = await bot.api.getMe();
  logger.info(`✅ Bot tasdiqlandi: @${me.username}`);

  if (env.NODE_ENV === "production" && env.TELEGRAM_WEBHOOK_URL) {
    // Webhook rejimi: bu holatda bot alohida HTTP server sifatida emas,
    // odatda backend/reverse-proxy orqali /telegram/webhook manziliga ulanadi.
    // Oddiylik uchun hozircha polling asosiy strategiya hisoblanadi;
    // webhook kerak bo'lsa `bot.api.setWebhook(env.TELEGRAM_WEBHOOK_URL)` chaqiriladi
    // va alohida Express/webhookCallback(bot) serveri ishga tushiriladi.
    await bot.api.setWebhook(env.TELEGRAM_WEBHOOK_URL);
    logger.info(`✅ Webhook o'rnatildi: ${env.TELEGRAM_WEBHOOK_URL}`);
    return;
  }

  // Polling rejimidan oldin eski webhook'ni tozalab qo'yamiz (agar mavjud bo'lsa)
  await bot.api.deleteWebhook({ drop_pending_updates: false });

  await bot.start({
    onStart: (botInfo) => {
      logger.info(`✅ Polling boshlandi: @${botInfo.username}`);
    }
  });
}

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled Promise Rejection (bot)");
});

process.on("uncaughtException", (error) => {
  logger.error({ err: error }, "Uncaught Exception (bot)");
  process.exit(1);
});

bootstrap().catch((error: unknown) => {
  logger.error({ err: error }, "❌ Botni ishga tushirishda xatolik");
  process.exit(1);
});
