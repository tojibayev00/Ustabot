import { useNavigate } from "react-router-dom";
import { memo } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CategoryDto } from "@/services/api.service.js";

interface CategoryCardProps {
  category: CategoryDto;
}

function resolveIcon(name: string | null): LucideIcon {
  if (!name) return Icons.Wrench;
  const icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? Icons.Wrench;
}

function CategoryCardComponent({ category }: CategoryCardProps): JSX.Element {
  const navigate = useNavigate();
  const Icon = resolveIcon(category.icon);

  return (
    <button
      onClick={() => navigate(`/search?category=${category.id}`)}
      className="flex min-w-[92px] flex-col items-center gap-2 rounded-md bg-section-bg p-3 text-center shadow-soft transition-transform active:scale-95"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-link/10">
        <Icon className="h-5 w-5 text-link" strokeWidth={1.8} />
      </div>
      <span className="line-clamp-2 text-xs font-medium text-text">{category.name}</span>
      {category.workerCount !== undefined && (
        <span className="text-[11px] text-hint">{category.workerCount} ta usta</span>
      )}
    </button>
  );
}

export const CategoryCard = memo(CategoryCardComponent);
