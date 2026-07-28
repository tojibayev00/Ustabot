import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { useCategories } from "@/hooks/useCategories.js";
import { useWorkers } from "@/hooks/useWorkers.js";
import { CategoryCard } from "@/components/cards/CategoryCard.js";
import { WorkerCard } from "@/components/cards/WorkerCard.js";
import { WorkerListSkeleton } from "@/components/common/WorkerCardSkeleton.js";
import { Skeleton } from "@/components/ui/skeleton.js";
import { EmptyState } from "@/components/common/EmptyState.js";
import { ErrorState } from "@/components/common/ErrorState.js";
import { Users } from "lucide-react";

export default function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const categories = useCategories();
  const newestWorkers = useWorkers({ sort: "createdAt:desc", limit: 6 });
  const popularWorkers = useWorkers({ sort: "views:desc", limit: 6 });

  return (
    <div className="animate-fade-in pb-6">
      {/* Hero */}
      <section className="bg-header-bg px-4 pb-6 pt-5">
        <h1 className="text-xl font-bold text-text">🛠 Ustalar Topish</h1>
        <p className="mt-1 text-sm text-hint">Ishonchli ustalarni tez va oson toping</p>

        <button
          onClick={() => navigate("/search")}
          className="mt-4 flex h-12 w-full items-center gap-2 rounded-md bg-secondary-bg px-4 text-[15px] text-hint shadow-soft"
        >
          <SearchIcon className="h-5 w-5" />
          Usta yoki xizmat qidirish...
        </button>
      </section>

      {/* Kategoriyalar */}
      <section className="mt-2 px-4">
        <h2 className="mb-3 text-[15px] font-semibold text-text">Kategoriyalar</h2>

        {categories.isLoading && (
          <div className="flex gap-3 overflow-x-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[104px] w-[92px] shrink-0 rounded-md" />
            ))}
          </div>
        )}

        {categories.isError && <ErrorState onRetry={() => categories.refetch()} />}

        {categories.data && categories.data.length === 0 && (
          <EmptyState title="Kategoriyalar mavjud emas" />
        )}

        {categories.data && categories.data.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {categories.data.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Eng so'nggi ustalar */}
      <section className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-text">Yangi qo'shilgan ustalar</h2>
          <button onClick={() => navigate("/search")} className="text-xs font-medium text-link">
            Barchasi
          </button>
        </div>

        {newestWorkers.isLoading && <WorkerListSkeleton count={3} />}
        {newestWorkers.isError && <ErrorState onRetry={() => newestWorkers.refetch()} />}
        {newestWorkers.data && newestWorkers.data.items.length === 0 && (
          <EmptyState icon={Users} title="Hozircha ustalar yo'q" />
        )}
        {newestWorkers.data && newestWorkers.data.items.length > 0 && (
          <div className="space-y-3">
            {newestWorkers.data.items.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </section>

      {/* Mashhur ustalar */}
      <section className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-text">Mashhur ustalar</h2>
          <button
            onClick={() => navigate("/search?sort=views:desc")}
            className="text-xs font-medium text-link"
          >
            Barchasi
          </button>
        </div>

        {popularWorkers.isLoading && <WorkerListSkeleton count={3} />}
        {popularWorkers.isError && <ErrorState onRetry={() => popularWorkers.refetch()} />}
        {popularWorkers.data && popularWorkers.data.items.length > 0 && (
          <div className="space-y-3">
            {popularWorkers.data.items.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
