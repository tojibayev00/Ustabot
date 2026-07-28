export interface PortfolioImageResponse {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: Date;
}

/** Qidiruv natijalarida ko'rsatiladigan qisqa karta ma'lumoti */
export interface WorkerListItemResponse {
  id: string;
  firstName: string;
  lastName: string;
  categoryName: string;
  categorySlug: string;
  regionName: string;
  districtName: string;
  experienceYears: number;
  isVerified: boolean;
  views: number;
  coverImageUrl: string | null;
  createdAt: Date;
}

/** To'liq profil sahifasi uchun */
export interface WorkerDetailResponse {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  telegramUsername: string | null;
  description: string;
  experienceYears: number;
  address: string;
  latitude: number;
  longitude: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  status: string;
  isVerified: boolean;
  views: number;
  category: { id: string; name: string; slug: string; icon: string | null };
  region: { id: string; name: string };
  district: { id: string; name: string };
  village: { id: string; name: string } | null;
  portfolioImages: PortfolioImageResponse[];
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkerStatusResponse {
  status: string;
  isVerified: boolean;
  rejectionReason: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
}

/** Admin panel — jadval qatori */
export interface AdminWorkerListItemResponse extends WorkerListItemResponse {
  status: string;
  phone: string;
  userId: string;
}
