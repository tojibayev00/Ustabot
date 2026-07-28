import type { Request, Response } from "express";
import { userService } from "@/modules/user/service/user.service.js";
import type { UpdateProfileInput } from "@/modules/user/validators/user.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";

export const userController = {
  getMe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const profile = await userService.getProfile(req.user.id);
    sendSuccess(res, { data: profile, message: MESSAGES.SUCCESS });
  }),

  updateMe: asyncHandler<unknown, unknown, UpdateProfileInput>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const profile = await userService.updateProfile(req.user.id, req.body);
    sendSuccess(res, { data: profile, message: MESSAGES.UPDATED });
  }),

  deleteMe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    await userService.deleteAccount(req.user.id);
    sendSuccess(res, { data: null, message: MESSAGES.DELETED });
  })
};
