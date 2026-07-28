import type { Prisma, ReportStatus } from "@prisma/client";
import { prisma } from "@/config/database.js";

const reportInclude = {
  worker: { select: { id: true, firstName: true, lastName: true } },
  reporter: { select: { id: true, firstName: true, telegramId: true } },
  reviewer: { select: { id: true, firstName: true } }
} satisfies Prisma.ReportInclude;

export type ReportWithRelations = Prisma.ReportGetPayload<{ include: typeof reportInclude }>;

export interface ReportFilters {
  status?: ReportStatus;
  workerId?: string;
  reporterId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

function buildWhere(filters: ReportFilters): Prisma.ReportWhereInput {
  const where: Prisma.ReportWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.workerId) where.workerId = filters.workerId;
  if (filters.reporterId) where.reporterId = filters.reporterId;
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {
      ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
      ...(filters.dateTo ? { lte: filters.dateTo } : {})
    };
  }
  return where;
}

export const reportRepository = {
  async create(data: Prisma.ReportUncheckedCreateInput): Promise<ReportWithRelations> {
    return prisma.report.create({ data, include: reportInclude });
  },

  async findById(id: string): Promise<ReportWithRelations | null> {
    return prisma.report.findUnique({ where: { id }, include: reportInclude });
  },

  async findMany(filters: ReportFilters, skip: number, take: number): Promise<ReportWithRelations[]> {
    return prisma.report.findMany({
      where: buildWhere(filters),
      include: reportInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take
    });
  },

  async count(filters: ReportFilters): Promise<number> {
    return prisma.report.count({ where: buildWhere(filters) });
  },

  async updateStatus(
    id: string,
    status: ReportStatus,
    reviewedBy: string
  ): Promise<ReportWithRelations> {
    return prisma.report.update({
      where: { id },
      data: { status, reviewedBy, reviewedAt: new Date() },
      include: reportInclude
    });
  },

  async countRecentByReporter(reporterId: string, since: Date): Promise<number> {
    return prisma.report.count({ where: { reporterId, createdAt: { gte: since } } });
  }
};
