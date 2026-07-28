import { z } from "zod";

export const telegramAuthSchema = z.object({
  initData: z.string().min(1, "initData majburiy")
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken majburiy")
});

export type TelegramAuthInput = z.infer<typeof telegramAuthSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
