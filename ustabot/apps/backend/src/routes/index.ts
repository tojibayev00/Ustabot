import { Router } from "express";
import { env } from "@/config/env.js";
import { authRouter } from "@/modules/auth/routes/auth.routes.js";
import { categoryRouter } from "@/modules/category/routes/category.routes.js";
import {
  regionRouter,
  districtRouter,
  villageRouter
} from "@/modules/region/routes/region.routes.js";
import { userRouter } from "@/modules/user/routes/user.routes.js";
import { workerRouter, adminWorkerRouter } from "@/modules/worker/routes/worker.routes.js";
import { uploadRouter } from "@/modules/upload/routes/upload.routes.js";
import { searchRouter } from "@/modules/search/routes/search.routes.js";
import { reportRouter } from "@/modules/report/routes/report.routes.js";
import { notificationRouter } from "@/modules/notification/routes/notification.routes.js";
import { broadcastRouter } from "@/modules/broadcast/routes/broadcast.routes.js";
import { analyticsRouter } from "@/modules/analytics/routes/analytics.routes.js";
import { settingsRouter } from "@/modules/settings/routes/settings.routes.js";
import { internalRouter } from "@/modules/internal/routes/internal.routes.js";
import { adminUserRouter } from "@/modules/admin/routes/admin.routes.js";

export const apiRouter = Router();

apiRouter.use("/internal", internalRouter);
apiRouter.use("/admin/users", adminUserRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/regions", regionRouter);
apiRouter.use("/districts", districtRouter);
apiRouter.use("/villages", villageRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/workers", workerRouter);
apiRouter.use("/admin/workers", adminWorkerRouter);
apiRouter.use("/upload", uploadRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/admin/broadcast", broadcastRouter);
apiRouter.use("/analytics/dashboard", analyticsRouter);
apiRouter.use("/admin/dashboard", analyticsRouter);
apiRouter.use("/settings", settingsRouter);

/**
 * API haqida umumiy ma'lumot — versiya tekshirish uchun qulay.
 */
apiRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: env.APP_NAME,
      version: env.APP_VERSION,
      docs: `${env.API_PREFIX}/docs`
    },
    meta: {},
    message: "Ustalar Topish API"
  });
});

/**
 * Barcha Phase 5/6 REST API modullari ulandi:
 * Auth, Category, Region/District/Village, User, Worker, Upload, Search,
 * Report, Notification, Broadcast, Analytics, Settings.
 */
