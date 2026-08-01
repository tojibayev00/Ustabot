import { adminService } from "@/modules/admin/service/admin.service.js";
import type {
  ListUsersQuery,
  UserIdParam,
  ChangeRoleInput
} from "@/modules/admin/validators/admin.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";

export const adminController = {
  listUsers: asyncHandler<unknown, unknown, unknown, ListUsersQuery>(async (req, res) => {
    const result = await adminService.listUsers(req.query);
    sendSuccess(res, { data: result.items, meta: result.meta, message: MESSAGES.SUCCESS });
  }),

  blockUser: asyncHandler<UserIdParam>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await adminService.blockUser(req.user.id, req.params.id);
    sendSuccess(res, { data: null, message: MESSAGES.USER_BLOCKED });
  }),

  unblockUser: asyncHandler<UserIdParam>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await adminService.unblockUser(req.user.id, req.params.id);
    sendSuccess(res, { data: null, message: "Foydalanuvchi blokdan chiqarildi" });
  }),

  changeRole: asyncHandler<UserIdParam, unknown, ChangeRoleInput>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await adminService.changeRole(req.user.role, req.user.id, req.params.id, req.body.role);
    sendSuccess(res, { data: null, message: MESSAGES.UPDATED });
  })
};
