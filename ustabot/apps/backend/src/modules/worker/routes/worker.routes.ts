import { Router } from "express";
import { workerController } from "@/modules/worker/controller/worker.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate, optionalAuthenticate } from "@/middlewares/auth.middleware.js";
import { requirePermission } from "@/middlewares/admin.middleware.js";
import { uploadRateLimiter } from "@/middlewares/rateLimit.middleware.js";
import { uploadGalleryImages } from "@/middlewares/upload.middleware.js";
import { PERMISSIONS } from "@/constants/permissions.js";
import {
  registerWorkerSchema,
  updateWorkerSchema,
  listWorkersQuerySchema,
  adminListWorkersQuerySchema,
  rejectWorkerSchema,
  workerIdParamSchema,
  galleryImageParamSchema
} from "@/modules/worker/validators/worker.validators.js";

// ================= /workers =================
export const workerRouter = Router();

/**
 * @openapi
 * /workers:
 *   get:
 *     tags: [Workers]
 *     summary: Tasdiqlangan ustalar ro'yxati (filtr, qidiruv, saralash, sahifalash)
 *     security: []
 *     responses:
 *       200: { description: Ustalar ro'yxati }
 */
workerRouter.get("/", optionalAuthenticate, validate({ query: listWorkersQuerySchema }), workerController.list);

/**
 * @openapi
 * /workers/register:
 *   post:
 *     tags: [Workers]
 *     summary: Usta sifatida ro'yxatdan o'tish (portfolio rasmlar bilan, multipart/form-data)
 *     responses:
 *       201: { description: Ariza qabul qilindi, moderatsiya kutilmoqda }
 *       409: { description: Foydalanuvchi allaqachon usta yoki telefon band }
 */
workerRouter.post(
  "/register",
  authenticate,
  uploadRateLimiter,
  uploadGalleryImages,
  validate({ body: registerWorkerSchema }),
  workerController.register
);

workerRouter.get("/me", authenticate, workerController.getMyWorker);
workerRouter.patch(
  "/me",
  authenticate,
  validate({ body: updateWorkerSchema }),
  workerController.updateMyWorker
);
workerRouter.delete("/me", authenticate, workerController.deleteMyWorker);
workerRouter.get("/me/status", authenticate, workerController.getMyStatus);

workerRouter.post(
  "/me/gallery",
  authenticate,
  uploadRateLimiter,
  uploadGalleryImages,
  workerController.addGalleryImages
);

workerRouter.delete(
  "/me/gallery/:imageId",
  authenticate,
  validate({ params: galleryImageParamSchema }),
  workerController.removeGalleryImage
);

/**
 * @openapi
 * /workers/{id}:
 *   get:
 *     tags: [Workers]
 *     summary: Usta profilini olish (ko'rishlar soni oshadi)
 *     security: []
 *     responses:
 *       200: { description: Usta profili }
 *       404: { description: Topilmadi }
 */
workerRouter.get(
  "/:id",
  optionalAuthenticate,
  validate({ params: workerIdParamSchema }),
  workerController.getById
);

// ================= /admin/workers =================
export const adminWorkerRouter = Router();
adminWorkerRouter.use(authenticate, requirePermission(PERMISSIONS.WORKER_VIEW_ALL));

adminWorkerRouter.get(
  "/",
  validate({ query: adminListWorkersQuerySchema }),
  workerController.adminList
);

adminWorkerRouter.patch(
  "/:id/approve",
  requirePermission(PERMISSIONS.WORKER_APPROVE),
  validate({ params: workerIdParamSchema }),
  workerController.approve
);

adminWorkerRouter.patch(
  "/:id/reject",
  requirePermission(PERMISSIONS.WORKER_REJECT),
  validate({ params: workerIdParamSchema, body: rejectWorkerSchema }),
  workerController.reject
);

adminWorkerRouter.patch(
  "/:id/block",
  requirePermission(PERMISSIONS.WORKER_BLOCK),
  validate({ params: workerIdParamSchema }),
  workerController.block
);

adminWorkerRouter.patch(
  "/:id/activate",
  requirePermission(PERMISSIONS.WORKER_ACTIVATE),
  validate({ params: workerIdParamSchema }),
  workerController.activate
);

adminWorkerRouter.delete(
  "/:id",
  requirePermission(PERMISSIONS.WORKER_DELETE),
  validate({ params: workerIdParamSchema }),
  workerController.removeByAdmin
);
