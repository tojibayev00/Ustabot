import { Router } from "express";
import { authController } from "@/modules/auth/controller/auth.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { authRateLimiter } from "@/middlewares/rateLimit.middleware.js";
import { telegramAuthSchema, refreshTokenSchema } from "@/modules/auth/validators/auth.validators.js";

export const authRouter = Router();

authRouter.use(authRateLimiter);

/**
 * @openapi
 * /auth/telegram:
 *   post:
 *     tags: [Auth]
 *     summary: Telegram Mini App orqali autentifikatsiya
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [initData]
 *             properties:
 *               initData:
 *                 type: string
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli autentifikatsiya — access/refresh token va foydalanuvchi ma'lumoti
 *       401:
 *         description: initData yaroqsiz
 */
authRouter.post("/telegram", validate({ body: telegramAuthSchema }), authController.telegramAuth);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Access tokenni refresh token orqali yangilash (rotation)
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Yangi access/refresh token juftligi
 *       401:
 *         description: Refresh token yaroqsiz
 */
authRouter.post("/refresh", validate({ body: refreshTokenSchema }), authController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Joriy qurilmadan chiqish (refresh tokenni bekor qilish)
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli chiqildi
 */
authRouter.post(
  "/logout",
  authenticate,
  validate({ body: refreshTokenSchema }),
  authController.logout
);

/**
 * @openapi
 * /auth/logout-all:
 *   post:
 *     tags: [Auth]
 *     summary: Barcha qurilmalardan chiqish
 *     responses:
 *       200:
 *         description: Barcha sessionlar bekor qilindi
 */
authRouter.post("/logout-all", authenticate, authController.logoutAll);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Joriy autentifikatsiyadan o'tgan foydalanuvchini olish
 *     responses:
 *       200:
 *         description: Foydalanuvchi ma'lumotlari
 *       401:
 *         description: Autentifikatsiyadan o'tilmagan
 */
authRouter.get("/me", authenticate, authController.me);
