import { z } from "zod";

export const syncUserSchema = z.object({
  telegramId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  username: z.string().optional(),
  languageCode: z.string().optional(),
  photoUrl: z.string().optional()
});

export const telegramIdParamSchema = z.object({
  telegramId: z.string().min(1)
});

export const adminActionBodySchema = z.object({
  telegramId: z.string().min(1)
});

export const rejectActionBodySchema = z.object({
  telegramId: z.string().min(1),
  reason: z.string().trim().min(5).max(500)
});

export const telegramIdQuerySchema = z.object({
  telegramId: z.string().min(1)
});

export type SyncUserInput = z.infer<typeof syncUserSchema>;
export type TelegramIdParam = z.infer<typeof telegramIdParamSchema>;
export type AdminActionBody = z.infer<typeof adminActionBodySchema>;
export type RejectActionBody = z.infer<typeof rejectActionBodySchema>;
export type TelegramIdQuery = z.infer<typeof telegramIdQuerySchema>;
