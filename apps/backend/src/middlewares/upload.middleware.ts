import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
import { UPLOAD_LIMITS, PORTFOLIO_IMAGE_LIMITS } from "@/constants/pagination.js";
import { BadRequestError } from "@/errors/BadRequestError.js";

const storage = multer.memoryStorage();

function imageFileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void {
  const allowed: readonly string[] = UPLOAD_LIMITS.ALLOWED_MIME_TYPES;
  if (!allowed.includes(file.mimetype)) {
    cb(new BadRequestError("Faqat JPG, JPEG, PNG yoki WEBP formatidagi rasmlar qabul qilinadi"));
    return;
  }
  cb(null, true);
}

/** Bitta rasm yuklash uchun (masalan, umumiy /upload/image endpointi) */
export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES, files: 1 },
  fileFilter: imageFileFilter
}).single("image");

/** Worker portfolio galereyasi uchun — bir nechta rasm (maksimal 20 ta) */
export const uploadGalleryImages = multer({
  storage,
  limits: {
    fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES,
    files: PORTFOLIO_IMAGE_LIMITS.MAX
  },
  fileFilter: imageFileFilter
}).array("images", PORTFOLIO_IMAGE_LIMITS.MAX);
