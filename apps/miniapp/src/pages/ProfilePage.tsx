import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight, LogOut, Settings, Bell, Wrench, Info, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth.store.js";
import { authApi, workerApi } from "@/services/api.service.js";
import { Card } from "@/components/ui/card.js";
import { Badge } from "@/components/ui/badge.js";

const ROLE_LABELS: Record<string, string> = {
  USER: "Foydalanuvchi",
  WORKER: "Usta",
  MODERATOR: "Moderator",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin"
};

const STATUS_LABELS: Record<string, { label: string; variant: "warning" | "success" | "danger" }> = {
  PENDING: { label: "Ko'rib chiqilmoqda", variant: "warning" },
  APPROVED: { label: "Tasdiqlangan", variant: "success" },
  REJECTED: { label: "Rad etilgan", variant: "danger" },
  BLOCKED: { label: "Bloklangan", variant: "danger" }
};

function MenuRow({
  icon: Icon,
  label,
  onClick,
  trailing
}: {
  icon: typeof Settings;
  label: string;
  onClick: () => void;
  trailing?: React.ReactNode;
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-text active:bg-secondary-bg"
    >
      <Icon className="h-5 w-5 text-hint" strokeWidth={1.8} />
      <span className="flex-1">{label}</span>
      {trailing}
      <ChevronRight className="h-4 w-4 text-hint" />
    </button>
  );
}

export default function ProfilePage(): JSX.Element {
  const navigate = useNavigate();
  const { user, refreshToken, clearSession } = useAuthStore();

  const statusQuery = useQuery({
    queryKey: ["worker-status"],
    queryFn: workerApi.getMyStatus,
    enabled: Boolean(user?.isWorker)
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(refreshToken ?? ""),
    onSettled: () => clearSession()
  });

  if (!user) return <></>;

  const statusInfo = statusQuery.data ? STATUS_LABELS[statusQuery.data.status] : undefined;

  return (
    <div className="animate-fade-in pb-6">
      <div className="flex flex-col items-center gap-2 bg-header-bg px-4 py-6">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-secondary-bg text-2xl font-semibold text-hint">
          {user.photoUrl ? (
            <img src={user.photoUrl} alt={user.firstName} className="h-full w-full object-cover" />
          ) : (
            user.firstName.charAt(0)
          )}
        </div>
        <p className="text-lg font-semibold text-text">
          {user.firstName} {user.lastName ?? ""}
        </p>
        {user.username && <p className="text-sm text-hint">@{user.username}</p>}
        <Badge variant="info">{ROLE_LABELS[user.role] ?? user.role}</Badge>
      </div>

      {user.isWorker && statusInfo && (
        <Card className="mx-4 mt-4">
          <button
            onClick={() => navigate("/become-worker")}
            className="flex w-full items-center gap-3 p-4 text-left"
          >
            <Wrench className="h-5 w-5 text-link" />
            <div className="flex-1">
              <p className="text-[15px] font-medium text-text">Usta profili</p>
              <p className="text-xs text-hint">Ariza holatini ko'rish</p>
            </div>
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </button>
        </Card>
      )}

      {!user.isWorker && (
        <Card className="mx-4 mt-4">
          <button
            onClick={() => navigate("/become-worker")}
            className="flex w-full items-center gap-3 p-4 text-left"
          >
            <Wrench className="h-5 w-5 text-link" />
            <div className="flex-1">
              <p className="text-[15px] font-medium text-text">Usta bo'lish</p>
              <p className="text-xs text-hint">Xizmatlaringizni taklif qiling</p>
            </div>
            <ChevronRight className="h-4 w-4 text-hint" />
          </button>
        </Card>
      )}

      <Card className="mx-4 mt-4 divide-y divide-hint/10">
        <MenuRow icon={Bell} label="Bildirishnomalar" onClick={() => navigate("/notifications")} />
        <MenuRow icon={Settings} label="Sozlamalar" onClick={() => navigate("/settings")} />
        <MenuRow icon={Info} label="Ilova haqida" onClick={() => navigate("/about")} />
        {["MODERATOR", "ADMIN", "SUPER_ADMIN"].includes(user.role) && (
          <MenuRow icon={ShieldCheck} label="Admin Panel" onClick={() => navigate("/admin")} />
        )}
      </Card>

      <button
        onClick={() => logoutMutation.mutate()}
        className="mx-4 mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-danger/10 py-3.5 text-[15px] font-medium text-danger"
      >
        <LogOut className="h-4 w-4" />
        Tizimdan chiqish
      </button>
    </div>
  );
}
