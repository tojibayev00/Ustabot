export interface ReportResponse {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  worker: { id: string; firstName: string; lastName: string };
  reporter: { id: string; firstName: string; telegramId: string };
  reviewer: { id: string; firstName: string } | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
