import { ROLES, type Role } from "@/constants/roles.js";

/**
 * Har bir permission "resource:action" ko'rinishida.
 * Middleware shu ro'yxat asosida ruxsatni tekshiradi.
 */
export const PERMISSIONS = {
  WORKER_APPROVE: "worker:approve",
  WORKER_REJECT: "worker:reject",
  WORKER_BLOCK: "worker:block",
  WORKER_ACTIVATE: "worker:activate",
  WORKER_DELETE: "worker:delete",
  WORKER_VIEW_ALL: "worker:view_all",

  REPORT_VIEW: "report:view",
  REPORT_UPDATE: "report:update",
  REPORT_DELETE: "report:delete",

  CATEGORY_MANAGE: "category:manage",
  REGION_MANAGE: "region:manage",

  USER_VIEW_ALL: "user:view_all",
  USER_BLOCK: "user:block",
  USER_DELETE: "user:delete",

  ADMIN_MANAGE: "admin:manage",
  SETTINGS_MANAGE: "settings:manage",
  BROADCAST_SEND: "broadcast:send",
  ANALYTICS_VIEW: "analytics:view"
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Har bir rolga biriktirilgan ruxsatlar ro'yxati */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.USER]: [],
  [ROLES.WORKER]: [],
  [ROLES.MODERATOR]: [
    PERMISSIONS.WORKER_APPROVE,
    PERMISSIONS.WORKER_REJECT,
    PERMISSIONS.WORKER_BLOCK,
    PERMISSIONS.WORKER_ACTIVATE,
    PERMISSIONS.WORKER_VIEW_ALL,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_UPDATE
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.WORKER_APPROVE,
    PERMISSIONS.WORKER_REJECT,
    PERMISSIONS.WORKER_BLOCK,
    PERMISSIONS.WORKER_ACTIVATE,
    PERMISSIONS.WORKER_DELETE,
    PERMISSIONS.WORKER_VIEW_ALL,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_UPDATE,
    PERMISSIONS.REPORT_DELETE,
    PERMISSIONS.CATEGORY_MANAGE,
    PERMISSIONS.REGION_MANAGE,
    PERMISSIONS.USER_VIEW_ALL,
    PERMISSIONS.USER_BLOCK,
    PERMISSIONS.BROADCAST_SEND,
    PERMISSIONS.ANALYTICS_VIEW
  ],
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS)
};

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
