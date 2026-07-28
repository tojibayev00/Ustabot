import { prisma } from "@/config/database.js";
import type { Prisma } from "@prisma/client";

interface AdminLogInput {
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValue?: Prisma.InputJsonValue;
  newValue?: Prisma.InputJsonValue;
  ipHash?: string;
}

/**
 * Har bir admin amali shu funksiya orqali AdminLog jadvaliga yoziladi.
 * Bu yozuvlar hech qachon edit/delete qilinmaydi (Part 7: "Audit logs cannot be edited/deleted").
 */
export async function recordAdminLog(input: AdminLogInput): Promise<void> {
  await prisma.adminLog.create({
    data: {
      adminId: input.adminId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      oldValue: input.oldValue,
      newValue: input.newValue,
      ipHash: input.ipHash
    }
  });
}
