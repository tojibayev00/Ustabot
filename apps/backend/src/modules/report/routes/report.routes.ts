import { Router } from "express";
import { reportController } from "@/modules/report/controller/report.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { requirePermission } from "@/middlewares/admin.middleware.js";
import { reportRateLimiter } from "@/middlewares/rateLimit.middleware.js";
import { PERMISSIONS } from "@/constants/permissions.js";
import {
  createReportSchema,
  updateReportStatusSchema,
  listReportsQuerySchema,
  reportIdParamSchema
} from "@/modules/report/validators/report.validators.js";

export const reportRouter = Router();

/**
 * @openapi
 * /reports:
 *   post:
 *     tags: [Reports]
 *     summary: Ustaga shikoyat yozish
 *     responses:
 *       201: { description: Shikoyat qabul qilindi }
 */
reportRouter.post(
  "/",
  authenticate,
  reportRateLimiter,
  validate({ body: createReportSchema }),
  reportController.create
);

/**
 * @openapi
 * /reports:
 *   get:
 *     tags: [Reports]
 *     summary: Shikoyatlar ro'yxati (Moderator/Admin/Super Admin)
 *     responses:
 *       200: { description: Shikoyatlar ro'yxati }
 */
reportRouter.get(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.REPORT_VIEW),
  validate({ query: listReportsQuerySchema }),
  reportController.list
);

/**
 * @openapi
 * /reports/{id}:
 *   patch:
 *     tags: [Reports]
 *     summary: Shikoyat statusini yangilash
 *     responses:
 *       200: { description: Yangilandi }
 */
reportRouter.patch(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.REPORT_UPDATE),
  validate({ params: reportIdParamSchema, body: updateReportStatusSchema }),
  reportController.updateStatus
);
