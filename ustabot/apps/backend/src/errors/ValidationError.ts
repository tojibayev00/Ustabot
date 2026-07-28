import type { ZodError } from "zod";
import { AppError, type ErrorDetail } from "@/errors/AppError.js";

export class ValidationError extends AppError {
  constructor(details: ErrorDetail[]) {
    super("Kiritilgan ma'lumotlar noto'g'ri", 422, "VALIDATION_ERROR", details);
  }

  static fromZodError(error: ZodError): ValidationError {
    const details: ErrorDetail[] = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));
    return new ValidationError(details);
  }
}
