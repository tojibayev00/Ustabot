import type { User } from "@prisma/client";
import type { AdminUserListItem } from "@/modules/admin/types/admin.types.js";

export function toAdminUserListItem(user: User & { worker: { id: string } | null }): AdminUserListItem {
  return {
    id: user.id,
    telegramId: user.telegramId,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isBlocked: user.isBlocked,
    isWorker: user.worker !== null,
    createdAt: user.createdAt,
    lastSeenAt: user.lastSeenAt
  };
}
