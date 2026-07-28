import type { Category } from "@prisma/client";
import type { CategoryResponse } from "@/modules/category/types/category.types.js";

export function toCategoryResponse(
  category: Category,
  workerCount?: number
): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
    ...(workerCount !== undefined ? { workerCount } : {}),
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  };
}
