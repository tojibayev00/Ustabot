import { reportService } from "@/modules/report/service/report.service.js";
import type {
  CreateReportInput,
  UpdateReportStatusInput,
  ListReportsQuery,
  ReportIdParam
} from "@/modules/report/validators/report.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";

export const reportController = {
  create: asyncHandler<unknown, unknown, CreateReportInput>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const report = await reportService.create(req.user.id, req.body);
    sendSuccess(res, { data: report, message: MESSAGES.REPORT_SUBMITTED, status: 201 });
  }),

  list: asyncHandler<unknown, unknown, unknown, ListReportsQuery>(async (req, res) => {
    const result = await reportService.list(req.query);
    sendSuccess(res, { data: result.items, meta: result.meta, message: MESSAGES.SUCCESS });
  }),

  updateStatus: asyncHandler<ReportIdParam, unknown, UpdateReportStatusInput>(
    async (req, res) => {
      if (!req.user) throw new UnauthorizedError();
      const report = await reportService.updateStatus(req.params.id, req.user.id, req.body.status);
      sendSuccess(res, { data: report, message: MESSAGES.UPDATED });
    }
  )
};
