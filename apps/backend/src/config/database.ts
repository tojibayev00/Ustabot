import { PrismaClient } from "@prisma/client";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

function createPrismaClient() {
  // DIQQAT: qaytish turini qo'lda "PrismaClient" deb yozib qo'ymang —
  // shunday qilinsa Prisma'ning log-event generic turi yo'qoladi va
  // $on("query"/"error") "never" xatoligini beradi. Shu sababli funksiya
  // qaytish turi TypeScript'ning o'zi orqali xulosa chiqarilishiga (inference)
  // qoldirilgan.
  return new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "warn" },
      { emit: "event", level: "error" }
    ]
  });
}

/**
 * Development rejimida `tsx watch` fayllarni qayta yuklaganda
 * bir nechta PrismaClient instance yaratilib ketmasligi uchun
 * global obyektga saqlanadi.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (env.NODE_ENV === "development") {
  globalThis.__prisma = prisma;
}

prisma.$on("query", (event: { query: string; params: string; duration: number }) => {
  if (env.NODE_ENV !== "development") return;
  logger.debug(
    { duration: event.duration, params: event.params },
    `Prisma query: ${event.query}`
  );
});

prisma.$on("error", (event: { message: string }) => {
  logger.error({ err: event }, "Prisma xatoligi");
});

/**
 * Database ulanishini tekshirish. server.ts startup bosqichida chaqiriladi.
 * Agar ulanmasa, ilova ishga tushmasligi kerak.
 */
export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  logger.info("✅ PostgreSQL bilan ulanish o'rnatildi");
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info("PostgreSQL bilan ulanish yopildi");
}

export async function isDatabaseHealthy(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error({ err: error }, "Database health check muvaffaqiyatsiz");
    return false;
  }
}
