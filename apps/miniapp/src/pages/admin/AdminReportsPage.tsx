import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminReportApi, type AdminReportItem } from "@/services/api.service.js";
import { DataTable, type Column } from "@/components/admin/DataTable.js";
import { PaginationControls } from "@/components/admin/PaginationControls.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { cn } from "@/utils/cn.js";

const STATUS_TABS = [
  { value: undefined, label: "Barchasi" },
  { value: "PENDING", label: "Yangi" },
  { value: "REVIEWING", label: "Ko'rib chiqilmoqda" },
  { value: "RESOLVED", label: "Hal qilingan" },
  { value: "REJECTED", label: "Rad etilgan" }
] as const;

const STATUS_VARIANT: Record<string, "warning" | "info" | "success" | "danger"> = {
  PENDING: "warning",
  REVIEWING: "info",
  RESOLVED: "success",
  REJECTED: "danger"
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "short" });
}

export default function AdminReportsPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reports", status, page],
    queryFn: () => adminReportApi.list({ page, limit: 15, status })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: "REVIEWING" | "RESOLVED" | "REJECTED" }) =>
      adminReportApi.updateStatus(id, newStatus),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-reports"] })
  });

  const columns: Column<AdminReportItem>[] = [
    {
      key: "worker",
      header: "Usta",
      render: (row) => `${row.worker.firstName} ${row.worker.lastName}`
    },
    { key: "reason", header: "Sabab", render: (row) => row.reason },
    {
      key: "reporter",
      header: "Shikoyatchi",
      render: (row) => row.reporter.firstName
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? "default"}>{row.status}</Badge>
    },
    { key: "date", header: "Sana", render: (row) => formatDate(row.createdAt) },
    {
      key: "actions",
      header: "Amallar",
      className: "text-right",
      render: (row) =>
        row.status === "PENDING" || row.status === "REVIEWING" ? (
          <div className="flex justify-end gap-1.5">
            {row.status === "PENDING" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateMutation.mutate({ id: row.id, newStatus: "REVIEWING" })}
              >
                Ko'rib chiqish
              </Button>
            )}
            <Button
              size="sm"
              variant="success"
              onClick={() => updateMutation.mutate({ id: row.id, newStatus: "RESOLVED" })}
            >
              Hal qilish
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateMutation.mutate({ id: row.id, newStatus: "REJECTED" })}
            >
              Bekor qilish
            </Button>
          </div>
        ) : null
    }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-text">Shikoyatlar</h1>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium",
              status === tab.value ? "bg-link text-white" : "bg-secondary-bg text-hint"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={data?.items ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="Shikoyatlar mavjud emas"
      />

      {data && data.meta.totalPages > 1 && <PaginationControls meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
