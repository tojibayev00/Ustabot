export interface RegionResponse {
  id: string;
  name: string;
  code: string;
  districtCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DistrictResponse {
  id: string;
  regionId: string;
  name: string;
  villageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VillageResponse {
  id: string;
  districtId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
