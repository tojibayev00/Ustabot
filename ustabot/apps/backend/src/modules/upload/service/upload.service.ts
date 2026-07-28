import { uploadImageToCloudinary } from "@/shared/cloudinary.helper.js";
import type { UploadImageResponse } from "@/modules/upload/types/upload.types.js";
import { BadRequestError } from "@/errors/BadRequestError.js";

export const uploadService = {
  async uploadGeneralImage(file: Express.Multer.File | undefined): Promise<UploadImageResponse> {
    if (!file) {
      throw new BadRequestError("Rasm fayli topilmadi");
    }

    const result = await uploadImageToCloudinary(file.buffer, "general");

    return {
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      size: result.size
    };
  }
};
