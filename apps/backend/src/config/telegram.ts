import { env } from "@/config/env.js";

/**
 * Backend'ning Telegram bilan bog'liq sozlamalari.
 * Haqiqiy initData tekshiruvi va Bot API chaqiruvlari
 * Auth va Notification modullarida (Phase 4+) amalga oshiriladi.
 */
export const telegramConfig = {
  botToken: env.TELEGRAM_BOT_TOKEN,
  botUsername: env.TELEGRAM_BOT_USERNAME,
  webhookUrl: env.TELEGRAM_WEBHOOK_URL,
  webhookSecret: env.TELEGRAM_WEBHOOK_SECRET,
  superAdminIds: env.SUPER_ADMIN_IDS,
  channelUrl: env.CHANNEL_URL,
  supportUsername: env.SUPPORT_USERNAME,
  /** initData qanchagacha amal qiladi (soniyada) — undan eski bo'lsa rad etiladi */
  initDataMaxAgeSeconds: 24 * 60 * 60
} as const;

export function isSuperAdmin(telegramId: string): boolean {
  return telegramConfig.superAdminIds.includes(telegramId);
}
