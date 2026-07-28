import { describe, it, expect } from "vitest";
import { hasMinimumRole, ROLE_HIERARCHY } from "@/constants/roles.js";
import { roleHasPermission, PERMISSIONS } from "@/constants/permissions.js";

describe("RBAC", () => {
  describe("hasMinimumRole", () => {
    it("yuqori rol pastroq minimal talabni qondiradi", () => {
      expect(hasMinimumRole("ADMIN", "MODERATOR")).toBe(true);
    });

    it("pastroq rol yuqoriroq talabni qondirmaydi", () => {
      expect(hasMinimumRole("USER", "MODERATOR")).toBe(false);
    });

    it("bir xil rol o'zini qondiradi", () => {
      expect(hasMinimumRole("MODERATOR", "MODERATOR")).toBe(true);
    });

    it("ierarxiya to'g'ri tartibda: USER < WORKER < MODERATOR < ADMIN < SUPER_ADMIN", () => {
      expect(ROLE_HIERARCHY.USER).toBeLessThan(ROLE_HIERARCHY.WORKER);
      expect(ROLE_HIERARCHY.WORKER).toBeLessThan(ROLE_HIERARCHY.MODERATOR);
      expect(ROLE_HIERARCHY.MODERATOR).toBeLessThan(ROLE_HIERARCHY.ADMIN);
      expect(ROLE_HIERARCHY.ADMIN).toBeLessThan(ROLE_HIERARCHY.SUPER_ADMIN);
    });
  });

  describe("roleHasPermission", () => {
    it("USER hech qanday admin ruxsatiga ega emas", () => {
      expect(roleHasPermission("USER", PERMISSIONS.WORKER_APPROVE)).toBe(false);
    });

    it("MODERATOR ustani tasdiqlay oladi, lekin kategoriya boshqara olmaydi", () => {
      expect(roleHasPermission("MODERATOR", PERMISSIONS.WORKER_APPROVE)).toBe(true);
      expect(roleHasPermission("MODERATOR", PERMISSIONS.CATEGORY_MANAGE)).toBe(false);
    });

    it("SUPER_ADMIN barcha ruxsatlarga ega", () => {
      for (const permission of Object.values(PERMISSIONS)) {
        expect(roleHasPermission("SUPER_ADMIN", permission)).toBe(true);
      }
    });

    it("ADMIN sozlamalarni boshqara olmaydi (faqat SUPER_ADMIN)", () => {
      expect(roleHasPermission("ADMIN", PERMISSIONS.SETTINGS_MANAGE)).toBe(false);
    });
  });
});
