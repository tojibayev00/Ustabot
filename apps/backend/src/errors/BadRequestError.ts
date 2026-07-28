import { AppError, type ErrorDetail } from "@/errors/AppError.js";

export class BadRequestError extends AppError {
  constructor(message = "Noto'g'ri so'rov", details: ErrorDetail[] = []) {
    super(message, 400, "BAD_REQUEST", details);
  }
}
