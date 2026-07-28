import { describe, it, expect } from "vitest";
import {
  AppError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
  ValidationError,
  InternalServerError
} from "@/errors/index.js";
import { z } from "zod";

describe("Error classes", () => {
  it("AppError to'g'ri status/code/message saqlaydi", () => {
    const error = new AppError("Test xabari", 418, "TEAPOT");
    expect(error.status).toBe(418);
    expect(error.code).toBe("TEAPOT");
    expect(error.message).toBe("Test xabari");
    expect(error.isOperational).toBe(true);
  });

  it("BadRequestError 400 statusga ega", () => {
    expect(new BadRequestError().status).toBe(400);
  });

  it("UnauthorizedError 401 statusga ega", () => {
    expect(new UnauthorizedError().status).toBe(401);
  });

  it("ForbiddenError 403 statusga ega", () => {
    expect(new ForbiddenError().status).toBe(403);
  });

  it("NotFoundError 404 statusga ega", () => {
    expect(new NotFoundError().status).toBe(404);
  });

  it("ConflictError 409 statusga ega", () => {
    expect(new ConflictError().status).toBe(409);
  });

  it("InternalServerError operational emas (isOperational=false)", () => {
    const error = new InternalServerError();
    expect(error.status).toBe(500);
    expect(error.isOperational).toBe(false);
  });

  it("ValidationError.fromZodError Zod xatolarini to'g'ri formatlaydi", () => {
    const schema = z.object({ age: z.number().min(18) });
    const result = schema.safeParse({ age: 5 });

    expect(result.success).toBe(false);
    if (!result.success) {
      const error = ValidationError.fromZodError(result.error);
      expect(error.status).toBe(422);
      expect(error.details.length).toBeGreaterThan(0);
      expect(error.details[0]?.field).toBe("age");
    }
  });
});
