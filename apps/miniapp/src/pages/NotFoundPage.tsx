import { useNavigate } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button.js";

export default function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3 px-6 text-center">
      <CompassIcon className="h-14 w-14 text-hint" strokeWidth={1.5} />
      <p className="text-lg font-semibold text-text">Sahifa topilmadi</p>
      <p className="text-sm text-hint">Siz izlagan sahifa mavjud emas yoki ko'chirilgan.</p>
      <Button onClick={() => navigate("/")} className="mt-2">
        Bosh sahifaga qaytish
      </Button>
    </div>
  );
}
