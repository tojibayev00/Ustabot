import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  isLoading,
  emptyMessage = "Ma'lumot topilmadi"
}: DataTableProps<T>): JSX.Element {
  return (
    <div className="overflow-x-auto rounded-md bg-section-bg shadow-soft">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="sticky top-0 bg-secondary-bg text-xs font-medium uppercase text-hint">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-3 py-2.5 ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hint/10">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-3">
                    <div className="skeleton h-4 w-full animate-shimmer rounded" />
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-hint">
                {emptyMessage}
              </td>
            </tr>
          )}

          {!isLoading &&
            rows.map((row) => (
              <tr key={getRowKey(row)} className="text-text">
                {columns.map((col) => (
                  <td key={col.key} className={`px-3 py-3 ${col.className ?? ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
