import { Queue } from "bullmq";
import { createQueueConnection } from "@/config/redis.js";

/**
 * Notifications queue — foydalanuvchilarga Telegram orqali xabar yuborish uchun.
 * DB'ga yozish (Notification jadvali) sinxron, Telegram API chaqiruvi esa
 * shu queue orqali asinxron va qayta urinish (retry) bilan amalga oshiriladi.
 */
export const notificationQueue = new Queue("notifications", {
  connection: createQueueConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { age: 3600 },
    removeOnFail: { age: 24 * 3600 }
  }
});

export interface NotificationJobData {
  telegramId: string;
  message: string;
}

/**
 * Broadcast queue — admin tomonidan yuborilgan ommaviy xabarlarni
 * fon rejimida (background) barcha foydalanuvchilarga tarqatish uchun.
 * Har bir broadcast — bitta job, ichida barcha foydalanuvchilarga ketma-ket yuboriladi
 * (Telegram rate limit'iga rioya qilingan holda).
 */
export const broadcastQueue = new Queue("broadcast", {
  connection: createQueueConnection(),
  defaultJobOptions: {
    attempts: 1, // Broadcast ichidagi har bir xabar o'zi alohida qayta urinishga ega, job darajasida shart emas
    removeOnComplete: { age: 24 * 3600 },
    removeOnFail: { age: 7 * 24 * 3600 }
  }
});

export interface BroadcastJobData {
  broadcastId: string;
}
