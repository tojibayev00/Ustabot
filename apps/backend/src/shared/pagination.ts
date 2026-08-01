import { PAGINATION } from "@/constants/pagination.js";

// Qulaylik uchun qayta eksport — bir nechta servis fayli bu ikkisini
// shared/pagination.js orqali import qiladi (asl manbasi shared/response.js)
export { buildPaginationMeta, type PaginationMeta } from "@/shared/response.js";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Query'dan kelgan page/limit qiymatlarini xavfsiz raqamga o'giradi
 * va MAX_LIMIT chegarasidan oshirmaydi (Rule: never return unlimited data).
 */
export function parsePagination(query: { page?: string; limit?: string }): PaginationParams {
  const page = Math.max(Number.parseInt(query.page ?? "", 10) || PAGINATION.DEFAULT_PAGE, 1);

  const rawLimit = Number.parseInt(query.limit ?? "", 10) || PAGINATION.DEFAULT_LIMIT;
  const limit = Math.min(Math.max(rawLimit, PAGINATION.MIN_LIMIT), PAGINATION.MAX_LIMIT);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

export type SortOrder = "asc" | "desc";

export function parseSort<TAllowed extends string>(
  sort: string | undefined,
  allowedFields: readonly TAllowed[],
  defaultField: TAllowed
): { field: TAllowed; order: SortOrder } {
  if (!sort) {
    return { field: defaultField, order: "desc" };
  }

  const [field, order] = sort.split(":") as [string, string | undefined];
  const resolvedField = allowedFields.includes(field as TAllowed) ? (field as TAllowed) : defaultField;
  const resolvedOrder: SortOrder = order === "asc" ? "asc" : "desc";

  return { field: resolvedField, order: resolvedOrder };
}
