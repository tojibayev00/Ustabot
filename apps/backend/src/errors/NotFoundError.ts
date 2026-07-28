import { AppError, type ErrorDetail } from "@/errors/AppError.js";

export class NotFoundError extends AppError {
  constructor(message = "Ma'lumot topilmadi", details: ErrorDetail[] = []) {
    super(message, 404, "NOT_FOUND", details);
  }
}
