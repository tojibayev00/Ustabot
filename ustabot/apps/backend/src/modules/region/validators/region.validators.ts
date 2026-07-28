import { z } from "zod";

export const createRegionSchema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z
    .string()
    .trim()
    .min(2)
    .max(10)
    .transform((v) => v.toUpperCase())
});

export const updateRegionSchema = createRegionSchema.partial();

export const createDistrictSchema = z.object({
  name: z.string().trim().min(2).max(100),
  regionId: z.string().uuid()
});

export const updateDistrictSchema = z.object({
  name: z.string().trim().min(2).max(100).optional()
});

export const createVillageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  districtId: z.string().uuid()
});

export const updateVillageSchema = z.object({
  name: z.string().trim().min(2).max(100).optional()
});

export const idParamSchema = z.object({
  id: z.string().uuid("Noto'g'ri ID formati")
});

export type CreateRegionInput = z.infer<typeof createRegionSchema>;
export type UpdateRegionInput = z.infer<typeof updateRegionSchema>;
export type CreateDistrictInput = z.infer<typeof createDistrictSchema>;
export type UpdateDistrictInput = z.infer<typeof updateDistrictSchema>;
export type CreateVillageInput = z.infer<typeof createVillageSchema>;
export type UpdateVillageInput = z.infer<typeof updateVillageSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
