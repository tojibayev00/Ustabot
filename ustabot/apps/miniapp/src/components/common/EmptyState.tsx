import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button.js";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-bg">
        <Icon className="h-7 w-7 text-hint" strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <p className="text-[15px] font-medium text-text">{title}</p>
        {description && <p className="text-sm text-hint">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
