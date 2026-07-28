import { Router } from "express";
import { categoryController } from "@/modules/category/controller/category.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate, optionalAuthenticate } from "@/middlewares/auth.middleware.js";
import { requirePermission } from "@/middlewares/admin.middleware.js";
import { PERMISSIONS } from "@/constants/permissions.js";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema
} from "@/modules/category/validators/category.validators.js";

export const categoryRouter = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Kategoriyalar ro'yxati (public — faqat ko'rinadiganlar, admin uchun to'liq)
 *     security: []
 *     responses:
 *       200:
 *         description: Kategoriyalar ro'yxati
 */
categoryRouter.get("/", optionalAuthenticate, categoryController.list);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Bitta kategoriyani ID orqali olish
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Kategoriya
 *       404:
 *         description: Topilmadi
 */
categoryRouter.get("/:id", validate({ params: categoryIdParamSchema }), categoryController.getById);

/**
 * @openapi
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Yangi kategoriya yaratish (Admin)
 *     responses:
 *       201:
 *         description: Yaratildi
 */
categoryRouter.post(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.CATEGORY_MANAGE),
  validate({ body: createCategorySchema }),
  categoryController.create
);

/**
 * @openapi
 * /categories/{id}:
 *   patch:
 *     tags: [Categories]
 *     summary: Kategoriyani yangilash (Admin)
 *     responses:
 *       200:
 *         description: Yangilandi
 */
categoryRouter.patch(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.CATEGORY_MANAGE),
  validate({ params: categoryIdParamSchema, body: updateCategorySchema }),
  categoryController.update
);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Kategoriyani o'chirish (Admin). Ustalar mavjud bo'lsa rad etiladi
 *     responses:
 *       200:
 *         description: O'chirildi
 *       409:
 *         description: Ustalar mavjudligi sababli o'chirib bo'lmaydi
 */
categoryRouter.delete(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.CATEGORY_MANAGE),
  validate({ params: categoryIdParamSchema }),
  categoryController.remove
);
