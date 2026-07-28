import { searchService } from "@/modules/search/service/search.service.js";
import type { ListWorkersQuery } from "@/modules/worker/validators/worker.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";

export const searchController = {
  searchWorkers: asyncHandler<unknown, unknown, unknown, ListWorkersQuery>(async (req, res) => {
    const result = await searchService.searchWorkers(req.user?.id, req.query);
    sendSuccess(res, { data: result.items, meta: result.meta, message: MESSAGES.SUCCESS });
  })
};
