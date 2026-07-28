import type { Category, Prisma } from "@prisma/client";
import { prisma } from "@/config/database.js";

export const categoryRepository = {
  async findAllVisible(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { isVisible: true, deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });
  },

  async findAllForAdmin(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });
  },

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findFirst({ where: { id, deletedAt: null } });
  },

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findFirst({ where: { slug, deletedAt: null } });
  },

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  },

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  },

  async softDelete(id: string): Promise<Category> {
    return prisma.category.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  async countActiveWorkers(categoryId: string): Promise<number> {
    return prisma.worker.count({
      where: { categoryId, deletedAt: null }
    });
  },

  async countWorkersPerCategory(): Promise<Map<string, number>> {
    const grouped = await prisma.worker.groupBy({
      by: ["categoryId"],
      where: { deletedAt: null, status: "APPROVED" },
      _count: { _all: true }
    });
    return new Map(grouped.map((g) => [g.categoryId, g._count._all]));
  }
};
