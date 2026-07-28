import { AppError, type ErrorDetail } from "@/errors/AppError.js";

export class ConflictError extends AppError {
  constructor(message = "Ushbu ma'lumot allaqachon mavjud", details: ErrorDetail[] = []) {
    super(message, 409, "CONFLICT", details);
  }
}
