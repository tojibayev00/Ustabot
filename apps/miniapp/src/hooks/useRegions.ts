import { useQuery } from "@tanstack/react-query";
import { regionApi } from "@/services/api.service.js";

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: regionApi.list,
    staleTime: 24 * 60 * 60 * 1000
  });
}

export function useDistricts(regionId: string | undefined) {
  return useQuery({
    queryKey: ["districts", regionId],
    queryFn: () => regionApi.districts(regionId as string),
    enabled: Boolean(regionId),
    staleTime: 24 * 60 * 60 * 1000
  });
}

export function useVillages(districtId: string | undefined) {
  return useQuery({
    queryKey: ["villages", districtId],
    queryFn: () => regionApi.villages(districtId as string),
    enabled: Boolean(districtId),
    staleTime: 24 * 60 * 60 * 1000
  });
}
