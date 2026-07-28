import type { ReportWithRelations } from "@/modules/report/repository/report.repository.js";
import type { ReportResponse } from "@/modules/report/types/report.types.js";

export function toReportResponse(report: ReportWithRelations): ReportResponse {
  return {
    id: report.id,
    reason: report.reason,
    description: report.description,
    status: report.status,
    worker: report.worker,
    reporter: report.reporter,
    reviewer: report.reviewer,
    reviewedAt: report.reviewedAt,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt
  };
}
