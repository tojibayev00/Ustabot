import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { useInfiniteWorkers } from "@/hooks/useWorkers.js";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";
import { useInfiniteScrollTrigger } from "@/hooks/useInfiniteScrollTrigger.js";
import { SearchFilters, type SearchFiltersValue } from "@/components/search/SearchFilters.js";
import { WorkerCard } from "@/components/cards/WorkerCard.js";
import { WorkerListSkeleton } from "@/components/common/WorkerCardSkeleton.js";
import { EmptyState } from "@/components/common/EmptyState.js";
import { ErrorState } from "@/components/common/ErrorState.js";
import { LoadingSpinner } from "@/components/common/LoadingSpinner.js";
import { SearchX } from "lucide-react";

export default function SearchPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<SearchFiltersValue>({
    category: searchParams.get("category") ?? undefined,
    sort: searchParams.get("sort") ?? "createdAt:desc"
  });

  const debouncedSearch = useDebouncedValue(searchText, 300);

  const query = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: filters.category,
      region: filters.region,
      district: filters.district,
      sort: filters.sort,
      verified: filters.verified,
      limit: 15
    }),
    [debouncedSearch, filters]
  );

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteWorkers(query);

  const loadMore = useCallback(() => {
    if (hasNextPage) void fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const sentinelRef = useInfiniteScrollTrigger(loadMore, Boolean(hasNextPage));

  const allWorkers = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="pb-4">
      <div className="sticky top-0 z-10 bg-bg px-4 pt-4">
        <div className="flex h-11 items-center gap-2 rounded-md bg-section-bg px-3 shadow-soft">
          <SearchIcon className="h-4 w-4 shrink-0 text-hint" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Ism, kategoriya yoki manzil bo'yicha qidirish..."
            className="h-full flex-1 bg-transparent text-[15px] text-text placeholder:text-hint focus:outline-none"
          />
          {searchText && (
            <button onClick={() => setSearchText("")} aria-label="Tozalash">
              <X className="h-4 w-4 text-hint" />
            </button>
          )}
        </div>

        <SearchFilters value={filters} onChange={setFilters} />
      </div>

      <div className="px-4">
        {isLoading && <WorkerListSkeleton />}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {!isLoading && !isError && allWorkers.length === 0 && (
          <EmptyState
            icon={SearchX}
            title="Hech narsa topilmadi"
            description="Boshqa so'z yoki filtrlar bilan qayta urinib ko'ring"
          />
        )}

        {allWorkers.length > 0 && (
          <div className="space-y-3">
            {allWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div ref={sentinelRef} className="flex justify-center py-4">
            {isFetchingNextPage && <LoadingSpinner />}
          </div>
        )}
      </div>
    </div>
  );
}
