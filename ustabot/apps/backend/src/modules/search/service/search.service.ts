import { workerService } from "@/modules/worker/service/worker.service.js";
import type { ListWorkersQuery } from "@/modules/worker/validators/worker.validators.js";
import type { WorkerListItemResponse } from "@/modules/worker/types/worker.types.js";
import type { PaginationMeta } from "@/shared/pagination.js";
import { prisma } from "@/config/database.js";

/**
 * Search moduli Worker moduli bilan bir xil ma'lumot manbasidan foydalanadi
 * (Rule 9: "No duplicate code"). Alohida endpoint sifatida ajratilishining sababi —
 * kelajakda qidiruv tarixini yozish, so'rov tahlili va tavsiyalar kabi
 * qo'shimcha funksiyalarni shu joyga qo'shish imkoniyati.
 */
export const searchService = {
  async searchWorkers(
    userId: string | undefined,
    query: ListWorkersQuery
  ): Promise<{ items: WorkerListItemResponse[]; meta: PaginationMeta }> {
    if (query.search) {
      // Kelajakdagi analitika uchun — javobni sekinlashtirmasligi uchun bloklanmasdan yoziladi
      void prisma.searchHistory.create({
        data: {
          userId: userId ?? null,
          keyword: query.search,
          categoryId: query.category ?? null,
          regionId: query.region ?? null,
          districtId: query.district ?? null
        }
      });
    }

    return workerService.listPublic(userId, query);
  }
};
