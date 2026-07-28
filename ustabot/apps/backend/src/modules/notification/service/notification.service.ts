import { notificationRepository } from "@/modules/notification/repository/notification.repository.js";
import { toNotificationResponse } from "@/modules/notification/dto/notification.dto.js";
import type { ListNotificationsQuery } from "@/modules/notification/validators/notification.validators.js";
import type { NotificationResponse } from "@/modules/notification/types/notification.types.js";
import { parsePagination, buildPaginationMeta, type PaginationMeta } from "@/shared/pagination.js";
import { NotFoundError } from "@/errors/NotFoundError.js";

export const notificationService = {
  async list(
    userId: string,
    query: ListNotificationsQuery
  ): Promise<{ items: NotificationResponse[]; meta: PaginationMeta; unreadCount: number }> {
    const { page, limit, skip } = parsePagination(query);
    const unreadOnly = query.unreadOnly ?? false;

    const [rows, total, unreadCount] = await Promise.all([
      notificationRepository.findMany(userId, unreadOnly, skip, limit),
      notificationRepository.count(userId, unreadOnly),
      notificationRepository.countUnread(userId)
    ]);

    return {
      items: rows.map(toNotificationResponse),
      meta: buildPaginationMeta(page, limit, total),
      unreadCount
    };
  },

  async markAsRead(userId: string, notificationId: string): Promise<NotificationResponse> {
    const notification = await notificationRepository.findById(notificationId, userId);
    if (!notification) throw new NotFoundError("Bildirishnoma topilmadi");

    const updated = await notificationRepository.markAsRead(notificationId);
    return toNotificationResponse(updated);
  },

  async markAllAsRead(userId: string): Promise<{ updatedCount: number }> {
    const updatedCount = await notificationRepository.markAllAsRead(userId);
    return { updatedCount };
  }
};
