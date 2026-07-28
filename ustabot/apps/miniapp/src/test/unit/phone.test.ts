import { describe, it, expect } from "vitest";
import { isValidUzbekPhone, normalizePhone } from "@/utils/phone.js";

describe("phone utils", () => {
  it("to'g'ri O'zbekiston raqamini tasdiqlaydi", () => {
    expect(isValidUzbekPhone("+998901234567")).toBe(true);
    expect(isValidUzbekPhone("901234567")).toBe(true);
  });

  it("noto'g'ri raqamni rad etadi", () => {
    expect(isValidUzbekPhone("12345")).toBe(false);
  });

  it("raqamni +998 formatiga normalizatsiya qiladi", () => {
    expect(normalizePhone("90 123 45 67")).toBe("+998901234567");
  });
});
