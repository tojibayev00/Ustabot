import { Router } from "express";
import { notificationController } from "@/modules/notification/controller/notification.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import {
  listNotificationsQuerySchema,
  notificationIdParamSchema
} from "@/modules/notification/validators/notification.validators.js";

export const notificationRouter = Router();

notificationRouter.use(authenticate);

/**
 * @openapi
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Joriy foydalanuvchining bildirishnomalari
 *     responses:
 *       200: { description: Bildirishnomalar ro'yxati }
 */
notificationRouter.get(
  "/",
  validate({ query: listNotificationsQuerySchema }),
  notificationController.list
);

/**
 * @openapi
 * /notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Barcha bildirishnomalarni o'qilgan deb belgilash
 *     responses:
 *       200: { description: Yangilandi }
 */
notificationRouter.patch("/read-all", notificationController.markAllAsRead);

/**
 * @openapi
 * /notifications/read/{id}:
 *   patch:
 *     tags: [Notifications]
 *     summary: Bitta bildirishnomani o'qilgan deb belgilash
 *     responses:
 *       200: { description: Yangilandi }
 */
notificationRouter.patch(
  "/read/:id",
  validate({ params: notificationIdParamSchema }),
  notificationController.markAsRead
);
