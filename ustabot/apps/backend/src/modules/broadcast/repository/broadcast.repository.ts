import type { BroadcastHistory, Prisma } from "@prisma/client";
import { prisma } from "@/config/database.js";

export const broadcastRepository = {
  async create(data: Prisma.BroadcastHistoryUncheckedCreateInput): Promise<BroadcastHistory> {
    return prisma.broadcastHistory.create({ data });
  },

  async findById(id: string): Promise<BroadcastHistory | null> {
    return prisma.broadcastHistory.findUnique({ where: { id } });
  },

  async findMany(skip: number, take: number): Promise<BroadcastHistory[]> {
    return prisma.broadcastHistory.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take
    });
  },

  async count(): Promise<number> {
    return prisma.broadcastHistory.count();
  },

  async countActiveUsers(): Promise<number> {
    return prisma.user.count({ where: { isBlocked: false, deletedAt: null } });
  }
};
