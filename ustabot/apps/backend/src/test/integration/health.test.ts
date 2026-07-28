import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "@/app.js";

/**
 * DIQQAT: bu integration testlar ishlashi uchun Redis va PostgreSQL
 * ishga tushirilgan bo'lishi kerak (masalan `docker compose -f docker/docker-compose.dev.yml up -d postgres redis`).
 * CI muhitida bu GitHub Actions "services" orqali avtomatik ta'minlanadi (Part 12).
 */
describe("Health endpoints (integration)", () => {
  const app = createApp();

  it("GET /health — tizim holatini qaytaradi", async () => {
    const response = await request(app).get("/health");

    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty("data.status");
    expect(response.body).toHaveProperty("data.services");
  });

  it("GET /ready — Docker/K8s readiness probe formatini qaytaradi", async () => {
    const response = await request(app).get("/ready");
    expect([200, 503]).toContain(response.status);
    expect(response.body.data).toHaveProperty("ready");
  });

  it("mavjud bo'lmagan route uchun 404 standart formatda qaytadi", async () => {
    const response = await request(app).get("/api/v1/this-route-does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
    expect(response.body.error).toHaveProperty("requestId");
  });
});
