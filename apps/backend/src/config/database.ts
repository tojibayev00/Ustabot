import { PrismaClient } from "@prisma/client";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

/**
 * Development rejimida `tsx watch` fayllarni qayta yuklaganda
 * bir nechta PrismaClient instance yaratilib ketmasligi uchun
 * global obyektga saqlanadi.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  // DIQQAT: log massivi har doim bir xil ("event") shaklda bo'lishi kerak —
  // aks holda TypeScript $on("query"/"error") metodlarining turini to'g'ri
  // chiqara olmaydi. Development/production farqi callback ichida hal qilinadi.
  return new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "warn" },
      { emit: "event", level: "error" }
    ]
  });
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
