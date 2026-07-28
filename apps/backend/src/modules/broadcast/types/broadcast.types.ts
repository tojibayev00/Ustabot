export interface BroadcastResponse {
  id: string;
  title: string;
  message: string;
  image: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  successCount: number;
  failedCount: number;
  status: "QUEUED" | "IN_PROGRESS" | "FINISHED";
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
}
