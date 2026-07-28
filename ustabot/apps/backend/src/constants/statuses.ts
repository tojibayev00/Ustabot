export const WORKER_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  BLOCKED: "BLOCKED"
} as const;
export type WorkerStatus = (typeof WORKER_STATUS)[keyof typeof WORKER_STATUS];

export const REPORT_STATUS = {
  PENDING: "PENDING",
  REVIEWING: "REVIEWING",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED"
} as const;
export type ReportStatus = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];

export const NOTIFICATION_TYPE = {
  SYSTEM: "SYSTEM",
  APPROVAL: "APPROVAL",
  REJECTION: "REJECTION",
  REPORT: "REPORT",
  BROADCAST: "BROADCAST"
} as const;
export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
