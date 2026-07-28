import { Router } from "express";
import { userController } from "@/modules/user/controller/user.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { updateProfileSchema } from "@/modules/user/validators/user.validators.js";

export const userRouter = Router();

userRouter.use(authenticate);

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: O'z profilini olish
 *     responses:
 *       200: { description: Foydalanuvchi profili }
 */
userRouter.get("/me", userController.getMe);

/**
 * @openapi
 * /users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Profilni yangilash (username, til, rasm, bildirishnoma sozlamasi)
 *     responses:
 *       200: { description: Yangilandi }
 *       409: { description: Username band }
 */
userRouter.patch("/me", validate({ body: updateProfileSchema }), userController.updateMe);

/**
 * @openapi
 * /users/me:
 *   delete:
 *     tags: [Users]
 *     summary: Hisobni o'chirish (soft delete)
 *     responses:
 *       200: { description: O'chirildi }
 */
userRouter.delete("/me", userController.deleteMe);
