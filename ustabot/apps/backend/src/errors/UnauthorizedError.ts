import { AppError, type ErrorDetail } from "@/errors/AppError.js";

export class UnauthorizedError extends AppError {
  constructor(message = "Avtorizatsiyadan o'tilmagan", details: ErrorDetail[] = []) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}
