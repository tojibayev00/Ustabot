import { describe, it, expect } from "vitest";
import { normalizeWhitespace, normalizeForSearch, toSlug, isValidUuid } from "@/shared/validation.helper.js";

describe("validation.helper", () => {
  describe("normalizeWhitespace", () => {
    it("ortiqcha bo'shliqlarni bitta bo'shliqqa keltiradi", () => {
      expect(normalizeWhitespace("  Salom    Dunyo  ")).toBe("Salom Dunyo");
    });
  });

  describe("normalizeForSearch", () => {
    it("matnni kichik harfga o'giradi va bo'shliqlarni tozalaydi", () => {
      expect(normalizeForSearch("  SANTEXNIK  Usta ")).toBe("santexnik usta");
    });
  });

  describe("toSlug", () => {
    it("lotin harflaridan to'g'ri slug yaratadi", () => {
      expect(toSlug("Duradgor Mebel Usta")).toBe("duradgor-mebel-usta");
    });

    it("kirill harflarini transliteratsiya qiladi", () => {
      expect(toSlug("Сантехник")).toBe("santexnik");
    });

    it("maxsus belgilarni olib tashlaydi", () => {
      expect(toSlug("Santexnik & Elektrik!!!")).toBe("santexnik-elektrik");
    });
  });

  describe("isValidUuid", () => {
    it("to'g'ri UUID v4 formatini tasdiqlaydi", () => {
      expect(isValidUuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    });

    it("noto'g'ri formatni rad etadi", () => {
      expect(isValidUuid("not-a-uuid")).toBe(false);
    });
  });
});
