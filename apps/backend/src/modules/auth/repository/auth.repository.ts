import type { User } from "@prisma/client";
import { prisma } from "@/config/database.js";

export interface UpsertTelegramUserInput {
  telegramId: string;
  firstName: string;
  lastName?: string | null;
  username?: string | null;
  languageCode?: string | null;
  photoUrl?: string | null;
}

export const authRepository = {
  async findByTelegramId(telegramId: string): Promise<(User & { worker: { id: string } | null }) | null> {
    return prisma.user.findUnique({
      where: { telegramId },
      include: { worker: { select: { id: true } } }
    });
  },

  async findById(id: string): Promise<(User & { worker: { id: string } | null }) | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { worker: { select: { id: true } } }
    });
  },

  /**
   * Telegram orqali birinchi marta kirgan foydalanuvchi uchun yozuv yaratadi,
   * mavjud bo'lsa esa profil ma'lumotlarini (ism, username, rasm) yangilaydi
   * va lastSeenAt'ni yangilaydi. Bitta atomik `upsert` operatsiyasi.
   */
  async upsertFromTelegram(
    input: UpsertTelegramUserInput
  ): Promise<User & { worker: { id: string } | null }> {
    return prisma.user.upsert({
      where: { telegramId: input.telegramId },
      update: {
        firstName: input.firstName,
        lastName: input.lastName ?? null,
        username: input.username ?? null,
        languageCode: input.languageCode ?? undefined,
        photoUrl: input.photoUrl ?? null,
        lastSeenAt: new Date()
      },
      create: {
        telegramId: input.telegramId,
        firstName: input.firstName,
        lastName: input.lastName ?? null,
        username: input.username ?? null,
        languageCode: input.languageCode ?? "uz",
        photoUrl: input.photoUrl ?? null
      },
      include: { worker: { select: { id: true } } }
    });
  }
};
