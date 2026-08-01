import { broadcastService } from "@/modules/broadcast/service/broadcast.service.js";
import type {
  CreateBroadcastInput,
  ListBroadcastHistoryQuery
} from "@/modules/broadcast/validators/broadcast.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";

export const broadcastController = {
  create: asyncHandler<unknown, unknown, CreateBroadcastInput>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const broadcast = await broadcastService.create(req.user.id, req.body);
    sendSuccess(res, { data: broadcast, message: MESSAGES.CREATED, status: 201 });
  }),

  getById: asyncHandler(async (req, res) => {
    const broadcast = await broadcastService.getById(req.params.id as string);
    sendSuccess(res, { data: broadcast, message: MESSAGES.SUCCESS });
  }),

  history: asyncHandler<unknown, unknown, unknown, ListBroadcastHistoryQuery>(async (req, res) => {
    const result = await broadcastService.listHistory(req.query);
    sendSuccess(res, {
      data: result.items,
      meta: { ...result.meta, totalActiveUsers: result.totalActiveUsers },
      message: MESSAGES.SUCCESS
    });
  })
};
