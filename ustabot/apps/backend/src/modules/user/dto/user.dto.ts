import type { User } from "@prisma/client";
import type { UserProfileResponse } from "@/modules/user/types/user.types.js";

export function toUserProfileResponse(
  user: User,
  options: { isWorker: boolean }
): UserProfileResponse {
  return {
    id: user.id,
    telegramId: user.telegramId,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    languageCode: user.languageCode,
    photoUrl: user.photoUrl,
    role: user.role,
    notificationsEnabled: user.notificationsEnabled,
    isWorker: options.isWorker,
    createdAt: user.createdAt,
    lastSeenAt: user.lastSeenAt
  };
}
