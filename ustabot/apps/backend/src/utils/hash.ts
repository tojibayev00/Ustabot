import { createHash } from "node:crypto";
import { env } from "@/config/env.js";

/**
 * IP manzillarni hech qachon xom holda saqlamaymiz (Part 3: "Never store raw IP addresses").
 * JWT_SECRET tuz (salt) sifatida ishlatiladi — shu tufayli hash bazadan tashqarida
 * qayta hisoblab bo'lmaydi.
 */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}:${env.JWT_SECRET}`).digest("hex");
}
