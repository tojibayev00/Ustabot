import { prisma } from "@/config/database.js";
import { startOfDay, endOfDay, now } from "@/shared/date.helper.js";
import type {
  DashboardCounts,
  PopularWorkerItem,
  PopularCategoryItem,
  TopRegionItem
} from "@/modules/analytics/types/analytics.types.js";

export const analyticsRepository = {
  async getCounts(): Promise<DashboardCounts> {
    const today = now();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const [
      totalUsers,
      totalWorkers,
      pendingWorkers,
      approvedWorkers,
      rejectedWorkers,
      blockedWorkers,
      totalCategories,
      pendingReports,
      totalBroadcasts,
      todayRegistrations,
      todayApprovals,
      todayRejections
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.worker.count({ where: { deletedAt: null } }),
      prisma.worker.count({ where: { deletedAt: null, status: "PENDING" } }),
      prisma.worker.count({ where: { deletedAt: null, status: "APPROVED" } }),
      prisma.worker.count({ where: { deletedAt: null, status: "REJECTED" } }),
      prisma.worker.count({ where: { deletedAt: null, status: "BLOCKED" } }),
      prisma.category.count({ where: { deletedAt: null } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.broadcastHistory.count(),
      prisma.user.count({ where: { createdAt: { gte: todayStart, lte: todayEnd } } }),
      prisma.worker.count({ where: { approvedAt: { gte: todayStart, lte: todayEnd } } }),
      prisma.worker.count({
        where: { status: "REJECTED", updatedAt: { gte: todayStart, lte: todayEnd } }
      })
    ]);

    return {
      totalUsers,
      totalWorkers,
      pendingWorkers,
      approvedWorkers,
      rejectedWorkers,
      blockedWorkers,
      totalCategories,
      pendingReports,
      totalBroadcasts,
      todayRegistrations,
      todayApprovals,
      todayRejections
    };
  },

  async getPopularWorkers(limit: number): Promise<PopularWorkerItem[]> {
    const workers = await prisma.worker.findMany({
      where: { deletedAt: null, status: "APPROVED" },
      orderBy: { views: "desc" },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        views: true,
        category: { select: { name: true } }
      }
    });

    return workers.map((worker) => ({
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      views: worker.views,
      categoryName: worker.category.name
    }));
  },

  async getPopularCategories(limit: number): Promise<PopularCategoryItem[]> {
    const grouped = await prisma.worker.groupBy({
      by: ["categoryId"],
      where: { deletedAt: null, status: "APPROVED" },
      _count: { _all: true },
      orderBy: { _count: { categoryId: "desc" } },
      take: limit
    });

    const categories = await prisma.category.findMany({
      where: { id: { in: grouped.map((g) => g.categoryId) } },
      select: { id: true, name: true }
    });
    const nameMap = new Map(categories.map((c) => [c.id, c.name]));

    return grouped.map((g) => ({
      id: g.categoryId,
      name: nameMap.get(g.categoryId) ?? "—",
      workerCount: g._count._all
    }));
  },

  async getTopRegions(limit: number): Promise<TopRegionItem[]> {
    const grouped = await prisma.worker.groupBy({
      by: ["regionId"],
      where: { deletedAt: null, status: "APPROVED" },
      _count: { _all: true },
      orderBy: { _count: { regionId: "desc" } },
      take: limit
    });

    const regions = await prisma.region.findMany({
      where: { id: { in: grouped.map((g) => g.regionId) } },
      select: { id: true, name: true }
    });
    const nameMap = new Map(regions.map((r) => [r.id, r.name]));

    return grouped.map((g) => ({
      id: g.regionId,
      name: nameMap.get(g.regionId) ?? "—",
      workerCount: g._count._all
    }));
  }
};
