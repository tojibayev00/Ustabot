import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: Record<string, unknown>;
  message: string;
}

interface ApiErrorResponse {
  success: false;
  error: { message: string; status: number; code: string };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; internal?: boolean; query?: Record<string, string> } = {}
): Promise<T> {
  const { method = "GET", body, internal = true, query } = options;

  const url = new URL(`${env.BACKEND_API_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (internal) {
    headers["x-internal-api-key"] = env.INTERNAL_API_KEY;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  if (!json.success) {
    logger.warn({ path, status: json.error.status, code: json.error.code }, "Backend API xatoligi");
    throw new ApiError(json.error.message, json.error.status, json.error.code);
  }

  return json.data;
}

export interface InternalUserInfo {
  id: string;
  telegramId: string;
  role: "USER" | "WORKER" | "MODERATOR" | "ADMIN" | "SUPER_ADMIN";
  isBlocked: boolean;
  isWorker: boolean;
  workerStatus: string | null;
}

export interface PendingWorkerItem {
  id: string;
  firstName: string;
  lastName: string;
  categoryName: string;
  regionName: string;
  districtName: string;
  phone: string;
  userId: string;
}

export interface DashboardSummary {
  counts: {
    totalUsers: number;
    totalWorkers: number;
    pendingWorkers: number;
    approvedWorkers: number;
    blockedWorkers: number;
    pendingReports: number;
    todayRegistrations: number;
  };
}

/**
 * Bot backend bilan FAQAT shu API orqali gaplashadi (Part 6: "Bot must never access PostgreSQL directly").
 */
export const apiService = {
  async syncUser(input: {
    telegramId: string;
    firstName: string;
    lastName?: string;
    username?: string;
    languageCode?: string;
    photoUrl?: string;
  }): Promise<InternalUserInfo> {
    return request<InternalUserInfo>("/internal/users/sync", { method: "POST", body: input });
  },

  async getUser(telegramId: string): Promise<InternalUserInfo> {
    return request<InternalUserInfo>(`/internal/users/${telegramId}`);
  },

  async listPendingWorkers(): Promise<PendingWorkerItem[]> {
    return request<PendingWorkerItem[]>("/internal/workers/pending");
  },

  async approveWorker(telegramId: string, workerId: string): Promise<void> {
    await request(`/internal/workers/${workerId}/approve`, { method: "POST", body: { telegramId } });
  },

  async rejectWorker(telegramId: string, workerId: string, reason: string): Promise<void> {
    await request(`/internal/workers/${workerId}/reject`, {
      method: "POST",
      body: { telegramId, reason }
    });
  },

  async getDashboardSummary(telegramId: string): Promise<DashboardSummary> {
    return request<DashboardSummary>("/internal/dashboard-summary", { query: { telegramId } });
  },

  async getPendingReportsCount(telegramId: string): Promise<number> {
    const result = await request<{ count: number }>("/internal/reports/pending-count", {
      query: { telegramId }
    });
    return result.count;
  },

  async getSettings(): Promise<{ supportUsername: string | null; telegramChannel: string | null }> {
    return request("/settings", { internal: false });
  }
};
