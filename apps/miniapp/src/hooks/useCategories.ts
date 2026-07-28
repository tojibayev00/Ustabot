import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/services/api.service.js";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.list,
    staleTime: 60 * 60 * 1000 // 1 soat — backend keshiga mos
  });
}
