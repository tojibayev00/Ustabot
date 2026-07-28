import type { Settings, Prisma } from "@prisma/client";
import { prisma } from "@/config/database.js";

export const settingsRepository = {
  /** Settings jadvalida faqat bitta qator bo'ladi (Part 3: "Only one row exists") */
  async getOrCreate(): Promise<Settings> {
    const existing = await prisma.settings.findFirst();
    if (existing) return existing;

    return prisma.settings.create({
      data: { maintenanceMode: false, appVersion: "1.0.0", minSupportedVersion: "1.0.0" }
    });
  },

  async update(id: string, data: Prisma.SettingsUpdateInput): Promise<Settings> {
    return prisma.settings.update({ where: { id }, data });
  }
};
