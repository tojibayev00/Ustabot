import type { Role } from "@/constants/roles.js";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // access token muddati (soniya)
}

export interface AuthenticatedUserInfo {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  photoUrl: string | null;
  languageCode: string | null;
  role: Role;
  isWorker: boolean;
}

export interface TelegramAuthResult {
  user: AuthenticatedUserInfo;
  tokens: AuthTokens;
}
