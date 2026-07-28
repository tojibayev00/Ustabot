import { createApp } from "@/app.js";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import { connectDatabase, disconnectDatabase } from "@/config/database.js";
import { connectRedis, disconnectRedis, redis } from "@/config/redis.js";
import { isCloudinaryHealthy } from "@/config/cloudinary.js";
import { telegramConfig } from "@/config/telegram.js";
import { startNotificationWorker } from "@/queues/notification.worker.js";
import { startBroadcastWorker } from "@/queues/broadcast.worker.js";

/**
 * Startup ketma-ketligi (Part 4 spesifikatsiyasi):
 * 1. Environment yuklash/tekshirish   → config/env.ts import qilinganda avtomatik bajariladi
 * 2. Logger                            → config/logger.ts
 * 3. PostgreSQL                        → connectDatabase()
 * 4. Redis                             → connectRedis()
 * 5. Cloudinary                        → tekshirish (health check)
 * 6. Telegram Bot                      → token validligini tekshirish
 * 7. Express                           → createApp()
 * 8. Server start
 *
 * Agar biror muhim servis ishga tushmasa, ilova to'xtatiladi (fail-fast).
 */
async function verifyTelegramBotToken(): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/getMe`);
  const result = (await response.json()) as { ok: boolean; result?: { username: string } };

  if (!result.ok) {
    throw new Error("Telegram bot token yaroqsiz");
  }

  logger.info(`✅ Telegram bot tasdiqlandi: @${result.result?.username}`);
}

async function bootstrap(): Promise<void> {
  try {
    logger.info(`🚀 ${env.APP_NAME} backend ishga tushmoqda (${env.NODE_ENV})...`);

    await connectDatabase();
    await connectRedis();

    const cloudinaryOk = await isCloudinaryHealthy();
    if (!cloudinaryOk) {
      throw new Error("Cloudinary konfiguratsiyasi noto'g'ri");
    }
    logger.info("✅ Cloudinary konfiguratsiyasi tasdiqlandi");

    await verifyTelegramBotToken();

    const app = createApp();

    const notificationWorker = startNotificationWorker();
    const broadcastWorker = startBroadcastWorker();

    const server = app.listen(env.PORT, () => {
      logger.info(`✅ Server http://localhost:${env.PORT} manzilida ishga tushdi`);
      logger.info(`📚 Swagger: http://localhost:${env.PORT}${env.API_PREFIX}/docs`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} qabul qilindi. Server yopilmoqda...`);

      server.close(async () => {
        await notificationWorker.close();
        await broadcastWorker.close();
        await disconnectDatabase();
        await disconnectRedis();
        logger.info("Server xavfsiz to'xtatildi");
        process.exit(0);
      });

      // 10 soniyadan keyin majburiy to'xtatish
      setTimeout(() => {
        logger.error("Graceful shutdown vaqti tugadi, majburiy to'xtatilmoqda");
        process.exit(1);
      }, 10_000).unref();
    };

    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));

    process.on("unhandledRejection", (reason) => {
      logger.error({ err: reason }, "Unhandled Promise Rejection");
    });

    process.on("uncaughtException", (error) => {
      logger.error({ err: error }, "Uncaught Exception");
      process.exit(1);
    });
  } catch (error) {
    logger.error({ err: error }, "❌ Ilovani ishga tushirishda xatolik yuz berdi");
    await redis.quit().catch(() => undefined);
    process.exit(1);
  }
}

void bootstrap();
