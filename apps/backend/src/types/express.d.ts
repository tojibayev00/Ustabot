import type { Role } from "@/constants/roles.js";

export interface AuthenticatedUser {
  id: string;
  telegramId: string;
  role: Role;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
      user?: AuthenticatedUser;
    }
  }
}

export {};
