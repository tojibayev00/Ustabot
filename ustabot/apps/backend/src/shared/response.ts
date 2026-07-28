import type { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface SuccessOptions<T> {
  data: T;
  message?: string;
  meta?: PaginationMeta | Record<string, unknown>;
  status?: number;
}

/**
 * Barcha muvaffaqiyatli API javoblari shu formatda qaytariladi:
 * { success: true, data, meta, message }
 */
export function sendSuccess<T>(res: Response, options: SuccessOptions<T>): Response {
  const { data, message = "Success", meta = {}, status = 200 } = options;
  return res.status(status).json({
    success: true,
    data,
    meta,
    message
  });
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
}
