export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sortOrder: number;
  isVisible: boolean;
  workerCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
