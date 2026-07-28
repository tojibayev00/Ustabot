import { useQuery } from "@tanstack/react-query";
import { Users, Wrench, Clock, CheckCircle2, Ban, Flag } from "lucide-react";
import { adminDashboardApi } from "@/services/api.service.js";
import { Card } from "@/components/ui/card.js";
import { Skeleton } from "@/components/ui/skeleton.js";
import { ErrorState } from "@/components/common/ErrorState.js";

const STAT_CARDS = [
  { key: "totalUsers", label: "Foydalanuvchilar", icon: Users, color: "text-info" },
  { key: "totalWorkers", label: "Ustalar (jami)", icon: Wrench, color: "text-link" },
  { key: "pendingWorkers", label: "Kutayotgan", icon: Clock, color: "text-warning" },
  { key: "approvedWorkers", label: "Tasdiqlangan", icon: CheckCircle2, color: "text-success" },
  { key: "blockedWorkers", label: "Bloklangan", icon: Ban, color: "text-danger" },
  { key: "pendingReports", label: "Shikoyatlar", icon: Flag, color: "text-danger" }
] as const;

export default function AdminDashboardPage(): JSX.Element {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminDashboardApi.get,
    refetchInterval: 30_000 // Part 7: "Polling interval 30 seconds"
  });

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-text">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_CARDS.map((card) => (
          <Card key={card.key} className="p-3">
            <card.icon className={`h-5 w-5 ${card.color}`} />
            <p className="mt-2 text-xl font-bold text-text">
              {isLoading ? <Skeleton className="h-6 w-10" /> : data?.counts[card.key]}
            </p>
            <p className="text-xs text-hint">{card.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 text-[15px] font-semibold text-text">Mashhur ustalar</h2>
          {isLoading && <Skeleton className="h-32 w-full" />}
          {data && (
            <ul className="space-y-2">
              {data.popularWorkers.map((w) => (
                <li key={w.id} className="flex justify-between text-sm">
                  <span className="text-text">
                    {w.firstName} {w.lastName} <span className="text-hint">— {w.categoryName}</span>
                  </span>
                  <span className="text-hint">{w.views} ko'rish</span>
                </li>
              ))}
              {data.popularWorkers.length === 0 && <p className="text-sm text-hint">Ma'lumot yo'q</p>}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-[15px] font-semibold text-text">Top kategoriyalar</h2>
          {isLoading && <Skeleton className="h-32 w-full" />}
          {data && (
            <ul className="space-y-2">
              {data.popularCategories.map((c) => (
                <li key={c.id} className="flex justify-between text-sm">
                  <span className="text-text">{c.name}</span>
                  <span className="text-hint">{c.workerCount} ta usta</span>
                </li>
              ))}
              {data.popularCategories.length === 0 && <p className="text-sm text-hint">Ma'lumot yo'q</p>}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
