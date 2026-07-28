import type { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/config/database.js";

export interface AdminUserFilters {
  search?: string;
  role?: UserRole;
  isBlocked?: boolean;
}

function buildWhere(filters: AdminUserFilters): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = { deletedAt: null };
  if (filters.role) where.role = filters.role;
  if (filters.isBlocked !== undefined) where.isBlocked = filters.isBlocked;
  if (filters.search) {
    where.OR = [
      { firstName: { contains: filters.search, mode: "insensitive" } },
      { username: { contains: filters.search, mode: "insensitive" } },
      { telegramId: { contains: filters.search } }
    ];
  }
  return where;
}

export const adminRepository = {
  async findUsers(filters: AdminUserFilters, skip: number, take: number) {
    return prisma.user.findMany({
      where: buildWhere(filters),
      include: { worker: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take
    });
  },

  async countUsers(filters: AdminUserFilters): Promise<number> {
    return prisma.user.count({ where: buildWhere(filters) });
  },

  async findUserById(id: string) {
    return prisma.user.findFirst({ where: { id, deletedAt: null } });
  },

  async setBlocked(id: string, isBlocked: boolean) {
    return prisma.user.update({ where: { id }, data: { isBlocked } });
  },

  async setRole(id: string, role: UserRole) {
    return prisma.user.update({ where: { id }, data: { role } });
  }
};
