import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { notificationApi } from "@/services/api.service.js";
import { useTelegramBackButton } from "@/hooks/useTelegramBackButton.js";
import { EmptyState } from "@/components/common/EmptyState.js";
import { ErrorState } from "@/components/common/ErrorState.js";
import { Skeleton } from "@/components/ui/skeleton.js";
import { cn } from "@/utils/cn.js";

const TYPE_LABELS: Record<string, string> = {
  SYSTEM: "Tizim",
  APPROVAL: "Tasdiqlash",
  REJECTION: "Rad etish",
  REPORT: "Shikoyat",
  BROADCAST: "E'lon"
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function NotificationsPage(): JSX.Element {
  useTelegramBackButton();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.list()
  });

  const markAllMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  const markOneMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["notifications"] })
  });

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-lg font-bold text-text">Bildirishnomalar</h1>
        {data && data.data.length > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            className="flex items-center gap-1 text-xs font-medium text-link"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Barchasini o'qish
          </button>
        )}
      </div>

      <div className="mt-3 px-4">
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {isError && <ErrorState onRetry={() => refetch()} />}

        {data && data.data.length === 0 && (
          <EmptyState icon={Bell} title="Bildirishnomalar yo'q" description="Yangi bildirishnomalar shu yerda ko'rinadi" />
        )}

        {data && data.data.length > 0 && (
          <div className="space-y-2">
            {data.data.map((notification) => (
              <button
                key={notification.id}
                onClick={() => !notification.isRead && markOneMutation.mutate(notification.id)}
                className={cn(
                  "w-full rounded-md p-3 text-left shadow-soft",
                  notification.isRead ? "bg-section-bg" : "bg-link/5"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-link">
                    {TYPE_LABELS[notification.type] ?? notification.type}
                  </span>
                  {!notification.isRead && <span className="h-2 w-2 rounded-full bg-link" />}
                </div>
                <p className="mt-1 text-[15px] font-medium text-text">{notification.title}</p>
                <p className="mt-0.5 text-sm text-hint">{notification.message}</p>
                <p className="mt-1 text-xs text-hint">{formatDate(notification.createdAt)}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
