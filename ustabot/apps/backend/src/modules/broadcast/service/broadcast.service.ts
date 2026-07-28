import { broadcastRepository } from "@/modules/broadcast/repository/broadcast.repository.js";
import { toBroadcastResponse } from "@/modules/broadcast/dto/broadcast.dto.js";
import type {
  CreateBroadcastInput,
  ListBroadcastHistoryQuery
} from "@/modules/broadcast/validators/broadcast.validators.js";
import type { BroadcastResponse } from "@/modules/broadcast/types/broadcast.types.js";
import { broadcastQueue } from "@/config/queue.js";
import { recordAdminLog } from "@/shared/adminLog.js";
import { parsePagination, buildPaginationMeta, type PaginationMeta } from "@/shared/pagination.js";
import { NotFoundError } from "@/errors/NotFoundError.js";

export const broadcastService = {
  /**
   * Broadcast'ni DB'ga yozadi va darhol fon queue'ga navbatga qo'yadi.
   * Haqiqiy yuborish `broadcast.worker.ts` orqali asinxron amalga oshadi —
   * shu tufayli bu endpoint darhol javob qaytaradi (UI bloklanmaydi).
   */
  async create(adminId: string, input: CreateBroadcastInput): Promise<BroadcastResponse> {
    const broadcast = await broadcastRepository.create({
      adminId,
      title: input.title,
      message: input.message,
      image: input.image ?? null,
      buttonText: input.buttonText ?? null,
      buttonUrl: input.buttonUrl ?? null,
      successCount: 0,
      failedCount: 0
    });

    await broadcastQueue.add("send-broadcast", { broadcastId: broadcast.id });

    await recordAdminLog({
      adminId,
      action: "BROADCAST_CREATED",
      entity: "BroadcastHistory",
      entityId: broadcast.id,
      newValue: { title: input.title }
    });

    return toBroadcastResponse(broadcast);
  },

  async getById(id: string): Promise<BroadcastResponse> {
    const broadcast = await broadcastRepository.findById(id);
    if (!broadcast) throw new NotFoundError("Broadcast topilmadi");
    return toBroadcastResponse(broadcast);
  },

  async listHistory(
    query: ListBroadcastHistoryQuery
  ): Promise<{ items: BroadcastResponse[]; meta: PaginationMeta; totalActiveUsers: number }> {
    const { page, limit, skip } = parsePagination(query);

    const [rows, total, totalActiveUsers] = await Promise.all([
      broadcastRepository.findMany(skip, limit),
      broadcastRepository.count(),
      broadcastRepository.countActiveUsers()
    ]);

    return {
      items: rows.map(toBroadcastResponse),
      meta: buildPaginationMeta(page, limit, total),
      totalActiveUsers
    };
  }
};
