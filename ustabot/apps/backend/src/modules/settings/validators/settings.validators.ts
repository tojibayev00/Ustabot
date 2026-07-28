import { z } from "zod";

export const updateSettingsSchema = z.object({
  telegramChannel: z.string().url().optional(),
  supportUsername: z.string().trim().min(3).max(32).optional(),
  maintenanceMode: z.boolean().optional(),
  appVersion: z.string().trim().max(20).optional(),
  minSupportedVersion: z.string().trim().max(20).optional(),
  privacyPolicy: z.string().max(20000).optional(),
  termsOfService: z.string().max(20000).optional()
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
