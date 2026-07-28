import "@testing-library/jest-dom/vitest";

// jsdom'da IntersectionObserver mavjud emas — infinite scroll komponentlari uchun mock
class MockIntersectionObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

// @ts-expect-error — global obyektga test uchun mock qo'shilmoqda
globalThis.IntersectionObserver = MockIntersectionObserver;

// VITE_API_BASE_URL kabi import.meta.env qiymatlari testlarda ham kerak
import.meta.env.VITE_API_BASE_URL ||= "https://api.test.local/api/v1";
