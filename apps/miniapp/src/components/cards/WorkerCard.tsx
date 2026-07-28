import { Link } from "react-router-dom";
import { memo } from "react";
import { MapPin, BadgeCheck, Eye, Briefcase } from "lucide-react";
import type { WorkerListItem } from "@/services/api.service.js";

interface WorkerCardProps {
  worker: WorkerListItem;
}

function WorkerCardComponent({ worker }: WorkerCardProps): JSX.Element {
  return (
    <Link
      to={`/workers/${worker.id}`}
      className="flex gap-3 rounded-md bg-section-bg p-3 shadow-soft transition-transform active:scale-[0.98]"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary-bg">
        {worker.coverImageUrl ? (
          <img
            src={worker.coverImageUrl}
            alt={`${worker.firstName} ${worker.lastName}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-hint">
            {worker.firstName.charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-1">
          <p className="truncate text-[15px] font-semibold text-text">
            {worker.firstName} {worker.lastName}
          </p>
          {worker.isVerified && <BadgeCheck className="h-4 w-4 shrink-0 text-link" />}
        </div>

        <p className="truncate text-sm text-hint">{worker.categoryName}</p>

        <div className="flex items-center gap-3 text-xs text-hint">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {worker.regionName}, {worker.districtName}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-hint">
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {worker.experienceYears} yil tajriba
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {worker.views}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Ro'yxatlarda WorkerCard ko'p marta render bo'lgani uchun memo qilingan (Part 9: "Memoization") */
export const WorkerCard = memo(WorkerCardComponent);
