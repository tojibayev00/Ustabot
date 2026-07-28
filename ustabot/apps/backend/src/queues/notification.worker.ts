import { Worker, type Job } from "bullmq";
import { createQueueConnection } from "@/config/redis.js";
import { telegramConfig } from "@/config/telegram.js";
import { logger } from "@/config/logger.js";
import type { NotificationJobData } from "@/config/queue.js";

interface TelegramSendMessageResult {
  ok: boolean;
  description?: string;
}

async function sendTelegramMessage(telegramId: string, message: string): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramId,
        text: message,
        parse_mode: "HTML"
      })
    }
  );

  const result = (await response.json()) as TelegramSendMessageResult;

  if (!result.ok) {
    // Foydalanuvchi botni bloklagan bo'lishi mumkin — bu holatni qayta urinmasdan yakunlaymiz
    if (result.description?.includes("bot was blocked")) {
      logger.warn({ telegramId }, "Foydalanuvchi botni bloklagan, xabar yuborilmadi");
      return;
    }
    throw new Error(`Telegram sendMessage xatoligi: ${result.description ?? "unknown"}`);
  }
}

/**
 * Notifications queue'ni tinglovchi worker. server.ts'da ilova ishga tushganda chaqiriladi.
 */
export function startNotificationWorker(): Worker<NotificationJobData> {
  const worker = new Worker<NotificationJobData>(
    "notifications",
    async (job: Job<NotificationJobData>) => {
      await sendTelegramMessage(job.data.telegramId, job.data.message);
    },
    {
      connection: createQueueConnection(),
      concurrency: 5
    }
  );

  worker.on("failed", (job, error) => {
    logger.error(
      { jobId: job?.id, telegramId: job?.data.telegramId, err: error },
      "Notification job muvaffaqiyatsiz tugadi"
    );
  });

  worker.on("error", (error) => {
    logger.error({ err: error }, "Notification worker xatoligi");
  });

  logger.info("✅ Notification worker ishga tushdi");
  return worker;
}
