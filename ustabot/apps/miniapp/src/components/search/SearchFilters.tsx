import { SlidersHorizontal } from "lucide-react";
import { useCategories } from "@/hooks/useCategories.js";
import { useRegions, useDistricts } from "@/hooks/useRegions.js";
import { cn } from "@/utils/cn.js";

export interface SearchFiltersValue {
  category?: string;
  region?: string;
  district?: string;
  sort?: string;
  verified?: boolean;
}

interface SearchFiltersProps {
  value: SearchFiltersValue;
  onChange: (value: SearchFiltersValue) => void;
}

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Eng yangi" },
  { value: "createdAt:asc", label: "Eng eski" },
  { value: "views:desc", label: "Ko'p ko'rilgan" },
  { value: "experienceYears:desc", label: "Tajriba bo'yicha" },
  { value: "firstName:asc", label: "Alifbo bo'yicha" }
];

const selectClass =
  "h-10 rounded-md border border-hint/25 bg-section-bg px-2.5 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link/50";

export function SearchFilters({ value, onChange }: SearchFiltersProps): JSX.Element {
  const categories = useCategories();
  const regions = useRegions();
  const districts = useDistricts(value.region);

  const hasActiveFilters = Boolean(value.category || value.region || value.verified);

  return (
    <div className="space-y-2 px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-medium text-hint">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filtrlar
        {hasActiveFilters && (
          <button
            onClick={() => onChange({ sort: value.sort })}
            className="ml-auto text-link"
          >
            Tozalash
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          className={selectClass}
          value={value.category ?? ""}
          onChange={(e) => onChange({ ...value, category: e.target.value || undefined })}
        >
          <option value="">Barcha kategoriya</option>
          {categories.data?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={value.region ?? ""}
          onChange={(e) =>
            onChange({ ...value, region: e.target.value || undefined, district: undefined })
          }
        >
          <option value="">Barcha viloyat</option>
          {regions.data?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {value.region && (
          <select
            className={selectClass}
            value={value.district ?? ""}
            onChange={(e) => onChange({ ...value, district: e.target.value || undefined })}
          >
            <option value="">Barcha tuman</option>
            {districts.data?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}

        <select
          className={selectClass}
          value={value.sort ?? "createdAt:desc"}
          onChange={(e) => onChange({ ...value, sort: e.target.value })}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => onChange({ ...value, verified: value.verified ? undefined : true })}
          className={cn(
            "h-10 rounded-md border px-3 text-sm font-medium transition-colors",
            value.verified
              ? "border-link bg-link/10 text-link"
              : "border-hint/25 bg-section-bg text-hint"
          )}
        >
          ✓ Tasdiqlangan
        </button>
      </div>
    </div>
  );
}
