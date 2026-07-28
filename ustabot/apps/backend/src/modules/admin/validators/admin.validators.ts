import { z } from "zod";

export const listUsersQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().trim().max(100).optional(),
  role: z.enum(["USER", "WORKER", "MODERATOR", "ADMIN", "SUPER_ADMIN"]).optional(),
  isBlocked: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true"))
});

export const userIdParamSchema = z.object({
  id: z.string().uuid("Noto'g'ri ID formati")
});

export const changeRoleSchema = z.object({
  role: z.enum(["USER", "MODERATOR", "ADMIN"])
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
