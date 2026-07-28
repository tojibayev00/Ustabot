import { Router } from "express";
import { uploadController } from "@/modules/upload/controller/upload.controller.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { uploadRateLimiter } from "@/middlewares/rateLimit.middleware.js";
import { uploadSingleImage } from "@/middlewares/upload.middleware.js";

export const uploadRouter = Router();

/**
 * @openapi
 * /upload/image:
 *   post:
 *     tags: [Upload]
 *     summary: Umumiy rasm yuklash (max 2MB, JPG/PNG/WEBP)
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: Cloudinary URL va public ID }
 *       400: { description: Fayl formati yoki hajmi noto'g'ri }
 */
uploadRouter.post(
  "/image",
  authenticate,
  uploadRateLimiter,
  uploadSingleImage,
  uploadController.uploadImage
);
