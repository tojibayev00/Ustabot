import { defineConfig, devices } from "@playwright/test";

/**
 * E2E testlar Mini App'ning dev serveri ishga tushgan holda bajariladi.
 * `webServer` konfiguratsiyasi CI'da avtomatik `pnpm dev`ni ishga tushiradi.
 *
 * DIQQAT: bu testlar Telegram WebApp obyektisiz (brauzerda to'g'ridan-to'g'ri)
 * ishlaydi, shuning uchun Telegram-ga xos funksiyalar (initData autentifikatsiya)
 * `e2e/mocks/telegramWebApp.ts` orqali brauzerga in'ektsiya qilinadi.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } }
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
