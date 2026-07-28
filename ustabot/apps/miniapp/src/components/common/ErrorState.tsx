import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.js";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Xatolik yuz berdi",
  description = "Ma'lumotlarni yuklab bo'lmadi. Internet aloqasini tekshirib, qayta urinib ko'ring.",
  onRetry
}: ErrorStateProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        <AlertTriangle className="h-7 w-7 text-danger" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <p className="text-[15px] font-medium text-text">{title}</p>
        <p className="text-sm text-hint">{description}</p>
      </div>
      <div className="mt-2 flex gap-2">
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Qayta urinish
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          Bosh sahifa
        </Button>
      </div>
    </div>
  );
}
