import { AppError, type ErrorDetail } from "@/errors/AppError.js";

export class ForbiddenError extends AppError {
  constructor(message = "Ushbu amal uchun ruxsatingiz yo'q", details: ErrorDetail[] = []) {
    super(message, 403, "FORBIDDEN", details);
  }
}
