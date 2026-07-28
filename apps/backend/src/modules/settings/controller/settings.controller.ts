import { settingsService } from "@/modules/settings/service/settings.service.js";
import type { UpdateSettingsInput } from "@/modules/settings/validators/settings.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";

export const settingsController = {
  get: asyncHandler(async (_req, res) => {
    const settings = await settingsService.get();
    sendSuccess(res, { data: settings, message: MESSAGES.SUCCESS });
  }),

  update: asyncHandler<unknown, unknown, UpdateSettingsInput>(async (req, res) => {
    const settings = await settingsService.update(req.body);
    sendSuccess(res, { data: settings, message: MESSAGES.UPDATED });
  })
};
