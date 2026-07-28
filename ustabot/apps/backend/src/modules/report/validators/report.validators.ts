import { z } from "zod";

export const createReportSchema = z.object({
  workerId: z.string().uuid("Noto'g'ri usta ID"),
  reason: z.string().trim().min(3, "Sabab kamida 3 belgidan iborat bo'lishi kerak").max(200),
  description: z.string().trim().max(1000).optional()
});

export const updateReportStatusSchema = z.object({
  status: z.enum(["REVIEWING", "RESOLVED", "REJECTED"])
});

export const listReportsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["PENDING", "REVIEWING", "RESOLVED", "REJECTED"]).optional(),
  workerId: z.string().uuid().optional(),
  reporterId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional()
});

export const reportIdParamSchema = z.object({
  id: z.string().uuid("Noto'g'ri ID formati")
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
export type ListReportsQuery = z.infer<typeof listReportsQuerySchema>;
export type ReportIdParam = z.infer<typeof reportIdParamSchema>;
