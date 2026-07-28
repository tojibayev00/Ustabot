import "express";
import type { Role } from "@/constants/roles.js";

export interface AuthenticatedUser {
  id: string;
  telegramId: string;
  role: Role;
}

declare module "express-serve-static-core" {
  interface Request {
    requestId: string;
    startTime: number;
    user?: AuthenticatedUser;
  }
}
