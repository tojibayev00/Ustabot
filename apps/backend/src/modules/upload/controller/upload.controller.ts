import { uploadService } from "@/modules/upload/service/upload.service.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";

export const uploadController = {
  uploadImage: asyncHandler(async (req, res) => {
    const result = await uploadService.uploadGeneralImage(req.file);
    sendSuccess(res, { data: result, message: MESSAGES.SUCCESS, status: 201 });
  })
};
