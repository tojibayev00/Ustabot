import { internalService } from "@/modules/internal/service/internal.service.js";
import type {
  SyncUserInput,
  TelegramIdParam,
  AdminActionBody,
  RejectActionBody,
  TelegramIdQuery
} from "@/modules/internal/validators/internal.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";

export const internalController = {
  syncUser: asyncHandler<unknown, unknown, SyncUserInput>(async (req, res) => {
    const user = await internalService.syncUser(req.body);
    sendSuccess(res, { data: user, message: MESSAGES.SUCCESS });
  }),

  getUser: asyncHandler<TelegramIdParam>(async (req, res) => {
    const user = await internalService.getUserByTelegramId(req.params.telegramId);
    sendSuccess(res, { data: user, message: MESSAGES.SUCCESS });
  }),

  listPendingWorkers: asyncHandler(async (_req, res) => {
    const workers = await internalService.listPendingWorkers(10);
    sendSuccess(res, { data: workers, message: MESSAGES.SUCCESS });
  }),

  approveWorker: asyncHandler<{ id: string }, unknown, AdminActionBody>(async (req, res) => {
    await internalService.approveWorker(req.body.telegramId, req.params.id);
    sendSuccess(res, { data: null, message: "Tasdiqlandi" });
  }),

  rejectWorker: asyncHandler<{ id: string }, unknown, RejectActionBody>(async (req, res) => {
    await internalService.rejectWorker(req.body.telegramId, req.params.id, req.body.reason);
    sendSuccess(res, { data: null, message: "Rad etildi" });
  }),

  dashboardSummary: asyncHandler<unknown, unknown, unknown, TelegramIdQuery>(async (req, res) => {
    const summary = await internalService.getDashboardSummary(req.query.telegramId);
    sendSuccess(res, { data: summary, message: MESSAGES.SUCCESS });
  }),

  pendingReportsCount: asyncHandler<unknown, unknown, unknown, TelegramIdQuery>(async (req, res) => {
    const count = await internalService.getPendingReportsCount(req.query.telegramId);
    sendSuccess(res, { data: { count }, message: MESSAGES.SUCCESS });
  })
};
