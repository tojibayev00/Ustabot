import { v2 as cloudinary } from "cloudinary";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

export { cloudinary };

export const CLOUDINARY_BASE_FOLDER = env.CLOUDINARY_FOLDER;

/**
 * Cloudinary konfiguratsiyasi to'g'ri ekanligini tekshiradi (health check uchun).
 * Haqiqiy fayl yuklamasdan, faqat API credentials orqali ping qiladi.
 */
export async function isCloudinaryHealthy(): Promise<boolean> {
  try {
    const result = await cloudinary.api.ping();
    return result.status === "ok";
  } catch (error) {
    logger.error({ err: error }, "Cloudinary health check muvaffaqiyatsiz");
    return false;
  }
}
