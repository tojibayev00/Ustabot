import { Clock, CheckCircle2, XCircle, Ban } from "lucide-react";
import type { WorkerStatusDto } from "@/services/api.service.js";

const STATUS_CONFIG: Record<
  string,
  { icon: typeof Clock; color: string; title: string; description: string }
> = {
  PENDING: {
    icon: Clock,
    color: "text-warning",
    title: "Ko'rib chiqilmoqda",
    description: "Arizangiz moderator tomonidan ko'rib chiqilmoqda. Odatda 24 soat ichida javob beriladi."
  },
  APPROVED: {
    icon: CheckCircle2,
    color: "text-success",
    title: "Tasdiqlangan",
    description: "Profilingiz tasdiqlangan va qidiruvda ko'rinmoqda."
  },
  REJECTED: {
    icon: XCircle,
    color: "text-danger",
    title: "Rad etilgan",
    description: "Afsuski, arizangiz rad etildi."
  },
  BLOCKED: {
    icon: Ban,
    color: "text-danger",
    title: "Bloklangan",
    description: "Profilingiz vaqtincha bloklangan."
  }
};

export function WorkerStatusCard({ status }: { status: WorkerStatusDto }): JSX.Element {
  const config = STATUS_CONFIG[status.status] ?? STATUS_CONFIG.PENDING!;
  const Icon = config.icon;

  return (
    <div className="mx-4 mt-4 space-y-3 rounded-md bg-section-bg p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <Icon className={`h-8 w-8 ${config.color}`} />
        <div>
          <p className="text-[15px] font-semibold text-text">{config.title}</p>
          <p className="text-sm text-hint">{config.description}</p>
        </div>
      </div>

      {status.status === "REJECTED" && status.rejectionReason && (
        <div className="rounded-md bg-danger/10 p-3 text-sm text-danger">
          <strong>Sabab:</strong> {status.rejectionReason}
        </div>
      )}
    </div>
  );
}
