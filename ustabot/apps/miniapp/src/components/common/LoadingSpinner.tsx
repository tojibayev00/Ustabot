import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn.js";

export function LoadingSpinner({ className }: { className?: string }): JSX.Element {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-hint", className)} />;
}

export function FullScreenLoader({ label }: { label?: string }): JSX.Element {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-link" />
      {label && <p className="text-sm text-hint">{label}</p>}
    </div>
  );
}
