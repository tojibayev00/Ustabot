import type { User } from "@prisma/client";
import type { AuthenticatedUserInfo } from "@/modules/auth/types/auth.types.js";

/**
 * Prisma User modelini clientga qaytariladigan xavfsiz shaklga o'giradi.
 * Ichki maydonlar (deletedAt, va h.k.) hech qachon API javobiga chiqmaydi.
 */
export function toAuthenticatedUserInfo(
  user: User,
  options: { isWorker: boolean }
): AuthenticatedUserInfo {
  return {
    id: user.id,
    telegramId: user.telegramId,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    photoUrl: user.photoUrl,
    languageCode: user.languageCode,
    role: user.role,
    isWorker: options.isWorker
  };
}
