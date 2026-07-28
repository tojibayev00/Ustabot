import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Ban, RotateCcw } from "lucide-react";
import { adminUserApi, type AdminUserItem } from "@/services/api.service.js";
import { useDebouncedValue } from "@/hooks/useDebouncedValue.js";
import { DataTable, type Column } from "@/components/admin/DataTable.js";
import { PaginationControls } from "@/components/admin/PaginationControls.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";

const ROLE_LABELS: Record<string, string> = {
  USER: "Foydalanuvchi",
  WORKER: "Usta",
  MODERATOR: "Moderator",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin"
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminUsersPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", debouncedSearch, page],
    queryFn: () => adminUserApi.list({ page, limit: 15, search: debouncedSearch || undefined })
  });

  function invalidate(): void {
    void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  }

  const blockMutation = useMutation({ mutationFn: adminUserApi.block, onSuccess: invalidate });
  const unblockMutation = useMutation({ mutationFn: adminUserApi.unblock, onSuccess: invalidate });

  const columns: Column<AdminUserItem>[] = [
    {
      key: "name",
      header: "Ism",
      render: (row) => (
        <div>
          <p className="font-medium">
            {row.firstName} {row.lastName ?? ""}
          </p>
          {row.username && <p className="text-xs text-hint">@{row.username}</p>}
        </div>
      )
    },
    {
      key: "role",
      header: "Rol",
      render: (row) => <Badge variant="info">{ROLE_LABELS[row.role] ?? row.role}</Badge>
    },
    {
      key: "status",
      header: "Holat",
      render: (row) => (
        <Badge variant={row.isBlocked ? "danger" : "success"}>
          {row.isBlocked ? "Bloklangan" : "Faol"}
        </Badge>
      )
    },
    { key: "joined", header: "Ro'yxatdan o'tgan", render: (row) => formatDate(row.createdAt) },
    {
      key: "actions",
      header: "Amallar",
      className: "text-right",
      render: (row) =>
        row.role === "SUPER_ADMIN" ? null : row.isBlocked ? (
          <Button size="sm" variant="outline" onClick={() => unblockMutation.mutate(row.id)}>
            <RotateCcw className="h-3.5 w-3.5" /> Blokdan chiqarish
          </Button>
        ) : (
          <Button size="sm" variant="danger" onClick={() => blockMutation.mutate(row.id)}>
            <Ban className="h-3.5 w-3.5" /> Bloklash
          </Button>
        )
    }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-text">Foydalanuvchilar</h1>

      <div className="flex h-11 items-center gap-2 rounded-md bg-section-bg px-3 shadow-soft sm:max-w-xs">
        <Search className="h-4 w-4 text-hint" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Ism yoki username bo'yicha qidirish..."
          className="h-full border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <DataTable columns={columns} rows={data?.items ?? []} getRowKey={(row) => row.id} isLoading={isLoading} />

      {data && data.meta.totalPages > 1 && <PaginationControls meta={data.meta} onPageChange={setPage} />}
    </div>
  );
}
