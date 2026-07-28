import { Router } from "express";
import { adminController } from "@/modules/admin/controller/admin.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { requirePermission } from "@/middlewares/admin.middleware.js";
import { PERMISSIONS } from "@/constants/permissions.js";
import {
  listUsersQuerySchema,
  userIdParamSchema,
  changeRoleSchema
} from "@/modules/admin/validators/admin.validators.js";

export const adminUserRouter = Router();
adminUserRouter.use(authenticate, requirePermission(PERMISSIONS.USER_VIEW_ALL));

adminUserRouter.get("/", validate({ query: listUsersQuerySchema }), adminController.listUsers);

adminUserRouter.patch(
  "/:id/block",
  requirePermission(PERMISSIONS.USER_BLOCK),
  validate({ params: userIdParamSchema }),
  adminController.blockUser
);

adminUserRouter.patch(
  "/:id/unblock",
  requirePermission(PERMISSIONS.USER_BLOCK),
  validate({ params: userIdParamSchema }),
  adminController.unblockUser
);

adminUserRouter.patch(
  "/:id/role",
  validate({ params: userIdParamSchema, body: changeRoleSchema }),
  adminController.changeRole
);
