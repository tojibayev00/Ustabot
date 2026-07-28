import { describe, it, expect } from "vitest";
import { parsePagination, parseSort, buildPaginationMeta } from "@/shared/pagination.js";
import { PAGINATION } from "@/constants/pagination.js";

describe("pagination", () => {
  describe("parsePagination", () => {
    it("standart qiymatlarni qaytaradi, qiymat berilmasa", () => {
      const result = parsePagination({});
      expect(result.page).toBe(PAGINATION.DEFAULT_PAGE);
      expect(result.limit).toBe(PAGINATION.DEFAULT_LIMIT);
      expect(result.skip).toBe(0);
    });

    it("skip'ni page/limit asosida to'g'ri hisoblaydi", () => {
      const result = parsePagination({ page: "3", limit: "10" });
      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(20);
    });

    it("MAX_LIMIT'dan oshган qiymatni cheklaydi (Rule: never return unlimited data)", () => {
      const result = parsePagination({ limit: "1000" });
      expect(result.limit).toBe(PAGINATION.MAX_LIMIT);
    });

    it("manfiy yoki noto'g'ri page qiymatini 1 ga tenglashtiradi", () => {
      const result = parsePagination({ page: "-5" });
      expect(result.page).toBe(1);
    });
  });

  describe("parseSort", () => {
    const allowed = ["createdAt", "views"] as const;

    it("ruxsat etilmagan maydon berilsa, default qiymatga qaytadi", () => {
      const result = parseSort("hackerField:asc", allowed, "createdAt");
      expect(result.field).toBe("createdAt");
    });

    it("to'g'ri field:order juftligini tahlil qiladi", () => {
      const result = parseSort("views:asc", allowed, "createdAt");
      expect(result).toEqual({ field: "views", order: "asc" });
    });

    it("sort berilmasa standart 'desc' tartibni qaytaradi", () => {
      const result = parseSort(undefined, allowed, "createdAt");
      expect(result).toEqual({ field: "createdAt", order: "desc" });
    });
  });

  describe("buildPaginationMeta", () => {
    it("hasNextPage/hasPrevPage to'g'ri hisoblanadi", () => {
      const meta = buildPaginationMeta(2, 10, 25);
      expect(meta.totalPages).toBe(3);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPrevPage).toBe(true);
    });

    it("bo'sh natija uchun totalPages kamida 1 bo'ladi", () => {
      const meta = buildPaginationMeta(1, 10, 0);
      expect(meta.totalPages).toBe(1);
      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPrevPage).toBe(false);
    });
  });
});
