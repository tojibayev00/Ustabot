import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Nomi kamida 2 belgidan iborat bo'lishi kerak").max(100),
  icon: z.string().trim().min(1).max(50).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isVisible: z.coerce.boolean().default(true)
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdParamSchema = z.object({
  id: z.string().uuid("Noto'g'ri ID formati")
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;
