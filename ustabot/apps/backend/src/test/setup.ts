/**
 * Barcha testlardan oldin ishga tushadi. `config/env.ts` Zod orqali
 * majburiy environment o'zgaruvchilarni tekshirgani uchun, testlar
 * haqiqiy .env fayliga bog'liq bo'lmasligi uchun shu yerda dummy
 * (lekin formatga mos) qiymatlar beriladi.
 *
 * DIQQAT: bu qiymatlar HECH QACHON production'da ishlatilmaydi —
 * faqat test muhitida, xotira ichida.
 */
process.env.NODE_ENV = "test";
process.env.WEBAPP_URL ??= "https://example.test";
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test_db";
process.env.REDIS_URL ??= "redis://localhost:6379/1";
process.env.JWT_SECRET ??= "test-jwt-secret-must-be-at-least-32-chars-long";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-must-be-at-least-32-chars";
process.env.TELEGRAM_BOT_TOKEN ??= "000000:TEST-TOKEN-FOR-UNIT-TESTS-ONLY";
process.env.TELEGRAM_BOT_USERNAME ??= "test_bot";
process.env.CLOUDINARY_CLOUD_NAME ??= "test-cloud";
process.env.CLOUDINARY_API_KEY ??= "test-api-key";
process.env.CLOUDINARY_API_SECRET ??= "test-api-secret";
process.env.INTERNAL_API_KEY ??= "test-internal-api-key-min-32-characters-long";
