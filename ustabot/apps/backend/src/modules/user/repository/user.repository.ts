import type { User, Prisma } from "@prisma/client";
import { prisma } from "@/config/database.js";

export const userRepository = {
  async findByIdWithWorker(id: string): Promise<(User & { worker: { id: string } | null }) | null> {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { worker: { select: { id: true } } }
    });
  },

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { username, deletedAt: null } });
  },

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },

  async softDelete(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
};
