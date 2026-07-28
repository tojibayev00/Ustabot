import type { Region, District, Village, Prisma } from "@prisma/client";
import { prisma } from "@/config/database.js";

export const regionRepository = {
  async findAllRegions(): Promise<Region[]> {
    return prisma.region.findMany({ orderBy: { name: "asc" } });
  },

  async findRegionById(id: string): Promise<Region | null> {
    return prisma.region.findUnique({ where: { id } });
  },

  async findRegionByCode(code: string): Promise<Region | null> {
    return prisma.region.findUnique({ where: { code } });
  },

  async createRegion(data: Prisma.RegionCreateInput): Promise<Region> {
    return prisma.region.create({ data });
  },

  async updateRegion(id: string, data: Prisma.RegionUpdateInput): Promise<Region> {
    return prisma.region.update({ where: { id }, data });
  },

  async deleteRegion(id: string): Promise<void> {
    await prisma.region.delete({ where: { id } });
  },

  async countDistricts(regionId: string): Promise<number> {
    return prisma.district.count({ where: { regionId } });
  },

  async countDistrictsPerRegion(): Promise<Map<string, number>> {
    const grouped = await prisma.district.groupBy({
      by: ["regionId"],
      _count: { _all: true }
    });
    return new Map(grouped.map((g) => [g.regionId, g._count._all]));
  },

  // ---------- District ----------

  async findDistrictsByRegion(regionId: string): Promise<District[]> {
    return prisma.district.findMany({ where: { regionId }, orderBy: { name: "asc" } });
  },

  async findDistrictById(id: string): Promise<District | null> {
    return prisma.district.findUnique({ where: { id } });
  },

  async createDistrict(data: Prisma.DistrictCreateInput): Promise<District> {
    return prisma.district.create({ data });
  },

  async updateDistrict(id: string, data: Prisma.DistrictUpdateInput): Promise<District> {
    return prisma.district.update({ where: { id }, data });
  },

  async deleteDistrict(id: string): Promise<void> {
    await prisma.district.delete({ where: { id } });
  },

  async countVillages(districtId: string): Promise<number> {
    return prisma.village.count({ where: { districtId } });
  },

  async countVillagesPerDistrict(): Promise<Map<string, number>> {
    const grouped = await prisma.village.groupBy({
      by: ["districtId"],
      _count: { _all: true }
    });
    return new Map(grouped.map((g) => [g.districtId, g._count._all]));
  },

  // ---------- Village ----------

  async findVillagesByDistrict(districtId: string): Promise<Village[]> {
    return prisma.village.findMany({ where: { districtId }, orderBy: { name: "asc" } });
  },

  async findVillageById(id: string): Promise<Village | null> {
    return prisma.village.findUnique({ where: { id } });
  },

  async createVillage(data: Prisma.VillageCreateInput): Promise<Village> {
    return prisma.village.create({ data });
  },

  async updateVillage(id: string, data: Prisma.VillageUpdateInput): Promise<Village> {
    return prisma.village.update({ where: { id }, data });
  },

  async deleteVillage(id: string): Promise<void> {
    await prisma.village.delete({ where: { id } });
  }
};
