import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Ban, RotateCcw } from "lucide-react";
import { adminWorkerApi, type AdminListWorkersQuery } from "@/services/api.service.js";
import { DataTable, type Column } from "@/components/admin/DataTable.js";
import { PaginationControls } from "@/components/admin/PaginationControls.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { cn } from "@/utils/cn.js";
import type { AdminWorkerListItem } from "@/services/api.service.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog.js";
import { Textarea } from "@/components/ui/textarea.js";

const STATUS_TABS: { value: AdminListWorkersQuery["status"] | "ALL"; label: string }[] = [
  { value: "ALL", label: "Barchasi" },
  { value: "PENDING", label: "Kutayotgan" },
  { value: "APPROVED", label: "Tasdiqlangan" },
  { value: "REJECTED", label: "Rad etilgan" },
  { value: "BLOCKED", label: "Bloklangan" }
];

const STATUS_VARIANT: Record<string, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  BLOCKED: "danger"
};

export default function AdminWorkersPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AdminListWorkersQuery["status"] | "ALL">("PENDING");
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState<AdminWorkerListItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const query: AdminListWorkersQuery = {
    page,
    limit: 15,
    ...(status !== "ALL" ? { status } : {})
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-workers", query],
    queryFn: () => adminWorkerApi.list(query)
  });

  function invalidate(): void {
    void queryClient.invalidateQueries({ queryKey: ["admin-workers"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  }

  const approveMutation = useMutation({
    mutationFn: adminWorkerApi.approve,
    onSuccess: invalidate
  });
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminWorkerApi.reject(id, reason),
    onSuccess: () => {
      invalidate();
      setRejectTarget(null);
      setRejectReason("");
    }
  });
  const blockMutation = useMutation({ mutationFn: adminWorkerApi.block, onSuccess: invalidate });
  const activateMutation = useMutation({ mutationFn: adminWorkerApi.activate, onSuccess: invalidate });

  const columns: Column<AdminWorkerListItem>[] = [
    {
      key: "name",
      header: "Ism",
      render: (row) => (
        <div>
          <p className="font-medium">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-xs text-hint">{row.phone}</p>
        </div>
      )
    },
    { key: "category", header: "Kategoriya", render: (row) => row.categoryName },
    {
      key: "location",
      header: "Manzil",
      render: (row) => `${row.regionName}, ${row.districtName}`
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] ?? "default"}>{row.status}</Badge>
    },
    {
      key: "actions",
      header: "Amallar",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1.5">
          {row.status === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="success"
                isLoading={approveMutation.isPending}
                onClick={() => approveMutation.mutate(row.id)}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="danger" onClick={() => setRejectTarget(row)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          {row.status === "APPROVED" && (
            <Button size="sm" variant="outline" onClick={() => blockMutation.mutate(row.id)}>
              <Ban className="h-3.5 w-3.5" />
            </Button>
          )}
          {row.status === "BLOCKED" && (
            <Button size="sm" variant="outline" onClick={() => activateMutation.mutate(row.id)}>
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-text">Ustalarni boshqarish</h1>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
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
        emptyMessage="Bu bo'limda ustalar yo'q"
      />

      {data && data.meta.totalPages > 1 && (
        <PaginationControls meta={data.meta} onPageChange={setPage} />
      )}

      <Dialog open={rejectTarget !== null} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ustani rad etish</DialogTitle>
            <DialogDescription>
              {rejectTarget?.firstName} {rejectTarget?.lastName} — rad etish sababini kiriting
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Sabab (kamida 5 belgi)..."
          />
          <Button
            className="mt-3 w-full"
            variant="danger"
            disabled={rejectReason.trim().length < 5}
            isLoading={rejectMutation.isPending}
            onClick={() => rejectTarget && rejectMutation.mutate({ id: rejectTarget.id, reason: rejectReason })}
          >
            Rad etish
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
