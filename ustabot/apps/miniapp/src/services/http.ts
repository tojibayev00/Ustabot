import { useAuthStore } from "@/store/auth.store.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: Record<string, unknown>;
  message: string;
}

export interface ApiErrorBody {
  success: false;
  error: {
    message: string;
    status: number;
    code: string;
    details?: { field?: string; message: string }[];
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: { field?: string; message: string }[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  isFormData?: boolean;
  skipAuth?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const { refreshToken, setSession, user, clearSession } = useAuthStore.getState();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    const json = (await response.json()) as
      | ApiSuccessResponse<{ accessToken: string; refreshToken: string }>
      | ApiErrorBody;

    if (!json.success) {
      clearSession();
      return false;
    }

    if (user) {
      setSession(json.data.accessToken, json.data.refreshToken, user);
    }
    return true;
  } catch {
    clearSession();
    return false;
  }
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function rawRequest<T>(path: string, options: RequestOptions, retrying = false): Promise<T> {
  const { method = "GET", body, query, isFormData, skipAuth } = options;
  const { accessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (accessToken && !skipAuth) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined
  });

  const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorBody;

  if (!json.success) {
    if (json.error.status === 401 && !skipAuth && !retrying) {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const refreshed = await refreshPromise;
      if (refreshed) {
        return rawRequest<T>(path, options, true);
      }
    }
    throw new ApiError(json.error.message, json.error.status, json.error.code, json.error.details);
  }

  return json.data;
}

export interface DataWithMeta<T> {
  data: T;
  meta: Record<string, unknown>;
}

async function rawRequestWithMeta<T>(
  path: string,
  options: RequestOptions,
  retrying = false
): Promise<DataWithMeta<T>> {
  const { method = "GET", body, query, isFormData, skipAuth } = options;
  const { accessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (accessToken && !skipAuth) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined
  });

  const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorBody;

  if (!json.success) {
    if (json.error.status === 401 && !skipAuth && !retrying) {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const refreshed = await refreshPromise;
      if (refreshed) {
        return rawRequestWithMeta<T>(path, options, true);
      }
    }
    throw new ApiError(json.error.message, json.error.status, json.error.code, json.error.details);
  }

  return { data: json.data, meta: json.meta };
}

export const http = {
  get: <T>(path: string, query?: RequestOptions["query"]) => rawRequest<T>(path, { method: "GET", query }),
  getWithMeta: <T>(path: string, query?: RequestOptions["query"]) =>
    rawRequestWithMeta<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown, options?: Partial<RequestOptions>) =>
    rawRequest<T>(path, { method: "POST", body, ...options }),
  patch: <T>(path: string, body?: unknown, options?: Partial<RequestOptions>) =>
    rawRequest<T>(path, { method: "PATCH", body, ...options }),
  del: <T>(path: string) => rawRequest<T>(path, { method: "DELETE" })
};
