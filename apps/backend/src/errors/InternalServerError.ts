import { AppError } from "@/errors/AppError.js";

export class InternalServerError extends AppError {
  constructor(message = "Server xatoligi yuz berdi") {
    super(message, 500, "INTERNAL_SERVER_ERROR", [], false);
  }
}
