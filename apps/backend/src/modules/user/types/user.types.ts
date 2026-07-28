import type { Role } from "@/constants/roles.js";

export interface UserProfileResponse {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  languageCode: string | null;
  photoUrl: string | null;
  role: Role;
  notificationsEnabled: boolean;
  isWorker: boolean;
  createdAt: Date;
  lastSeenAt: Date;
}
