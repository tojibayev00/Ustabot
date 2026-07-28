import { describe, it, expect } from "vitest";
import { normalizePhone, isValidUzbekPhone, maskPhone } from "@/shared/phone.helper.js";

describe("phone.helper", () => {
  describe("normalizePhone", () => {
    it("998 bilan boshlanuvchi raqamni + bilan qaytaradi", () => {
      expect(normalizePhone("998901234567")).toBe("+998901234567");
    });

    it("9 xonali mahalliy raqamga 998 prefiksini qo'shadi", () => {
      expect(normalizePhone("901234567")).toBe("+998901234567");
    });

    it("bo'shliq va tire kabi belgilarni olib tashlaydi", () => {
      expect(normalizePhone("+998 90 123-45-67")).toBe("+998901234567");
    });
  });

  describe("isValidUzbekPhone", () => {
    it("to'g'ri formatdagi raqamni tasdiqlaydi", () => {
      expect(isValidUzbekPhone("+998901234567")).toBe(true);
      expect(isValidUzbekPhone("901234567")).toBe(true);
    });

    it("noto'g'ri uzunlikdagi raqamni rad etadi", () => {
      expect(isValidUzbekPhone("12345")).toBe(false);
      expect(isValidUzbekPhone("+99890123456789")).toBe(false);
    });
  });

  describe("maskPhone", () => {
    it("raqamning o'rtasini yashiradi", () => {
      const masked = maskPhone("+998901234567");
      expect(masked.startsWith("+998 90")).toBe(true);
      expect(masked).toContain("***");
      expect(masked.endsWith("67")).toBe(true);
    });
  });
});
