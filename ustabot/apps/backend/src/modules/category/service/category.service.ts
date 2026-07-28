import { categoryRepository } from "@/modules/category/repository/category.repository.js";
import { toCategoryResponse } from "@/modules/category/dto/category.dto.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput
} from "@/modules/category/validators/category.validators.js";
import type { CategoryResponse } from "@/modules/category/types/category.types.js";
import { toSlug } from "@/shared/validation.helper.js";
import { getOrSetCache, invalidateCache, CACHE_TTL } from "@/shared/cache.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { ConflictError } from "@/errors/ConflictError.js";

const CACHE_KEY_PUBLIC_LIST = "categories:public:list";

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await categoryRepository.findBySlug(slug);
    if (!existing || existing.id === excludeId) {
      return slug;
    }
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}

export const categoryService = {
  /** Public: faqat ko'rinadigan kategoriyalar, 1 soatlik cache bilan (Part 4: CACHE RULES) */
  async listPublic(): Promise<CategoryResponse[]> {
    return getOrSetCache(CACHE_KEY_PUBLIC_LIST, CACHE_TTL.CATEGORIES, async () => {
      const [categories, workerCounts] = await Promise.all([
        categoryRepository.findAllVisible(),
        categoryRepository.countWorkersPerCategory()
      ]);
      return categories.map((category) =>
        toCategoryResponse(category, workerCounts.get(category.id) ?? 0)
      );
    });
  },

  /** Admin: yashirin kategoriyalarni ham o'z ichiga oladi, cache ishlatilmaydi */
  async listForAdmin(): Promise<CategoryResponse[]> {
    const [categories, workerCounts] = await Promise.all([
      categoryRepository.findAllForAdmin(),
      categoryRepository.countWorkersPerCategory()
    ]);
    return categories.map((category) =>
      toCategoryResponse(category, workerCounts.get(category.id) ?? 0)
    );
  },

  async getById(id: string): Promise<CategoryResponse> {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError("Kategoriya topilmadi");
    }
    return toCategoryResponse(category);
  },

  async create(input: CreateCategoryInput): Promise<CategoryResponse> {
    const baseSlug = toSlug(input.name);
    const slug = await ensureUniqueSlug(baseSlug);

    const category = await categoryRepository.create({
      name: input.name,
      slug,
      icon: input.icon ?? null,
      sortOrder: input.sortOrder,
      isVisible: input.isVisible
    });

    await invalidateCache(CACHE_KEY_PUBLIC_LIST);
    return toCategoryResponse(category);
  },

  async update(id: string, input: UpdateCategoryInput): Promise<CategoryResponse> {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Kategoriya topilmadi");
    }

    let slug: string | undefined;
    if (input.name && input.name !== existing.name) {
      slug = await ensureUniqueSlug(toSlug(input.name), id);
    }

    const category = await categoryRepository.update(id, {
      ...(input.name ? { name: input.name } : {}),
      ...(slug ? { slug } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      ...(input.isVisible !== undefined ? { isVisible: input.isVisible } : {})
    });

    await invalidateCache(CACHE_KEY_PUBLIC_LIST);
    return toCategoryResponse(category);
  },

  /** Ustalar mavjud bo'lgan kategoriyani o'chirish rad etiladi (Part 5: Business Rules) */
  async remove(id: string): Promise<void> {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Kategoriya topilmadi");
    }

    const workerCount = await categoryRepository.countActiveWorkers(id);
    if (workerCount > 0) {
      throw new ConflictError(
        `Ushbu kategoriyada ${workerCount} ta usta mavjud. Avval ularni boshqa kategoriyaga o'tkazing`
      );
    }

    await categoryRepository.softDelete(id);
    await invalidateCache(CACHE_KEY_PUBLIC_LIST);
  }
};
