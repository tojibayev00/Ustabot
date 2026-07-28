import { z } from "zod";

export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(5, "Username kamida 5 belgidan iborat bo'lishi kerak")
      .max(32)
      .regex(/^[a-zA-Z0-9_]+$/, "Username faqat lotin harflari, raqam va pastki chiziqdan iborat bo'lishi mumkin")
      .optional(),
    languageCode: z.enum(["uz", "ru", "en"]).optional(),
    photoUrl: z.string().url().optional(),
    notificationsEnabled: z.boolean().optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Kamida bitta maydon yuborilishi kerak"
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
