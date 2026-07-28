import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "@/app.js";

describe("POST /api/v1/auth/telegram (integration)", () => {
  const app = createApp();

  it("initData bo'lmasa 422 validatsiya xatoligini qaytaradi", async () => {
    const response = await request(app).post("/api/v1/auth/telegram").send({});

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("yaroqsiz (soxta) initData uchun 401 qaytaradi", async () => {
    const response = await request(app)
      .post("/api/v1/auth/telegram")
      .send({ initData: "user=fake&hash=invalidhash&auth_date=1700000000" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("refresh token bo'lmasa /auth/refresh 422 qaytaradi", async () => {
    const response = await request(app).post("/api/v1/auth/refresh").send({});
    expect(response.status).toBe(422);
  });

  it("token'siz /auth/me so'rovi 401 qaytaradi", async () => {
    const response = await request(app).get("/api/v1/auth/me");
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });
});
