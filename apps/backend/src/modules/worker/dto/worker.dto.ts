import type { Worker } from "@prisma/client";
import type {
  WorkerWithDetails,
  WorkerListRow
} from "@/modules/worker/repository/worker.repository.js";
import type {
  WorkerDetailResponse,
  WorkerListItemResponse,
  WorkerStatusResponse,
  AdminWorkerListItemResponse,
  PortfolioImageResponse
} from "@/modules/worker/types/worker.types.js";

export function toPortfolioImageResponse(image: {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: Date;
}): PortfolioImageResponse {
  return {
    id: image.id,
    imageUrl: image.imageUrl,
    width: image.width,
    height: image.height,
    createdAt: image.createdAt
  };
}

export function toWorkerListItemResponse(worker: WorkerListRow): WorkerListItemResponse {
  return {
    id: worker.id,
    firstName: worker.firstName,
    lastName: worker.lastName,
    categoryName: worker.category.name,
    categorySlug: worker.category.slug,
    regionName: worker.region.name,
    districtName: worker.district.name,
    experienceYears: worker.experienceYears,
    isVerified: worker.isVerified,
    views: worker.views,
    coverImageUrl: worker.portfolioImages[0]?.imageUrl ?? null,
    createdAt: worker.createdAt
  };
}

export function toAdminWorkerListItemResponse(worker: WorkerListRow): AdminWorkerListItemResponse {
  return {
    ...toWorkerListItemResponse(worker),
    status: worker.status,
    phone: worker.phone,
    userId: worker.userId
  };
}

export function toWorkerDetailResponse(worker: WorkerWithDetails): WorkerDetailResponse {
  return {
    id: worker.id,
    firstName: worker.firstName,
    lastName: worker.lastName,
    age: worker.age,
    phone: worker.phone,
    telegramUsername: worker.telegramUsername,
    description: worker.description,
    experienceYears: worker.experienceYears,
    address: worker.address,
    latitude: worker.latitude,
    longitude: worker.longitude,
    workingHoursStart: worker.workingHoursStart,
    workingHoursEnd: worker.workingHoursEnd,
    status: worker.status,
    isVerified: worker.isVerified,
    views: worker.views,
    category: worker.category,
    region: worker.region,
    district: worker.district,
    village: worker.village,
    portfolioImages: worker.portfolioImages.map(toPortfolioImageResponse),
    rejectionReason: worker.rejectionReason,
    createdAt: worker.createdAt,
    updatedAt: worker.updatedAt
  };
}

export function toWorkerStatusResponse(worker: Worker): WorkerStatusResponse {
  return {
    status: worker.status,
    isVerified: worker.isVerified,
    rejectionReason: worker.rejectionReason,
    submittedAt: worker.createdAt,
    reviewedAt: worker.approvedAt
  };
}
