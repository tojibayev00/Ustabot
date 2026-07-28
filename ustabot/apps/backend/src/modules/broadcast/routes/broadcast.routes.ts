import { Router } from "express";
import { broadcastController } from "@/modules/broadcast/controller/broadcast.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { requirePermission } from "@/middlewares/admin.middleware.js";
import { PERMISSIONS } from "@/constants/permissions.js";
import {
  createBroadcastSchema,
  listBroadcastHistoryQuerySchema
} from "@/modules/broadcast/validators/broadcast.validators.js";

export const broadcastRouter = Router();

broadcastRouter.use(authenticate, requirePermission(PERMISSIONS.BROADCAST_SEND));

/**
 * @openapi
 * /admin/broadcast:
 *   post:
 *     tags: [Broadcast]
 *     summary: Ommaviy xabar yuborish (fon rejimida, queue orqali)
 *     responses:
 *       201: { description: Navbatga qo'yildi }
 */
broadcastRouter.post("/", validate({ body: createBroadcastSchema }), broadcastController.create);

/**
 * @openapi
 * /admin/broadcast/history:
 *   get:
 *     tags: [Broadcast]
 *     summary: Broadcast tarixi (muvaffaqiyat/xato statistikasi bilan)
 *     responses:
 *       200: { description: Tarix ro'yxati }
 */
broadcastRouter.get(
  "/history",
  validate({ query: listBroadcastHistoryQuerySchema }),
  broadcastController.history
);

broadcastRouter.get("/:id", broadcastController.getById);
