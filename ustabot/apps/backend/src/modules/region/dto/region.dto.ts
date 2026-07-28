import type { Region, District, Village } from "@prisma/client";
import type {
  RegionResponse,
  DistrictResponse,
  VillageResponse
} from "@/modules/region/types/region.types.js";

export function toRegionResponse(region: Region, districtCount?: number): RegionResponse {
  return {
    id: region.id,
    name: region.name,
    code: region.code,
    ...(districtCount !== undefined ? { districtCount } : {}),
    createdAt: region.createdAt,
    updatedAt: region.updatedAt
  };
}

export function toDistrictResponse(district: District, villageCount?: number): DistrictResponse {
  return {
    id: district.id,
    regionId: district.regionId,
    name: district.name,
    ...(villageCount !== undefined ? { villageCount } : {}),
    createdAt: district.createdAt,
    updatedAt: district.updatedAt
  };
}

export function toVillageResponse(village: Village): VillageResponse {
  return {
    id: village.id,
    districtId: village.districtId,
    name: village.name,
    createdAt: village.createdAt,
    updatedAt: village.updatedAt
  };
}
