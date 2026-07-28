import type { Prisma, Worker, WorkerStatus } from "@prisma/client";
import { prisma } from "@/config/database.js";
import { PAGINATION } from "@/constants/pagination.js";

const detailInclude = {
  category: { select: { id: true, name: true, slug: true, icon: true } },
  region: { select: { id: true, name: true } },
  district: { select: { id: true, name: true } },
  village: { select: { id: true, name: true } },
  portfolioImages: { orderBy: { createdAt: "asc" as const } }
} satisfies Prisma.WorkerInclude;

export type WorkerWithDetails = Prisma.WorkerGetPayload<{ include: typeof detailInclude }>;

const listInclude = {
  category: { select: { name: true, slug: true } },
  region: { select: { name: true } },
  district: { select: { name: true } },
  portfolioImages: { take: 1, orderBy: { createdAt: "asc" as const } }
} satisfies Prisma.WorkerInclude;

export type WorkerListRow = Prisma.WorkerGetPayload<{ include: typeof listInclude }>;

export interface WorkerFilters {
  status?: WorkerStatus;
  categoryId?: string;
  regionId?: string;
  districtId?: string;
  villageId?: string;
  minExperience?: number;
  search?: string;
  verified?: boolean;
}

export interface SortOption {
  field: "createdAt" | "views" | "experienceYears" | "firstName";
  order: "asc" | "desc";
}

function buildWhere(filters: WorkerFilters): Prisma.WorkerWhereInput {
  const where: Prisma.WorkerWhereInput = {
    deletedAt: null,
    status: filters.status ?? "APPROVED"
  };

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.regionId) where.regionId = filters.regionId;
  if (filters.districtId) where.districtId = filters.districtId;
  if (filters.villageId) where.villageId = filters.villageId;
  if (filters.minExperience !== undefined) {
    where.experienceYears = { gte: filters.minExperience };
  }
  if (filters.verified !== undefined) where.isVerified = filters.verified;

  if (filters.search) {
    const term = filters.search.trim();
    where.OR = [
      { firstName: { contains: term, mode: "insensitive" } },
      { lastName: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { address: { contains: term, mode: "insensitive" } }
    ];
  }

  return where;
}

export const workerRepository = {
  async findByUserId(userId: string): Promise<WorkerWithDetails | null> {
    return prisma.worker.findFirst({
      where: { userId, deletedAt: null },
      include: detailInclude
    });
  },

  async findById(id: string): Promise<WorkerWithDetails | null> {
    return prisma.worker.findFirst({
      where: { id, deletedAt: null },
      include: detailInclude
    });
  },

  async findPublicById(id: string): Promise<WorkerWithDetails | null> {
    return prisma.worker.findFirst({
      where: { id, deletedAt: null, status: "APPROVED" },
      include: detailInclude
    });
  },

  async findMany(
    filters: WorkerFilters,
    skip: number,
    take: number,
    sort: SortOption
  ): Promise<WorkerListRow[]> {
    return prisma.worker.findMany({
      where: buildWhere(filters),
      include: listInclude,
      orderBy: { [sort.field]: sort.order },
      skip,
      take: Math.min(take, PAGINATION.MAX_LIMIT)
    });
  },

  async count(filters: WorkerFilters): Promise<number> {
    return prisma.worker.count({ where: buildWhere(filters) });
  },

  async findManyForAdmin(
    filters: WorkerFilters,
    skip: number,
    take: number
  ): Promise<WorkerListRow[]> {
    const where: Prisma.WorkerWhereInput = { deletedAt: null };
    if (filters.status) where.status = filters.status;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.regionId) where.regionId = filters.regionId;
    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { phone: { contains: filters.search, mode: "insensitive" } }
      ];
    }

    return prisma.worker.findMany({
      where,
      include: listInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: Math.min(take, PAGINATION.MAX_LIMIT)
    });
  },

  async countForAdmin(filters: WorkerFilters): Promise<number> {
    const where: Prisma.WorkerWhereInput = { deletedAt: null };
    if (filters.status) where.status = filters.status;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.regionId) where.regionId = filters.regionId;
    return prisma.worker.count({ where });
  },

  async findByPhone(phone: string): Promise<Worker | null> {
    return prisma.worker.findUnique({ where: { phone } });
  },

  /**
   * Worker'ni portfolio rasmlari bilan birga bitta tranzaksiyada yaratadi.
   * Rasmlar avvaldan Cloudinary'ga yuklangan bo'lishi kerak (service qatlamida bajariladi).
   */
  async createWithPortfolio(
    workerData: Prisma.WorkerUncheckedCreateInput,
    images: { imageUrl: string; publicId: string; width: number; height: number; size: number }[]
  ): Promise<WorkerWithDetails> {
    return prisma.$transaction(async (tx) => {
      const worker = await tx.worker.create({ data: workerData });

      await tx.portfolioImage.createMany({
        data: images.map((image) => ({ ...image, workerId: worker.id }))
      });

      const result = await tx.worker.findUniqueOrThrow({
        where: { id: worker.id },
        include: detailInclude
      });

      return result;
    });
  },

  async update(id: string, data: Prisma.WorkerUncheckedUpdateInput): Promise<Worker> {
    return prisma.worker.update({ where: { id }, data });
  },

  async updateStatus(
    id: string,
    data: {
      status: WorkerStatus;
      isVerified?: boolean;
      approvedBy?: string | null;
      approvedAt?: Date | null;
      rejectionReason?: string | null;
    }
  ): Promise<Worker> {
    return prisma.worker.update({ where: { id }, data });
  },

  async softDelete(id: string): Promise<Worker> {
    return prisma.worker.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  async incrementViews(id: string): Promise<void> {
    await prisma.worker.update({ where: { id }, data: { views: { increment: 1 } } });
  },

  // ---------- Portfolio Images ----------

  async countPortfolioImages(workerId: string): Promise<number> {
    return prisma.portfolioImage.count({ where: { workerId } });
  },

  async addPortfolioImages(
    workerId: string,
    images: { imageUrl: string; publicId: string; width: number; height: number; size: number }[]
  ): Promise<void> {
    await prisma.portfolioImage.createMany({
      data: images.map((image) => ({ ...image, workerId }))
    });
  },

  async findPortfolioImage(imageId: string, workerId: string) {
    return prisma.portfolioImage.findFirst({ where: { id: imageId, workerId } });
  },

  async deletePortfolioImage(imageId: string): Promise<void> {
    await prisma.portfolioImage.delete({ where: { id: imageId } });
  }
};
