import type { NextFunction, Request, Response } from "express";
import { hasMinimumRole, type Role } from "@/constants/roles.js";
import { roleHasPermission, type Permission } from "@/constants/permissions.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";

/**
 * Foydalanuvchi kamida berilgan roldagi (yoki undan yuqori) ekanligini tekshiradi.
 * `authenticate` middleware'idan keyin ulanishi shart.
 */
export function requireRole(minimumRole: Role) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    if (!hasMinimumRole(req.user.role, minimumRole)) {
      next(new ForbiddenError());
      return;
    }

    next();
  };
}

/**
 * Foydalanuvchining aniq permission'ga ega ekanligini tekshiradi.
 * requireRole'dan farqli o'laroq, ierarxiyaga emas, aniq ruxsat ro'yxatiga tayanadi.
 */
export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    if (!roleHasPermission(req.user.role, permission)) {
      next(new ForbiddenError());
      return;
    }

    next();
  };
}

/** Faqat MODERATOR, ADMIN yoki SUPER_ADMIN kirishi mumkin bo'lgan admin panel route'lari uchun */
export const requireAdminAccess = requireRole("MODERATOR");

/** Faqat resurs egasi yoki admin (yuqori rol) amalni bajara olishini tekshiradi */
export function requireOwnershipOrRole(getOwnerId: (req: Request) => string, minimumRole: Role) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }

    const isOwner = req.user.id === getOwnerId(req);
    const isPrivileged = hasMinimumRole(req.user.role, minimumRole);

    if (!isOwner && !isPrivileged) {
      next(new ForbiddenError());
      return;
    }

    next();
  };
}
