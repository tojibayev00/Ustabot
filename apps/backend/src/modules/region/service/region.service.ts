import { regionRepository } from "@/modules/region/repository/region.repository.js";
import {
  toRegionResponse,
  toDistrictResponse,
  toVillageResponse
} from "@/modules/region/dto/region.dto.js";
import type {
  CreateRegionInput,
  UpdateRegionInput,
  CreateDistrictInput,
  UpdateDistrictInput,
  CreateVillageInput,
  UpdateVillageInput
} from "@/modules/region/validators/region.validators.js";
import type {
  RegionResponse,
  DistrictResponse,
  VillageResponse
} from "@/modules/region/types/region.types.js";
import { getOrSetCache, invalidateCache, CACHE_TTL } from "@/shared/cache.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { ConflictError } from "@/errors/ConflictError.js";

const CACHE_KEYS = {
  regions: "regions:list",
  districts: (regionId: string) => `districts:list:${regionId}`,
  villages: (districtId: string) => `villages:list:${districtId}`
};

export const regionService = {
  // ---------- Region ----------

  async listRegions(): Promise<RegionResponse[]> {
    return getOrSetCache(CACHE_KEYS.regions, CACHE_TTL.REGIONS, async () => {
      const [regions, counts] = await Promise.all([
        regionRepository.findAllRegions(),
        regionRepository.countDistrictsPerRegion()
      ]);
      return regions.map((region) => toRegionResponse(region, counts.get(region.id) ?? 0));
    });
  },

  async getRegionById(id: string): Promise<RegionResponse> {
    const region = await regionRepository.findRegionById(id);
    if (!region) throw new NotFoundError("Viloyat topilmadi");
    return toRegionResponse(region);
  },

  async createRegion(input: CreateRegionInput): Promise<RegionResponse> {
    const existing = await regionRepository.findRegionByCode(input.code);
    if (existing) {
      throw new ConflictError("Ushbu kod bilan viloyat allaqachon mavjud");
    }
    const region = await regionRepository.createRegion(input);
    await invalidateCache(CACHE_KEYS.regions);
    return toRegionResponse(region);
  },

  async updateRegion(id: string, input: UpdateRegionInput): Promise<RegionResponse> {
    const existing = await regionRepository.findRegionById(id);
    if (!existing) throw new NotFoundError("Viloyat topilmadi");

    const region = await regionRepository.updateRegion(id, input);
    await invalidateCache(CACHE_KEYS.regions);
    return toRegionResponse(region);
  },

  /** Tumanlar mavjud bo'lsa o'chirish rad etiladi (Part 3: CASCADE RULES) */
  async deleteRegion(id: string): Promise<void> {
    const existing = await regionRepository.findRegionById(id);
    if (!existing) throw new NotFoundError("Viloyat topilmadi");

    const districtCount = await regionRepository.countDistricts(id);
    if (districtCount > 0) {
      throw new ConflictError(
        `Ushbu viloyatda ${districtCount} ta tuman mavjud. Avval tumanlarni o'chiring`
      );
    }

    await regionRepository.deleteRegion(id);
    await invalidateCache(CACHE_KEYS.regions);
  },

  // ---------- District ----------

  async listDistrictsByRegion(regionId: string): Promise<DistrictResponse[]> {
    const region = await regionRepository.findRegionById(regionId);
    if (!region) throw new NotFoundError("Viloyat topilmadi");

    return getOrSetCache(CACHE_KEYS.districts(regionId), CACHE_TTL.DISTRICTS, async () => {
      const [districts, counts] = await Promise.all([
        regionRepository.findDistrictsByRegion(regionId),
        regionRepository.countVillagesPerDistrict()
      ]);
      return districts.map((district) =>
        toDistrictResponse(district, counts.get(district.id) ?? 0)
      );
    });
  },

  async createDistrict(input: CreateDistrictInput): Promise<DistrictResponse> {
    const region = await regionRepository.findRegionById(input.regionId);
    if (!region) throw new NotFoundError("Viloyat topilmadi");

    const district = await regionRepository.createDistrict({
      name: input.name,
      region: { connect: { id: input.regionId } }
    });

    await invalidateCache(CACHE_KEYS.districts(input.regionId));
    return toDistrictResponse(district);
  },

  async updateDistrict(id: string, input: UpdateDistrictInput): Promise<DistrictResponse> {
    const existing = await regionRepository.findDistrictById(id);
    if (!existing) throw new NotFoundError("Tuman topilmadi");

    const district = await regionRepository.updateDistrict(id, input);
    await invalidateCache(CACHE_KEYS.districts(existing.regionId));
    return toDistrictResponse(district);
  },

  async deleteDistrict(id: string): Promise<void> {
    const existing = await regionRepository.findDistrictById(id);
    if (!existing) throw new NotFoundError("Tuman topilmadi");

    const villageCount = await regionRepository.countVillages(id);
    if (villageCount > 0) {
      throw new ConflictError(
        `Ushbu tumanda ${villageCount} ta qishloq mavjud. Avval ularni o'chiring`
      );
    }

    await regionRepository.deleteDistrict(id);
    await invalidateCache(CACHE_KEYS.districts(existing.regionId));
  },

  // ---------- Village ----------

  async listVillagesByDistrict(districtId: string): Promise<VillageResponse[]> {
    const district = await regionRepository.findDistrictById(districtId);
    if (!district) throw new NotFoundError("Tuman topilmadi");

    return getOrSetCache(CACHE_KEYS.villages(districtId), CACHE_TTL.VILLAGES, async () => {
      const villages = await regionRepository.findVillagesByDistrict(districtId);
      return villages.map(toVillageResponse);
    });
  },

  async createVillage(input: CreateVillageInput): Promise<VillageResponse> {
    const district = await regionRepository.findDistrictById(input.districtId);
    if (!district) throw new NotFoundError("Tuman topilmadi");

    const village = await regionRepository.createVillage({
      name: input.name,
      district: { connect: { id: input.districtId } }
    });

    await invalidateCache(CACHE_KEYS.villages(input.districtId));
    return toVillageResponse(village);
  },

  async updateVillage(id: string, input: UpdateVillageInput): Promise<VillageResponse> {
    const existing = await regionRepository.findVillageById(id);
    if (!existing) throw new NotFoundError("Qishloq topilmadi");

    const village = await regionRepository.updateVillage(id, input);
    await invalidateCache(CACHE_KEYS.villages(existing.districtId));
    return toVillageResponse(village);
  },

  async deleteVillage(id: string): Promise<void> {
    const existing = await regionRepository.findVillageById(id);
    if (!existing) throw new NotFoundError("Qishloq topilmadi");

    await regionRepository.deleteVillage(id);
    await invalidateCache(CACHE_KEYS.villages(existing.districtId));
  }
};
