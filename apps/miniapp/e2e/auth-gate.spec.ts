import { test, expect } from "@playwright/test";

/**
 * Bu test backend'ga bog'liq emas: Telegram WebApp obyekti mavjud bo'lmaganda
 * ilova to'g'ri xatolik ekranini ko'rsatishini tekshiradi (Part 6: "App Startup Flow").
 */
test.describe("Telegram tashqarisida ochish", () => {
  test("Telegram WebApp bo'lmasa tegishli xatolik ko'rsatiladi", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Kirish imkonsiz")).toBeVisible();
    await expect(page.getByText("Bu ilova faqat Telegram ichida ishlaydi")).toBeVisible();
    await expect(page.getByRole("button", { name: "Qayta urinish" })).toBeVisible();
  });
});
