import { authRepository } from "@/modules/auth/repository/auth.repository.js";
import { workerRepository } from "@/modules/worker/repository/worker.repository.js";
import { workerService } from "@/modules/worker/service/worker.service.js";
import { analyticsService } from "@/modules/analytics/service/analytics.service.js";
import { reportRepository } from "@/modules/report/repository/report.repository.js";
import type { InternalUserInfo } from "@/modules/internal/types/internal.types.js";
import type { SyncUserInput } from "@/modules/internal/validators/internal.validators.js";
import { ADMIN_ROLES } from "@/constants/roles.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";

function toInternalUserInfo(user: {
  id: string;
  telegramId: string;
  role: import("@/constants/roles.js").Role;
  isBlocked: boolean;
  worker: { id: string } | null;
}): InternalUserInfo {
  return {
    id: user.id,
    telegramId: user.telegramId,
    role: user.role,
    isBlocked: user.isBlocked,
    isWorker: user.worker !== null,
    workerStatus: null
  };
}

async function requireAdminByTelegramId(telegramId: string): Promise<{ id: string }> {
  const user = await authRepository.findByTelegramId(telegramId);
  if (!user) throw new NotFoundError("Foydalanuvchi topilmadi");
  if (!ADMIN_ROLES.includes(user.role)) {
    throw new ForbiddenError("Bu amal uchun ruxsatingiz yo'q");
  }
  return { id: user.id };
}

export const internalService = {
  /** Bot /start bosilganda foydalanuvchini yaratadi/yangilaydi */
  async syncUser(input: SyncUserInput): Promise<InternalUserInfo> {
    const user = await authRepository.upsertFromTelegram(input);
    return toInternalUserInfo(user);
  },

  async getUserByTelegramId(telegramId: string): Promise<InternalUserInfo> {
    const user = await authRepository.findByTelegramId(telegramId);
    if (!user) throw new NotFoundError("Foydalanuvchi topilmadi");

    const info = toInternalUserInfo(user);

    if (user.worker) {
      const worker = await workerRepository.findByUserId(user.id);
      info.workerStatus = worker?.status ?? null;
    }

    return info;
  },

  async listPendingWorkers(limit: number) {
    const result = await workerService.listForAdmin({ status: "PENDING", page: "1", limit: String(limit) });
    return result.items;
  },

  async approveWorker(telegramId: string, workerId: string): Promise<void> {
    const admin = await requireAdminByTelegramId(telegramId);
    await workerService.approve(admin.id, workerId);
  },

  async rejectWorker(telegramId: string, workerId: string, reason: string): Promise<void> {
    const admin = await requireAdminByTelegramId(telegramId);
    await workerService.reject(admin.id, workerId, reason);
  },

  async getDashboardSummary(telegramId: string) {
    await requireAdminByTelegramId(telegramId);
    return analyticsService.getDashboard();
  },

  async getPendingReportsCount(telegramId: string): Promise<number> {
    await requireAdminByTelegramId(telegramId);
    return reportRepository.count({ status: "PENDING" });
  }
};
