/**
 * Tizimdagi barcha rollar. Qiymatlar Prisma'dagi UserRole enum bilan bir xil bo'lishi shart.
 */
export const ROLES = {
  USER: "USER",
  WORKER: "WORKER",
  MODERATOR: "MODERATOR",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN"
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Rollar ierarxiyasi — kattaroq raqam ko'proq huquqni bildiradi */
export const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 0,
  WORKER: 1,
  MODERATOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4
};

export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
}

export const ADMIN_ROLES: Role[] = [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN];
