import type { ReportStatus } from "@prisma/client";
import { reportRepository } from "@/modules/report/repository/report.repository.js";
import { toReportResponse } from "@/modules/report/dto/report.dto.js";
import type { CreateReportInput, ListReportsQuery } from "@/modules/report/validators/report.validators.js";
import type { ReportResponse } from "@/modules/report/types/report.types.js";
import { workerRepository } from "@/modules/worker/repository/worker.repository.js";
import { parsePagination, buildPaginationMeta, type PaginationMeta } from "@/shared/pagination.js";
import { notifyAdmins } from "@/shared/notify.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { BadRequestError } from "@/errors/BadRequestError.js";

const MAX_REPORTS_PER_HOUR = 5;

export const reportService = {
  async create(reporterId: string, input: CreateReportInput): Promise<ReportResponse> {
    const worker = await workerRepository.findById(input.workerId);
    if (!worker) {
      throw new NotFoundError("Usta topilmadi");
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await reportRepository.countRecentByReporter(reporterId, oneHourAgo);
    if (recentCount >= MAX_REPORTS_PER_HOUR) {
      throw new BadRequestError("Juda ko'p shikoyat yubordingiz. Birozdan so'ng qayta urinib ko'ring");
    }

    const report = await reportRepository.create({
      workerId: input.workerId,
      reporterId,
      reason: input.reason,
      description: input.description ?? null
    });

    await notifyAdmins(
      "Yangi shikoyat",
      `${worker.firstName} ${worker.lastName} haqida shikoyat tushdi: "${input.reason}"`,
      "REPORT"
    );

    return toReportResponse(report);
  },

  async list(query: ListReportsQuery): Promise<{ items: ReportResponse[]; meta: PaginationMeta }> {
    const { page, limit, skip } = parsePagination(query);

    const filters = {
      status: query.status,
      workerId: query.workerId,
      reporterId: query.reporterId,
      dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
      dateTo: query.dateTo ? new Date(query.dateTo) : undefined
    };

    const [rows, total] = await Promise.all([
      reportRepository.findMany(filters, skip, limit),
      reportRepository.count(filters)
    ]);

    return {
      items: rows.map(toReportResponse),
      meta: buildPaginationMeta(page, limit, total)
    };
  },

  async updateStatus(
    reportId: string,
    moderatorId: string,
    status: ReportStatus
  ): Promise<ReportResponse> {
    const existing = await reportRepository.findById(reportId);
    if (!existing) throw new NotFoundError("Shikoyat topilmadi");

    const updated = await reportRepository.updateStatus(reportId, status, moderatorId);
    return toReportResponse(updated);
  }
};
