import { z } from "zod";

export const createBroadcastSchema = z
  .object({
    title: z.string().trim().min(3).max(100),
    message: z.string().trim().min(3, "Xabar matni majburiy").max(2000),
    image: z.string().url().optional(),
    buttonText: z.string().trim().max(50).optional(),
    buttonUrl: z.string().url().optional()
  })
  .refine((data) => !(data.buttonText && !data.buttonUrl), {
    message: "buttonUrl ham kiritilishi shart",
    path: ["buttonUrl"]
  })
  .refine((data) => !(data.buttonUrl && !data.buttonText), {
    message: "buttonText ham kiritilishi shart",
    path: ["buttonText"]
  });

export const listBroadcastHistoryQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional()
});

export type CreateBroadcastInput = z.infer<typeof createBroadcastSchema>;
export type ListBroadcastHistoryQuery = z.infer<typeof listBroadcastHistoryQuerySchema>;
