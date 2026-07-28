import sharp from "sharp";
import { cloudinary, CLOUDINARY_BASE_FOLDER } from "@/config/cloudinary.js";
import { logger } from "@/config/logger.js";
import { InternalServerError } from "@/errors/InternalServerError.js";

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  size: number;
}

/**
 * Rasmni Cloudinary'ga yuklashdan oldin siqadi va WebP'ga o'giradi.
 * Maksimal kenglik 1600px bilan cheklanadi (portfolio/profil rasmlari uchun yetarli).
 */
export async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate() // EXIF orientatsiyasini to'g'rilaydi, keyin metadata olib tashlanadi
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

export async function uploadImageToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<UploadedImage> {
  try {
    const compressed = await compressImage(buffer);

    const result = await new Promise<UploadedImage>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${CLOUDINARY_BASE_FOLDER}/${folder}`,
          resource_type: "image",
          format: "webp"
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Cloudinary yuklash muvaffaqiyatsiz tugadi"));
            return;
          }
          resolve({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            size: uploadResult.bytes
          });
        }
      );
      uploadStream.end(compressed);
    });

    return result;
  } catch (error) {
    logger.error({ err: error }, "Rasmni Cloudinary'ga yuklashda xatolik");
    throw new InternalServerError("Rasmni yuklashda xatolik yuz berdi");
  }
}

export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    logger.error({ err: error, publicId }, "Cloudinary'dan rasmni o'chirishda xatolik");
    throw new InternalServerError("Rasmni o'chirishda xatolik yuz berdi");
  }
}
