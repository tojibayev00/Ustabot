import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import type { PaginationMeta } from "@/services/api.service.js";

interface PaginationControlsProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ meta, onPageChange }: PaginationControlsProps): JSX.Element {
  return (
    <div className="flex items-center justify-between border-t border-hint/10 px-1 py-3 text-sm">
      <span className="text-hint">
        {meta.total} tadan {(meta.page - 1) * meta.limit + 1}–
        {Math.min(meta.page * meta.limit, meta.total)}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex items-center px-2 text-hint">
          {meta.page} / {meta.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
