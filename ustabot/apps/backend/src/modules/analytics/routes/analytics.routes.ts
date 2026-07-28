import { Router } from "express";
import { analyticsController } from "@/modules/analytics/controller/analytics.controller.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { requirePermission } from "@/middlewares/admin.middleware.js";
import { PERMISSIONS } from "@/constants/permissions.js";

/**
 * @openapi
 * /analytics/dashboard:
 *   get:
 *     tags: [Analytics]
 *     summary: Dashboard statistikasi (Admin). Xuddi shu handler /admin/dashboard'da ham ishlaydi
 *     responses:
 *       200: { description: Dashboard ma'lumotlari }
 */
export const analyticsRouter = Router();
analyticsRouter.get(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.ANALYTICS_VIEW),
  analyticsController.getDashboard
);
