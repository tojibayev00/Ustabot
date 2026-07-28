import { http } from "@/services/http.js";
import type { AuthUser } from "@/store/auth.store.js";

// ---------- Auth ----------

export interface TelegramAuthResponse {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string; expiresIn: number };
}

export const authApi = {
  telegramAuth: (initData: string) =>
    http.post<TelegramAuthResponse>("/auth/telegram", { initData }, { skipAuth: true }),
  me: () => http.get<AuthUser>("/auth/me"),
  logout: (refreshToken: string) => http.post("/auth/logout", { refreshToken })
};

// ---------- Categories ----------

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  isVisible: boolean;
  workerCount?: number;
}

export const categoryApi = {
  list: () => http.get<CategoryDto[]>("/categories")
};

// ---------- Regions ----------

export interface RegionDto {
  id: string;
  name: string;
  code: string;
  districtCount?: number;
}

export interface DistrictDto {
  id: string;
  regionId: string;
  name: string;
  villageCount?: number;
}

export interface VillageDto {
  id: string;
  districtId: string;
  name: string;
}

export const regionApi = {
  list: () => http.get<RegionDto[]>("/regions"),
  districts: (regionId: string) => http.get<DistrictDto[]>(`/regions/${regionId}/districts`),
  villages: (districtId: string) => http.get<VillageDto[]>(`/districts/${districtId}/villages`)
};

// ---------- Workers ----------

export interface WorkerListItem {
  id: string;
  firstName: string;
  lastName: string;
  categoryName: string;
  categorySlug: string;
  regionName: string;
  districtName: string;
  experienceYears: number;
  isVerified: boolean;
  views: number;
  coverImageUrl: string | null;
  createdAt: string;
}

export interface WorkerDetail {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  telegramUsername: string | null;
  description: string;
  experienceYears: number;
  address: string;
  latitude: number;
  longitude: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  status: string;
  isVerified: boolean;
  views: number;
  category: { id: string; name: string; slug: string; icon: string | null };
  region: { id: string; name: string };
  district: { id: string; name: string };
  village: { id: string; name: string } | null;
  portfolioImages: { id: string; imageUrl: string; width: number; height: number }[];
  rejectionReason: string | null;
  createdAt: string;
}

