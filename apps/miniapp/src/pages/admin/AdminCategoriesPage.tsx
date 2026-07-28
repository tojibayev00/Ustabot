import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, EyeOff, Eye } from "lucide-react";
import { categoryApi, adminCategoryApi, type CategoryDto } from "@/services/api.service.js";
import { ApiError } from "@/services/http.js";
import { DataTable, type Column } from "@/components/admin/DataTable.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog.js";

export default function AdminCategoriesPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["admin-categories"], queryFn: categoryApi.list });

  function invalidate(): void {
    void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    void queryClient.invalidateQueries({ queryKey: ["categories"] });
  }

  const createMutation = useMutation({
    mutationFn: () => adminCategoryApi.create({ name, icon: icon || undefined }),
    onSuccess: () => {
      invalidate();
      closeDialog();
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : "Xatolik")
  });

  const updateMutation = useMutation({
    mutationFn: () => adminCategoryApi.update(editing!.id, { name, icon: icon || undefined }),
    onSuccess: () => {
      invalidate();
      closeDialog();
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : "Xatolik")
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: (category: CategoryDto) => adminCategoryApi.update(category.id, { isVisible: !category.isVisible }),
    onSuccess: invalidate
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminCategoryApi.remove(id),
    onSuccess: invalidate,
    onError: (e) => alert(e instanceof ApiError ? e.message : "Xatolik yuz berdi")
  });

  function openCreateDialog(): void {
    setEditing(null);
    setName("");
    setIcon("");
    setError(null);
    setDialogOpen(true);
  }

  function openEditDialog(category: CategoryDto): void {
    setEditing(category);
    setName(category.name);
    setIcon(category.icon ?? "");
    setError(null);
    setDialogOpen(true);
  }

  function closeDialog(): void {
    setDialogOpen(false);
  }

  const columns: Column<CategoryDto>[] = [
    { key: "name", header: "Nomi", render: (row) => row.name },
    { key: "slug", header: "Slug", render: (row) => <span className="text-hint">{row.slug}</span> },
    { key: "workers", header: "Ustalar", render: (row) => row.workerCount ?? 0 },
    {
      key: "actions",
      header: "Amallar",
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-1.5">
          <Button size="sm" variant="outline" onClick={() => toggleVisibilityMutation.mutate(row)}>
            {row.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </Button>
          <Button size="sm" variant="outline" onClick={() => openEditDialog(row)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              if (confirm(`"${row.name}" kategoriyasini o'chirishni tasdiqlaysizmi?`)) {
                deleteMutation.mutate(row.id);
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-text">Kategoriyalar</h1>
        <Button size="sm" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" /> Yangi
        </Button>
      </div>

      <DataTable columns={columns} rows={data ?? []} getRowKey={(row) => row.id} isLoading={isLoading} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-hint">Nomi</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-hint">
                Lucide icon nomi (masalan: Wrench)
              </label>
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} />
            </div>
            {error && <p className="text-xs text-danger">{error}</p>}
            <Button
              className="w-full"
              disabled={name.trim().length < 2}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onClick={() => (editing ? updateMutation.mutate() : createMutation.mutate())}
            >
              Saqlash
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
