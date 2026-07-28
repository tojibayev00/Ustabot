import { useParams } from "react-router-dom";
import { BadgeCheck, Eye, MapPin, Clock, Briefcase } from "lucide-react";
import { useWorkerDetail } from "@/hooks/useWorkers.js";
import { useTelegramBackButton } from "@/hooks/useTelegramBackButton.js";
import { ImageGallery } from "@/components/gallery/ImageGallery.js";
import { ContactActions } from "@/components/worker/ContactActions.js";
import { Skeleton } from "@/components/ui/skeleton.js";
import { ErrorState } from "@/components/common/ErrorState.js";
import { Badge } from "@/components/ui/badge.js";

export default function WorkerProfilePage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  useTelegramBackButton();

  const { data: worker, isLoading, isError, refetch } = useWorkerDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-56 w-full rounded-md" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !worker) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="animate-fade-in space-y-5 pb-8">
      <div className="px-4 pt-4">
        <ImageGallery images={worker.portfolioImages} />
      </div>

      <div className="space-y-1 px-4">
        <div className="flex items-center gap-1.5">
          <h1 className="text-xl font-bold text-text">
            {worker.firstName} {worker.lastName}
          </h1>
          {worker.isVerified && <BadgeCheck className="h-5 w-5 text-link" />}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">{worker.category.name}</Badge>
          {worker.isVerified && <Badge variant="success">Tasdiqlangan</Badge>}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm text-hint">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {worker.region.name}, {worker.district.name}
            {worker.village ? `, ${worker.village.name}` : ""}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            {worker.experienceYears} yil tajriba
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {worker.workingHoursStart}–{worker.workingHoursEnd}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {worker.views} ko'rishlar
          </span>
        </div>
      </div>

      <div className="px-4">
        <ContactActions worker={worker} />
      </div>

      <div className="space-y-1.5 px-4">
        <h2 className="text-[15px] font-semibold text-text">Haqida</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-text/90">
          {worker.description}
        </p>
      </div>

      <div className="space-y-1.5 px-4">
        <h2 className="text-[15px] font-semibold text-text">Manzil</h2>
        <p className="text-sm text-hint">{worker.address}</p>
      </div>
    </div>
  );
}
