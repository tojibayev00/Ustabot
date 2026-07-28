import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ValidationError } from "@/errors/ValidationError.js";

export interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Har bir endpoint uchun body/query/params sxemalarini beriladi.
 * Zod muvaffaqiyatli parse qilgan (va transform qilingan) qiymatlar
 * req obyektiga qaytarib yoziladi — shu bilan controller har doim
 * "tozalangan" ma'lumot bilan ishlaydi.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }
      next();
    } catch (error) {
      if (error && typeof error === "object" && "issues" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next(ValidationError.fromZodError(error as any));
        return;
      }
      next(error);
    }
  };
}
