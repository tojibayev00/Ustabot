import { analyticsService } from "@/modules/analytics/service/analytics.service.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";

export const analyticsController = {
  getDashboard: asyncHandler(async (_req, res) => {
    const dashboard = await analyticsService.getDashboard();
    sendSuccess(res, { data: dashboard, message: MESSAGES.SUCCESS });
  })
};
