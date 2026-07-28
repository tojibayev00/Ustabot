import { Worker, type Job } from "bullmq";
import { createQueueConnection } from "@/config/redis.js";
import { telegramConfig } from "@/config/telegram.js";
import { prisma } from "@/config/database.js";
import { logger } from "@/config/logger.js";
import type { BroadcastJobData } from "@/config/queue.js";

const BATCH_SIZE = 25;
const DELAY_BETWEEN_BATCHES_MS = 1100; // Telegram: sekundiga ~30 xabar (turli chatlarga)

interface TelegramApiResult {
  ok: boolean;
  description?: string;
}

async function sendBroadcastMessage(
  telegramId: string,
  message: string,
  image: string | null,
  buttonText: string | null,
  buttonUrl: string | null
): Promise<{ success: boolean; blocked: boolean }> {
  const replyMarkup =
    buttonText && buttonUrl
      ? { inline_keyboard: [[{ text: buttonText, url: buttonUrl }]] }
      : undefined;

  const endpoint = image ? "sendPhoto" : "sendMessage";
  const body: Record<string, unknown> = image
    ? { chat_id: telegramId, photo: image, caption: message, parse_mode: "HTML" }
    : { chat_id: telegramId, text: message, parse_mode: "HTML" };

  if (replyMarkup) body.reply_markup = replyMarkup;

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramConfig.botToken}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = (await response.json()) as TelegramApiResult;

    if (!result.ok) {
      const blocked = result.description?.includes("bot was blocked") ?? false;
      return { success: false, blocked };
    }

    return { success: true, blocked: false };
  } catch (error) {
    logger.error({ err: error, telegramId }, "Broadcast xabarini yuborishda tarmoq xatoligi");
    return { success: false, blocked: false };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processBroadcast(broadcastId: string): Promise<void> {
  const broadcast = await prisma.broadcastHistory.findUniqueOrThrow({ where: { id: broadcastId } });

  await prisma.broadcastHistory.update({
    where: { id: broadcastId },
    data: { startedAt: new Date() }
  });

  let successCount = 0;
  let failedCount = 0;
  let cursor: string | undefined;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const users = await prisma.user.findMany({
      where: { isBlocked: false, deletedAt: null },
      select: { id: true, telegramId: true },
      take: BATCH_SIZE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" }
    });

    if (users.length === 0) break;

    const results = await Promise.all(
      users.map((user) =>
        sendBroadcastMessage(
          user.telegramId,
          broadcast.message,
          broadcast.image,
          broadcast.buttonText,
          broadcast.buttonUrl
        )
      )
    );

    for (const result of results) {
      if (result.success) successCount += 1;
      else failedCount += 1;
    }

    cursor = users[users.length - 1]?.id;

    await prisma.broadcastHistory.update({
      where: { id: broadcastId },
      data: { successCount, failedCount }
    });

    if (users.length < BATCH_SIZE) break;
    await sleep(DELAY_BETWEEN_BATCHES_MS);
  }

  await prisma.broadcastHistory.update({
    where: { id: broadcastId },
    data: { finishedAt: new Date() }
  });

  logger.info(
    { broadcastId, successCount, failedCount },
    "✅ Broadcast yakunlandi"
  );
}

export function startBroadcastWorker(): Worker<BroadcastJobData> {
  const worker = new Worker<BroadcastJobData>(
    "broadcast",
    async (job: Job<BroadcastJobData>) => {
      await processBroadcast(job.data.broadcastId);
    },
    {
      connection: createQueueConnection(),
      concurrency: 1 // Bir vaqtda faqat bitta broadcast ishlaydi (Telegram rate limit uchun)
    }
  );

  worker.on("failed", (job, error) => {
    logger.error({ jobId: job?.id, err: error }, "Broadcast job muvaffaqiyatsiz tugadi");
  });

  logger.info("✅ Broadcast worker ishga tushdi");
  return worker;
}
