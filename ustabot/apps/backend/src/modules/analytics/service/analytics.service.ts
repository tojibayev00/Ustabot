import { analyticsRepository } from "@/modules/analytics/repository/analytics.repository.js";
import type { DashboardResponse } from "@/modules/analytics/types/analytics.types.js";
import { getOrSetCache, CACHE_TTL } from "@/shared/cache.js";

const DASHBOARD_CACHE_KEY = "analytics:dashboard";
const TOP_LIST_LIMIT = 5;

export const analyticsService = {
  /** Dashboard 2 daqiqalik cache bilan — Part 4/7: "Dashboard < 2 seconds" */
  async getDashboard(): Promise<DashboardResponse> {
    return getOrSetCache(DASHBOARD_CACHE_KEY, CACHE_TTL.DASHBOARD, async () => {
      const [counts, popularWorkers, popularCategories, topRegions] = await Promise.all([
        analyticsRepository.getCounts(),
        analyticsRepository.getPopularWorkers(TOP_LIST_LIMIT),
        analyticsRepository.getPopularCategories(TOP_LIST_LIMIT),
        analyticsRepository.getTopRegions(TOP_LIST_LIMIT)
      ]);

      return { counts, popularWorkers, popularCategories, topRegions };
    });
  }
};
