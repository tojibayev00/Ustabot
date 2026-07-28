import type { Request, Response } from "express";
import { categoryService } from "@/modules/category/service/category.service.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryIdParam
} from "@/modules/category/validators/category.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";
import { ADMIN_ROLES } from "@/constants/roles.js";

export const categoryController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const isAdminRequest = req.user && ADMIN_ROLES.includes(req.user.role);
    const categories = isAdminRequest
      ? await categoryService.listForAdmin()
      : await categoryService.listPublic();

    sendSuccess(res, { data: categories, message: MESSAGES.SUCCESS });
  }),

  getById: asyncHandler<CategoryIdParam>(async (req, res) => {
    const category = await categoryService.getById(req.params.id);
    sendSuccess(res, { data: category, message: MESSAGES.SUCCESS });
  }),

  create: asyncHandler<unknown, unknown, CreateCategoryInput>(async (req, res) => {
    const category = await categoryService.create(req.body);
    sendSuccess(res, { data: category, message: MESSAGES.CREATED, status: 201 });
  }),

  update: asyncHandler<CategoryIdParam, unknown, UpdateCategoryInput>(async (req, res) => {
    const category = await categoryService.update(req.params.id, req.body);
    sendSuccess(res, { data: category, message: MESSAGES.UPDATED });
  }),

  remove: asyncHandler<CategoryIdParam>(async (req, res) => {
    await categoryService.remove(req.params.id);
    sendSuccess(res, { data: null, message: MESSAGES.DELETED });
  })
};
