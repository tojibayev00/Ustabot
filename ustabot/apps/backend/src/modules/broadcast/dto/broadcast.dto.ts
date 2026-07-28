import type { BroadcastHistory } from "@prisma/client";
import type { BroadcastResponse } from "@/modules/broadcast/types/broadcast.types.js";

function resolveStatus(broadcast: BroadcastHistory): BroadcastResponse["status"] {
  if (broadcast.finishedAt) return "FINISHED";
  if (broadcast.startedAt) return "IN_PROGRESS";
  return "QUEUED";
}

export function toBroadcastResponse(broadcast: BroadcastHistory): BroadcastResponse {
  return {
    id: broadcast.id,
    title: broadcast.title,
    message: broadcast.message,
    image: broadcast.image,
    buttonText: broadcast.buttonText,
    buttonUrl: broadcast.buttonUrl,
    successCount: broadcast.successCount,
    failedCount: broadcast.failedCount,
    status: resolveStatus(broadcast),
    startedAt: broadcast.startedAt,
    finishedAt: broadcast.finishedAt,
    createdAt: broadcast.createdAt
  };
}
