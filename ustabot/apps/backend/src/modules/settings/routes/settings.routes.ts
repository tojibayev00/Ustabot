import { Router } from "express";
import { settingsController } from "@/modules/settings/controller/settings.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { requirePermission } from "@/middlewares/admin.middleware.js";
import { PERMISSIONS } from "@/constants/permissions.js";
import { updateSettingsSchema } from "@/modules/settings/validators/settings.validators.js";

export const settingsRouter = Router();

/**
 * @openapi
 * /settings:
 *   get:
 *     tags: [Settings]
 *     summary: Global sozlamalarni olish (Public)
 *     security: []
 *     responses:
 *       200: { description: Sozlamalar }
 */
settingsRouter.get("/", settingsController.get);

/**
 * @openapi
 * /settings:
 *   patch:
 *     tags: [Settings]
 *     summary: Global sozlamalarni yangilash (faqat Super Admin)
 *     responses:
 *       200: { description: Yangilandi }
 */
settingsRouter.patch(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.SETTINGS_MANAGE),
  validate({ body: updateSettingsSchema }),
  settingsController.update
);
