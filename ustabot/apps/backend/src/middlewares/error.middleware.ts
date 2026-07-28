import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "@/errors/AppError.js";
import { ValidationError } from "@/errors/ValidationError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { InternalServerError } from "@/errors/InternalServerError.js";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";

/**
 * Prisma xatoliklarini bizning AppError formatimizga o'giradi.
 * Xom Prisma xatoligi hech qachon clientga qaytarilmaydi (Rule: never return raw Prisma errors).
 */
function normalizePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case "P2002": {
      const target = (error.meta?.target as string[] | undefined)?.join(", ") ?? "maydon";
      return new ConflictError(`Ushbu ${target} allaqachon band qilingan`);
    }
    case "P2025":
      return new NotFoundError("Bog'liq ma'lumot topilmadi");
    case "P2003":
      return new ConflictError("Bog'liq ma'lumotlar mavjudligi sababli amalni bajarib bo'lmadi");
    default:
      return new InternalServerError();
  }
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return ValidationError.fromZodError(error);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return normalizePrismaError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new InternalServerError("Ma'lumotlar bazasiga so'rov noto'g'ri shakllantirildi");
  }

  return new InternalServerError();
}

/**
 * Express'dagi eng oxirgi middleware. `app.ts`da barcha route'lardan keyin ulanadi.
 * Har bir xatolik uchun requestId, timestamp va status kod qo'shib, bir xil formatda qaytaradi.
 */
export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const appError = normalizeError(error);

  const logPayload = {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    status: appError.status,
    code: appError.code,
    userId: req.user?.id
  };

  if (appError.isOperational) {
    logger.warn({ ...logPayload }, appError.message);
  } else {
    logger.error({ ...logPayload, err: error }, appError.message);
  }

  res.status(appError.status).json({
    success: false,
    error: {
      message: appError.message,
      status: appError.status,
      code: appError.code,
      details: appError.details,
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
      ...(env.NODE_ENV === "development" && error instanceof Error
        ? { stack: error.stack }
        : {})
    }
  });
}

/** 404 — route topilmadi. Barcha route'lardan keyin, errorMiddleware'dan oldin ulanadi. */
export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route topilmadi: ${req.method} ${req.originalUrl}`));
}
