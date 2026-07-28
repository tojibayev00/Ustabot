export interface DashboardCounts {
  totalUsers: number;
  totalWorkers: number;
  pendingWorkers: number;
  approvedWorkers: number;
  rejectedWorkers: number;
  blockedWorkers: number;
  totalCategories: number;
  pendingReports: number;
  totalBroadcasts: number;
  todayRegistrations: number;
  todayApprovals: number;
  todayRejections: number;
}

export interface PopularWorkerItem {
  id: string;
  firstName: string;
  lastName: string;
  views: number;
  categoryName: string;
}

export interface PopularCategoryItem {
  id: string;
  name: string;
  workerCount: number;
}

export interface TopRegionItem {
  id: string;
  name: string;
  workerCount: number;
}

export interface DashboardResponse {
  counts: DashboardCounts;
  popularWorkers: PopularWorkerItem[];
  popularCategories: PopularCategoryItem[];
  topRegions: TopRegionItem[];
}
