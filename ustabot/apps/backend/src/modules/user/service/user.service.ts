import { userRepository } from "@/modules/user/repository/user.repository.js";
import { toUserProfileResponse } from "@/modules/user/dto/user.dto.js";
import type { UpdateProfileInput } from "@/modules/user/validators/user.validators.js";
import type { UserProfileResponse } from "@/modules/user/types/user.types.js";
import { revokeAllUserSessions } from "@/shared/sessionStore.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { ConflictError } from "@/errors/ConflictError.js";

export const userService = {
  async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await userRepository.findByIdWithWorker(userId);
    if (!user) throw new NotFoundError("Foydalanuvchi topilmadi");
    return toUserProfileResponse(user, { isWorker: user.worker !== null });
  },

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfileResponse> {
    const user = await userRepository.findByIdWithWorker(userId);
    if (!user) throw new NotFoundError("Foydalanuvchi topilmadi");

    if (input.username && input.username !== user.username) {
      const existing = await userRepository.findByUsername(input.username);
      if (existing) {
        throw new ConflictError("Ushbu username allaqachon band");
      }
    }

    const updated = await userRepository.update(userId, {
      ...(input.username !== undefined ? { username: input.username } : {}),
      ...(input.languageCode !== undefined ? { languageCode: input.languageCode } : {}),
      ...(input.photoUrl !== undefined ? { photoUrl: input.photoUrl } : {}),
      ...(input.notificationsEnabled !== undefined
        ? { notificationsEnabled: input.notificationsEnabled }
        : {})
    });

    return toUserProfileResponse(updated, { isWorker: user.worker !== null });
  },

  /** Hisobni soft-delete qiladi va barcha faol sessionlarni bekor qiladi */
  async deleteAccount(userId: string): Promise<void> {
    const user = await userRepository.findByIdWithWorker(userId);
    if (!user) throw new NotFoundError("Foydalanuvchi topilmadi");

    await userRepository.softDelete(userId);
    await revokeAllUserSessions(userId);
  }
};
