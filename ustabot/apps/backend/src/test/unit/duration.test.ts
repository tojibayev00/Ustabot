import { describe, it, expect } from "vitest";
import { parseDurationToSeconds } from "@/utils/duration.js";

describe("parseDurationToSeconds", () => {
  it("daqiqani to'g'ri soniyaga o'giradi", () => {
    expect(parseDurationToSeconds("15m")).toBe(900);
  });

  it("kunni to'g'ri soniyaga o'giradi", () => {
    expect(parseDurationToSeconds("30d")).toBe(30 * 24 * 60 * 60);
  });

  it("soatni to'g'ri soniyaga o'giradi", () => {
    expect(parseDurationToSeconds("2h")).toBe(7200);
  });

  it("noto'g'ri formatda xatolik tashlaydi", () => {
    expect(() => parseDurationToSeconds("abc")).toThrow();
  });
});
