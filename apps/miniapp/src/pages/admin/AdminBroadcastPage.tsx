import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { adminBroadcastApi, type BroadcastItem } from "@/services/api.service.js";
import { ApiError } from "@/services/http.js";
import { DataTable, type Column } from "@/components/admin/DataTable.js";
import { Card } from "@/components/ui/card.js";
import { Input } from "@/components/ui/input.js";
import { Textarea } from "@/components/ui/textarea.js";
import { Button } from "@/components/ui/button.js";
import { Badge } from "@/components/ui/badge.js";

const STATUS_VARIANT: Record<BroadcastItem["status"], "warning" | "info" | "success"> = {
  QUEUED: "warning",
  IN_PROGRESS: "info",
  FINISHED: "success"
};

const STATUS_LABEL: Record<BroadcastItem["status"], string> = {
  QUEUED: "Navbatda",
  IN_PROGRESS: "Yuborilmoqda",
  FINISHED: "Yakunlandi"
};

export default function AdminBroadcastPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-broadcast-history"],
    queryFn: () => adminBroadcastApi.history({ page: 1, limit: 20 }),
    refetchInterval: 5000 // Yuborilayotgan broadcast progress'ini kuzatish uchun
  });

  const createMutation = useMutation({
    mutationFn: () =>
      adminBroadcastApi.create({
        title,
        message,
        buttonText: buttonText || undefined,
        buttonUrl: buttonUrl || undefined
      }),
    onSuccess: () => {
      setTitle("");
      setMessage("");
      setButtonText("");
      setButtonUrl("");
      setError(null);
      void queryClient.invalidateQueries({ queryKey: ["admin-broadcast-history"] });
    },
    onError: (e) => setError(e instanceof ApiError ? e.message : "Xatolik yuz berdi")
  });

  const columns: Column<BroadcastItem>[] = [
    { key: "title", header: "Sarlavha", render: (row) => row.title },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>
    },
    { key: "success", header: "Yuborildi", render: (row) => row.successCount },
    { key: "failed", header: "Xato", render: (row) => row.failedCount },
    {
      key: "date",
      header: "Sana",
      render: (row) => new Date(row.createdAt).toLocaleString("uz-UZ")
    }
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-text">Broadcast</h1>

      <Card className="space-y-3 p-4">
        <h2 className="text-[15px] font-semibold text-text">Yangi xabar yuborish</h2>

        <Input placeholder="Sarlavha" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          placeholder="Xabar matni..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Tugma matni (ixtiyoriy)"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
          />
          <Input
            placeholder="Tugma havolasi (ixtiyoriy)"
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
          />
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <Button
          disabled={title.trim().length < 3 || message.trim().length < 3}
          isLoading={createMutation.isPending}
          onClick={() => createMutation.mutate()}
        >
          <Send className="h-4 w-4" /> Yuborish
        </Button>
      </Card>

      <div>
        <h2 className="mb-2 text-[15px] font-semibold text-text">Tarix</h2>
        <DataTable
          columns={columns}
          rows={data?.items ?? []}
          getRowKey={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="Hozircha broadcast yuborilmagan"
        />
      </div>
    </div>
  );
}
