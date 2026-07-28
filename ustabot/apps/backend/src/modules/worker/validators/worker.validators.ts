import { z } from "zod";
import { isValidUzbekPhone, normalizePhone } from "@/shared/phone.helper.js";
import { isWithinUzbekistan } from "@/constants/regions.js";
import { PAGINATION } from "@/constants/pagination.js";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const registerWorkerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Ism kamida 2 belgidan iborat bo'lishi kerak").max(50),
    lastName: z.string().trim().min(2, "Familiya kamida 2 belgidan iborat bo'lishi kerak").max(50),
    age: z.coerce.number().int().min(18, "Yosh kamida 18 bo'lishi kerak").max(100),
    phone: z
      .string()
      .trim()
      .refine((value) => isValidUzbekPhone(value), "Telefon raqam noto'g'ri formatda")
      .transform((value) => normalizePhone(value)),
    telegramUsername: z.string().trim().min(3).max(32).optional(),
    categoryId: z.string().uuid("Kategoriya tanlanishi shart"),
    regionId: z.string().uuid("Viloyat tanlanishi shart"),
    districtId: z.string().uuid("Tuman tanlanishi shart"),
    villageId: z.string().uuid().optional(),
    description: z
      .string()
      .trim()
      .min(20, "Tavsif kamida 20 belgidan iborat bo'lishi kerak")
      .max(1000, "Tavsif 1000 belgidan oshmasligi kerak"),
    experienceYears: z.coerce.number().int().min(0).max(80),
    address: z.string().trim().min(5).max(255),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    workingHoursStart: z.string().regex(timeRegex, "Format: HH:mm"),
    workingHoursEnd: z.string().regex(timeRegex, "Format: HH:mm")
  })
  .refine((data) => isWithinUzbekistan(data.latitude, data.longitude), {
    message: "Manzil koordinatalari O'zbekiston hududidan tashqarida",
    path: ["latitude"]
  })
  .refine((data) => data.workingHoursStart < data.workingHoursEnd, {
    message: "Ish boshlanish vaqti tugash vaqtidan oldin bo'lishi kerak",
    path: ["workingHoursEnd"]
  });

export const updateWorkerSchema = z.object({
  firstName: z.string().trim().min(2).max(50).optional(),
  lastName: z.string().trim().min(2).max(50).optional(),
  age: z.coerce.number().int().min(18).max(100).optional(),
  phone: z
    .string()
    .trim()
    .refine((value) => isValidUzbekPhone(value), "Telefon raqam noto'g'ri formatda")
    .transform((value) => normalizePhone(value))
    .optional(),
  telegramUsername: z.string().trim().min(3).max(32).optional(),
  categoryId: z.string().uuid().optional(),
  regionId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
  villageId: z.string().uuid().optional(),
  description: z.string().trim().min(20).max(1000).optional(),
  experienceYears: z.coerce.number().int().min(0).max(80).optional(),
  address: z.string().trim().min(5).max(255).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  workingHoursStart: z.string().regex(timeRegex).optional(),
  workingHoursEnd: z.string().regex(timeRegex).optional()
});

export const listWorkersQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().uuid().optional(),
  region: z.string().uuid().optional(),
  district: z.string().uuid().optional(),
  village: z.string().uuid().optional(),
  experience: z.coerce.number().int().min(0).optional(),
  search: z.string().trim().max(100).optional(),
  sort: z.string().optional(),
  verified: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true"))
});

export const adminListWorkersQuerySchema = listWorkersQuerySchema.extend({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "BLOCKED"]).optional()
});

export const rejectWorkerSchema = z.object({
  reason: z.string().trim().min(5, "Sabab kamida 5 belgidan iborat bo'lishi kerak").max(500)
});

export const workerIdParamSchema = z.object({
  id: z.string().uuid("Noto'g'ri ID formati")
});

export const galleryImageParamSchema = z.object({
  imageId: z.string().uuid("Noto'g'ri rasm ID")
});

export type RegisterWorkerInput = z.infer<typeof registerWorkerSchema>;
export type UpdateWorkerInput = z.infer<typeof updateWorkerSchema>;
export type ListWorkersQuery = z.infer<typeof listWorkersQuerySchema>;
export type AdminListWorkersQuery = z.infer<typeof adminListWorkersQuerySchema>;
export type RejectWorkerInput = z.infer<typeof rejectWorkerSchema>;
export type WorkerIdParam = z.infer<typeof workerIdParamSchema>;
export type GalleryImageParam = z.infer<typeof galleryImageParamSchema>;

export const PAGINATION_DEFAULTS = PAGINATION;
