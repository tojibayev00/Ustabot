import { prisma } from "@/config/database.js";
import { notificationQueue } from "@/config/queue.js";
import { logger } from "@/config/logger.js";
import { ADMIN_ROLES } from "@/constants/roles.js";
import type { NotificationType } from "@/constants/statuses.js";

interface NotifyUserOptions {
  userId: string;
  telegramId: string;
  title: string;
  message: string;
  type: NotificationType;
}

/**
 * Bitta foydalanuvchiga bildirishnoma yuboradi:
 * 1) Notification jadvaliga yozadi (Mini App'dagi "Bildirishnomalar" bo'limi uchun)
 * 2) Telegram orqali xabar yuborishni queue'ga qo'shadi (asinxron, retry bilan)
 */
export async function notifyUser(options: NotifyUserOptions): Promise<void> {
  await prisma.notification.create({
    data: {
      userId: options.userId,
      title: options.title,
      message: options.message,
      type: options.type
    }
  });

  try {
    await notificationQueue.add("send-telegram-message", {
      telegramId: options.telegramId,
      message: `<b>${options.title}</b>\n\n${options.message}`
    });
  } catch (error) {
    logger.error({ err: error, userId: options.userId }, "Notification queue'ga qo'shishda xatolik");
  }
}

/** Barcha faol (bloklanmagan) moderator/admin/super-adminlarga bildirishnoma yuboradi */
export async function notifyAdmins(
  title: string,
  message: string,
  type: NotificationType
): Promise<void> {
  const admins = await prisma.user.findMany({
    where: {
      role: { in: [...ADMIN_ROLES] },
      isBlocked: false,
      deletedAt: null
    },
    select: { id: true, telegramId: true }
  });

  await Promise.all(
    admins.map((admin) =>
      notifyUser({ userId: admin.id, telegramId: admin.telegramId, title, message, type })
    )
  );
}