export interface WorkerStatusDto {
  status: string;
  isVerified: boolean;
  rejectionReason: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

export interface ListWorkersQuery {
  page?: number;
  limit?: number;
  category?: string;
  region?: string;
  district?: string;
  village?: string;
  experience?: number;
  search?: string;
  sort?: string;
  verified?: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

async function listWorkersRequest(
  path: string,
  query: ListWorkersQuery
): Promise<PaginatedResult<WorkerListItem>> {
  const { data, meta } = await http.getWithMeta<WorkerListItem[]>(
    path,
    query as Record<string, string | number | boolean | undefined>
  );
  return { items: data, meta: meta as unknown as PaginationMeta };
}

export const workerApi = {
  list: (query: ListWorkersQuery) => listWorkersRequest("/workers", query),
  search: (query: ListWorkersQuery) => listWorkersRequest("/search/workers", query),
  getById: (id: string) => http.get<WorkerDetail>(`/workers/${id}`),
  register: (formData: FormData) =>
    http.post<WorkerDetail>("/workers/register", formData, { isFormData: true }),
  getMe: () => http.get<WorkerDetail>("/workers/me"),
  getMyStatus: () => http.get<WorkerStatusDto>("/workers/me/status"),
  updateMe: (data: Partial<WorkerDetail>) => http.patch<WorkerDetail>("/workers/me", data),
  deleteMe: () => http.del("/workers/me"),
  addGalleryImages: (formData: FormData) =>
    http.post<WorkerDetail>("/workers/me/gallery", formData, { isFormData: true }),
  removeGalleryImage: (imageId: string) => http.del(`/workers/me/gallery/${imageId}`)
};

// ---------- User ----------

export const userApi = {
  me: () => http.get<AuthUser & { notificationsEnabled: boolean; createdAt: string }>("/users/me"),
  updateMe: (data: {
    username?: string;
    languageCode?: string;
    photoUrl?: string;
    notificationsEnabled?: boolean;
  }) => http.patch("/users/me", data),
  deleteMe: () => http.del("/users/me")
};

// ---------- Notifications ----------

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  list: (unreadOnly?: boolean) =>
    http.getWithMeta<NotificationDto[]>(
      "/notifications",
      unreadOnly ? { unreadOnly: "true" } : undefined
    ),
  markAsRead: (id: string) => http.patch(`/notifications/read/${id}`),
  markAllAsRead: () => http.patch("/notifications/read-all")
};

// ---------- Reports ----------

export const reportApi = {
  create: (data: { workerId: string; reason: string; description?: string }) =>
    http.post("/reports", data)
};

// ---------- Favorites (feature-flagged) ----------

export const favoriteApi = {
  add: (workerId: string) => http.post(`/favorites/${workerId}`),
  remove: (workerId: string) => http.del(`/favorites/${workerId}`),
  list: () => http.get<WorkerListItem[]>("/favorites")
};

// ---------- Settings ----------

export interface SettingsDto {
  telegramChannel: string | null;
  supportUsername: string | null;
  maintenanceMode: boolean;
  appVersion: string;
  privacyPolicy: string | null;
  termsOfService: string | null;
}

export const settingsApi = {
  get: () => http.get<SettingsDto>("/settings")
};

// ---------- Upload ----------

export const uploadApi = {
  image: (formData: FormData) =>
    http.post<{ url: string; publicId: string }>("/upload/image", formData, { isFormData: true })
};

// ---------- Admin: Dashboard ----------

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

export interface DashboardResponse {
  counts: DashboardCounts;
  popularWorkers: { id: string; firstName: string; lastName: string; views: number; categoryName: string }[];
  popularCategories: { id: string; name: string; workerCount: number }[];
  topRegions: { id: string; name: string; workerCount: number }[];
}

export const adminDashboardApi = {
  get: () => http.get<DashboardResponse>("/admin/dashboard")
};

// ---------- Admin: Workers ----------

export interface AdminWorkerListItem extends WorkerListItem {
  status: string;
  phone: string;
  userId: string;
}

export interface AdminListWorkersQuery extends ListWorkersQuery {
  status?: "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";
}

export const adminWorkerApi = {
  list: async (query: AdminListWorkersQuery) => {
    const { data, meta } = await http.getWithMeta<AdminWorkerListItem[]>(
      "/admin/workers",
      query as Record<string, string | number | boolean | undefined>
    );
    return { items: data, meta: meta as unknown as PaginationMeta };
  },
  approve: (id: string) => http.patch(`/admin/workers/${id}/approve`),
  reject: (id: string, reason: string) => http.patch(`/admin/workers/${id}/reject`, { reason }),
  block: (id: string) => http.patch(`/admin/workers/${id}/block`),
  activate: (id: string) => http.patch(`/admin/workers/${id}/activate`),
  remove: (id: string) => http.del(`/admin/workers/${id}`)
};

// ---------- Admin: Reports ----------

export interface AdminReportItem {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  worker: { id: string; firstName: string; lastName: string };
  reporter: { id: string; firstName: string; telegramId: string };
  reviewer: { id: string; firstName: string } | null;
  createdAt: string;
}

export const adminReportApi = {
  list: async (query: { page?: number; limit?: number; status?: string }) => {
    const { data, meta } = await http.getWithMeta<AdminReportItem[]>(
      "/reports",
      query as Record<string, string | number | undefined>
    );
    return { items: data, meta: meta as unknown as PaginationMeta };
  },
  updateStatus: (id: string, status: "REVIEWING" | "RESOLVED" | "REJECTED") =>
    http.patch(`/reports/${id}`, { status })
};

// ---------- Admin: Users ----------

export interface AdminUserItem {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  role: string;
  isBlocked: boolean;
  isWorker: boolean;
  createdAt: string;
  lastSeenAt: string;
}

export const adminUserApi = {
  list: async (query: { page?: number; limit?: number; search?: string; role?: string }) => {
    const { data, meta } = await http.getWithMeta<AdminUserItem[]>(
      "/admin/users",
      query as Record<string, string | number | undefined>
    );
    return { items: data, meta: meta as unknown as PaginationMeta };
  },
  block: (id: string) => http.patch(`/admin/users/${id}/block`),
  unblock: (id: string) => http.patch(`/admin/users/${id}/unblock`)
};

// ---------- Admin: Categories ----------

export const adminCategoryApi = {
  create: (data: { name: string; icon?: string; sortOrder?: number; isVisible?: boolean }) =>
    http.post<CategoryDto>("/categories", data),
  update: (id: string, data: Partial<{ name: string; icon: string; sortOrder: number; isVisible: boolean }>) =>
    http.patch<CategoryDto>(`/categories/${id}`, data),
  remove: (id: string) => http.del(`/categories/${id}`)
};

// ---------- Admin: Broadcast ----------

export interface BroadcastItem {
  id: string;
  title: string;
  message: string;
  image: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  successCount: number;
  failedCount: number;
  status: "QUEUED" | "IN_PROGRESS" | "FINISHED";
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}

export const adminBroadcastApi = {
  create: (data: { title: string; message: string; image?: string; buttonText?: string; buttonUrl?: string }) =>
    http.post<BroadcastItem>("/admin/broadcast", data),
  history: async (query: { page?: number; limit?: number }) => {
    const { data, meta } = await http.getWithMeta<BroadcastItem[]>(
      "/admin/broadcast/history",
      query as Record<string, string | number | undefined>
    );
    return { items: data, meta: meta as unknown as PaginationMeta & { totalActiveUsers: number } };
  },
  getById: (id: string) => http.get<BroadcastItem>(`/admin/broadcast/${id}`)
};
