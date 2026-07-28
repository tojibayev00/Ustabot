import { describe, it, expect, vi, beforeEach } from "vitest";

// Redis'ga bog'liq cache qatlamini mock qilamiz — unit test haqiqiy Redis'siz ishlashi kerak
vi.mock("@/shared/cache.js", () => ({
  getOrSetCache: async (_key: string, _ttl: number, fetcher: () => unknown) => fetcher(),
  invalidateCache: async () => undefined,
  invalidateCacheByPattern: async () => undefined,
  CACHE_TTL: {
    CATEGORIES: 3600,
    REGIONS: 86400,
    DISTRICTS: 86400,
    VILLAGES: 86400,
    SETTINGS: 86400,
    WORKERS_LIST: 300,
    DASHBOARD: 120,
    SEARCH: 300
  }
}));

vi.mock("@/modules/category/repository/category.repository.js", () => ({
  categoryRepository: {
    findAllVisible: vi.fn(),
    findAllForAdmin: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
    countActiveWorkers: vi.fn(),
    countWorkersPerCategory: vi.fn()
  }
}));

const { categoryRepository } = await import("@/modules/category/repository/category.repository.js");
const { categoryService } = await import("@/modules/category/service/category.service.js");
const { NotFoundError } = await import("@/errors/NotFoundError.js");
const { ConflictError } = await import("@/errors/ConflictError.js");

function buildCategory(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "cat-1",
    name: "Santexnik",
    slug: "santexnik",
    icon: "Wrench",
    sortOrder: 1,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides
  };
}

describe("categoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listPublic", () => {
    it("faqat ko'rinadigan kategoriyalarni worker soni bilan qaytaradi", async () => {
      vi.mocked(categoryRepository.findAllVisible).mockResolvedValue([buildCategory()] as never);
      vi.mocked(categoryRepository.countWorkersPerCategory).mockResolvedValue(
        new Map([["cat-1", 5]]) as never
      );

      const result = await categoryService.listPublic();

      expect(result).toHaveLength(1);
      expect(result[0]?.workerCount).toBe(5);
      expect(result[0]?.slug).toBe("santexnik");
    });
  });

  describe("getById", () => {
    it("topilmasa NotFoundError tashlaydi", async () => {
      vi.mocked(categoryRepository.findById).mockResolvedValue(null);
      await expect(categoryService.getById("missing-id")).rejects.toThrow(NotFoundError);
    });

    it("topilsa kategoriyani qaytaradi", async () => {
      vi.mocked(categoryRepository.findById).mockResolvedValue(buildCategory() as never);
      const result = await categoryService.getById("cat-1");
      expect(result.name).toBe("Santexnik");
    });
  });

  describe("create", () => {
    it("nomdan avtomatik unikal slug generatsiya qiladi", async () => {
      vi.mocked(categoryRepository.findBySlug).mockResolvedValue(null);
      vi.mocked(categoryRepository.create).mockResolvedValue(buildCategory() as never);

      await categoryService.create({ name: "Santexnik", sortOrder: 0, isVisible: true });

      expect(categoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "santexnik" })
      );
    });

    it("slug band bo'lsa raqam qo'shib unikal qiladi", async () => {
      vi.mocked(categoryRepository.findBySlug)
        .mockResolvedValueOnce(buildCategory({ id: "existing" }) as never)
        .mockResolvedValueOnce(null);
      vi.mocked(categoryRepository.create).mockResolvedValue(buildCategory({ slug: "santexnik-2" }) as never);

      await categoryService.create({ name: "Santexnik", sortOrder: 0, isVisible: true });

      expect(categoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "santexnik-2" })
      );
    });
  });

  describe("remove", () => {
    it("ustalar mavjud bo'lsa ConflictError tashlaydi", async () => {
      vi.mocked(categoryRepository.findById).mockResolvedValue(buildCategory() as never);
      vi.mocked(categoryRepository.countActiveWorkers).mockResolvedValue(3);

      await expect(categoryService.remove("cat-1")).rejects.toThrow(ConflictError);
      expect(categoryRepository.softDelete).not.toHaveBeenCalled();
    });

    it("ustalar bo'lmasa muvaffaqiyatli o'chiradi", async () => {
      vi.mocked(categoryRepository.findById).mockResolvedValue(buildCategory() as never);
      vi.mocked(categoryRepository.countActiveWorkers).mockResolvedValue(0);
      vi.mocked(categoryRepository.softDelete).mockResolvedValue(buildCategory() as never);

      await categoryService.remove("cat-1");
      expect(categoryRepository.softDelete).toHaveBeenCalledWith("cat-1");
    });
  });
});
