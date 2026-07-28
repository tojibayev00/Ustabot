import type { Notification } from "@prisma/client";
import type { NotificationResponse } from "@/modules/notification/types/notification.types.js";

export function toNotificationResponse(notification: Notification): NotificationResponse {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt
  };
}
