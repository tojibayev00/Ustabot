import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { workerApi, type ListWorkersQuery } from "@/services/api.service.js";

export function useWorkers(query: ListWorkersQuery) {
  return useQuery({
    queryKey: ["workers", "list", query],
    queryFn: () => workerApi.list(query),
    staleTime: 5 * 60 * 1000
  });
}

/** Qidiruv sahifasi uchun — cheksiz skroll (infinite scroll) */
export function useInfiniteWorkers(query: Omit<ListWorkersQuery, "page">) {
  return useInfiniteQuery({
    queryKey: ["workers", "search", query],
    queryFn: ({ pageParam }) => workerApi.search({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    staleTime: 5 * 60 * 1000
  });
}

export function useWorkerDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["workers", "detail", id],
    queryFn: () => workerApi.getById(id as string),
    enabled: Boolean(id)
  });
}
