import { describe, it, expect } from "vitest";
import { cn } from "@/utils/cn.js";

describe("cn", () => {
  it("bir nechta class nomlarini birlashtiradi", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("falsy qiymatlarni e'tiborsiz qoldiradi", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("Tailwind ziddiyatli klasslarni to'g'ri birlashtiradi (oxirgisi ustunlik qiladi)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
