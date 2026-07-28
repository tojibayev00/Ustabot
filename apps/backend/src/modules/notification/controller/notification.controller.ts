import type { Request, Response } from "express";
import { notificationService } from "@/modules/notification/service/notification.service.js";
import type {
  ListNotificationsQuery,
  NotificationIdParam
} from "@/modules/notification/validators/notification.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";

export const notificationController = {
  list: asyncHandler<unknown, unknown, unknown, ListNotificationsQuery>(
    async (req: Request, res: Response) => {
      if (!req.user) throw new UnauthorizedError();
      const result = await notificationService.list(req.user.id, req.query);
      sendSuccess(res, {
        data: result.items,
        meta: { ...result.meta, unreadCount: result.unreadCount },
        message: MESSAGES.SUCCESS
      });
    }
  ),

  markAsRead: asyncHandler<NotificationIdParam>(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const notification = await notificationService.markAsRead(req.user.id, req.params.id);
    sendSuccess(res, { data: notification, message: MESSAGES.UPDATED });
  }),

  markAllAsRead: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError();
    const result = await notificationService.markAllAsRead(req.user.id);
    sendSuccess(res, { data: result, message: MESSAGES.UPDATED });
  })
};
