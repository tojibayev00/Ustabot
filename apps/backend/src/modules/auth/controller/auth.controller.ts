import { authService } from "@/modules/auth/service/auth.service.js";
import type { TelegramAuthInput, RefreshTokenInput } from "@/modules/auth/validators/auth.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";

export const authController = {
  telegramAuth: asyncHandler<unknown, unknown, TelegramAuthInput>(async (req, res) => {
    const result = await authService.authenticateWithTelegram(req.body.initData);
    sendSuccess(res, {
      data: result,
      message: MESSAGES.SUCCESS,
      status: 200
    });
  }),

  refresh: asyncHandler<unknown, unknown, RefreshTokenInput>(async (req, res) => {
    const tokens = await authService.refreshTokens(req.body.refreshToken);
    sendSuccess(res, { data: tokens, message: MESSAGES.SUCCESS });
  }),

  logout: asyncHandler<unknown, unknown, RefreshTokenInput>(async (req, res) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    await authService.logout(req.user.id, req.body.refreshToken);
    sendSuccess(res, { data: null, message: "Tizimdan muvaffaqiyatli chiqdingiz" });
  }),

  logoutAll: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    await authService.logoutAllDevices(req.user.id);
    sendSuccess(res, { data: null, message: "Barcha qurilmalardan chiqildi" });
  }),

  me: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const user = await authService.getMe(req.user.id);
    sendSuccess(res, { data: user, message: MESSAGES.SUCCESS });
  })
};
