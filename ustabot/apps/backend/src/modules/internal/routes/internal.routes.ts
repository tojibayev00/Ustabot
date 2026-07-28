import { Router } from "express";
import { internalController } from "@/modules/internal/controller/internal.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { requireInternalApiKey } from "@/middlewares/internalAuth.middleware.js";
import {
  syncUserSchema,
  telegramIdParamSchema,
  adminActionBodySchema,
  rejectActionBodySchema,
  telegramIdQuerySchema
} from "@/modules/internal/validators/internal.validators.js";
import { workerIdParamSchema } from "@/modules/worker/validators/worker.validators.js";

export const internalRouter = Router();

/** Ushbu router'dagi BARCHA endpointlar faqat Telegram Bot uchun — JWT emas, ichki kalit talab qilinadi */
internalRouter.use(requireInternalApiKey);

internalRouter.post("/users/sync", validate({ body: syncUserSchema }), internalController.syncUser);

internalRouter.get(
  "/users/:telegramId",
  validate({ params: telegramIdParamSchema }),
  internalController.getUser
);

internalRouter.get("/workers/pending", internalController.listPendingWorkers);

internalRouter.post(
  "/workers/:id/approve",
  validate({ params: workerIdParamSchema, body: adminActionBodySchema }),
  internalController.approveWorker
);

internalRouter.post(
  "/workers/:id/reject",
  validate({ params: workerIdParamSchema, body: rejectActionBodySchema }),
  internalController.rejectWorker
);

internalRouter.get(
  "/dashboard-summary",
  validate({ query: telegramIdQuerySchema }),
  internalController.dashboardSummary
);

internalRouter.get(
  "/reports/pending-count",
  validate({ query: telegramIdQuerySchema }),
  internalController.pendingReportsCount
);
