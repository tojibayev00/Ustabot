import { z } from "zod";

export const listNotificationsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  unreadOnly: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true")
});

export const notificationIdParamSchema = z.object({
  id: z.string().uuid("Noto'g'ri ID formati")
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;
export type NotificationIdParam = z.infer<typeof notificationIdParamSchema>;
