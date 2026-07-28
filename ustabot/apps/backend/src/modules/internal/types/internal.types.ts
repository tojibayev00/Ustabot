import type { Role } from "@/constants/roles.js";

export interface InternalUserInfo {
  id: string;
  telegramId: string;
  role: Role;
  isBlocked: boolean;
  isWorker: boolean;
  workerStatus: string | null;
}
