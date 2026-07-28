import { adminRepository, type AdminUserFilters } from "@/modules/admin/repository/admin.repository.js";
import { toAdminUserListItem } from "@/modules/admin/dto/admin.dto.js";
import type { AdminUserListItem } from "@/modules/admin/types/admin.types.js";
import type { ListUsersQuery } from "@/modules/admin/validators/admin.validators.js";
import { parsePagination, buildPaginationMeta, type PaginationMeta } from "@/shared/pagination.js";
import { recordAdminLog } from "@/shared/adminLog.js";
import { notifyUser } from "@/shared/notify.js";
import { revokeAllUserSessions } from "@/shared/sessionStore.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { hasMinimumRole, type Role } from "@/constants/roles.js";

export const adminService = {
  async listUsers(
    query: ListUsersQuery
  ): Promise<{ items: AdminUserListItem[]; meta: PaginationMeta }> {
    const { page, limit, skip } = parsePagination(query);
    const filters: AdminUserFilters = {
      search: query.search,
      role: query.role,
      isBlocked: query.isBlocked
    };

    const [rows, total] = await Promise.all([
      adminRepository.findUsers(filters, skip, limit),
      adminRepository.countUsers(filters)
    ]);

    return { items: rows.map(toAdminUserListItem), meta: buildPaginationMeta(page, limit, total) };
  },

  async blockUser(adminId: string, userId: string): Promise<void> {
    const user = await adminRepository.findUserById(userId);
    if (!user) throw new NotFoundError("Foydalanuvchi topilmadi");

    await adminRepository.setBlocked(userId, true);
    await revokeAllUserSessions(userId);

    await recordAdminLog({
      adminId,
      action: "USER_BLOCKED",
      entity: "User",
      entityId: userId,
      oldValue: { isBlocked: false },
      newValue: { isBlocked: true }
    });

    await notifyUser({
      userId: user.id,
      telegramId: user.telegramId,
      title: "Hisobingiz bloklandi",
      message: "Administratsiya tomonidan hisobingiz vaqtincha bloklandi.",
      type: "SYSTEM"
    });
  },

  async unblockUser(adminId: string, userId: string): Promise<void> {
    const user = await adminRepository.findUserById(userId);
    if (!user) throw new NotFoundError("Foydalanuvchi topilmadi");

    await adminRepository.setBlocked(userId, false);

    await recordAdminLog({
      adminId,
      action: "USER_UNBLOCKED",
      entity: "User",
      entityId: userId,
      oldValue: { isBlocked: true },
      newValue: { isBlocked: false }
    });

    await notifyUser({
      userId: user.id,
      telegramId: user.telegramId,
      title: "Hisobingiz blokdan chiqarildi",
      message: "Endi tizimdan to'liq foydalanishingiz mumkin.",
      type: "SYSTEM"
    });
  },

  /** Faqat Super Admin foydalanuvchiga Moderator/Admin roli bera oladi (SUPER_ADMIN berilmaydi — Part 7) */
  async changeRole(
    actingAdminRole: Role,
    adminId: string,
    userId: string,
    newRole: "USER" | "MODERATOR" | "ADMIN"
  ): Promise<void> {
    if (!hasMinimumRole(actingAdminRole, "SUPER_ADMIN")) {
      throw new ForbiddenError("Faqat Super Admin rollarni o'zgartira oladi");
    }

    const user = await adminRepository.findUserById(userId);
    if (!user) throw new NotFoundError("Foydalanuvchi topilmadi");

    const oldRole = user.role;
    await adminRepository.setRole(userId, newRole);

    await recordAdminLog({
      adminId,
      action: "USER_ROLE_CHANGED",
      entity: "User",
      entityId: userId,
      oldValue: { role: oldRole },
      newValue: { role: newRole }
    });
  }
};
