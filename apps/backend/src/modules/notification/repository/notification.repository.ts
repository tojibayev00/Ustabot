import type { Notification, Prisma } from "@prisma/client";
import { prisma } from "@/config/database.js";

export const notificationRepository = {
  async findMany(
    userId: string,
    unreadOnly: boolean,
    skip: number,
    take: number
  ): Promise<Notification[]> {
    const where: Prisma.NotificationWhereInput = {
      userId,
      deletedAt: null,
      ...(unreadOnly ? { isRead: false } : {})
    };

    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take
    });
  },

  async count(userId: string, unreadOnly: boolean): Promise<number> {
    return prisma.notification.count({
      where: { userId, deletedAt: null, ...(unreadOnly ? { isRead: false } : {}) }
    });
  },

  async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({ where: { userId, isRead: false, deletedAt: null } });
  },

  async findById(id: string, userId: string): Promise<Notification | null> {
    return prisma.notification.findFirst({ where: { id, userId, deletedAt: null } });
  },

  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  },

  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false, deletedAt: null },
      data: { isRead: true }
    });
    return result.count;
  }
};
