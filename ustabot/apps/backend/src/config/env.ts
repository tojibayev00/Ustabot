import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

/**
 * Barcha kerakli environment o'zgaruvchilar shu yerda tasdiqlanadi.
 * Agar biror majburiy qiymat noto'g'ri yoki mavjud bo'lmasa,
 * ilova ishga tushishdan oldin xatolik bilan to'xtaydi (Rule: fail-fast).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_NAME: z.string().default("Ustalar Topish"),
  APP_VERSION: z.string().default("1.0.0"),

  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default("/api/v1"),
  WEBAPP_URL: z.string().url(),
  ADMIN_PANEL_URL: z.string().url().optional(),
  CORS_ORIGINS: z
    .string()
    .default("")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    ),

  DATABASE_URL: z.string().min(1, "DATABASE_URL majburiy"),

  REDIS_URL: z.string().min(1, "REDIS_URL majburiy"),
  REDIS_PREFIX: z.string().default("ustalar:"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET kamida 32 belgidan iborat bo'lishi kerak"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET kamida 32 belgidan iborat bo'lishi kerak"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  TELEGRAM_BOT_TOKEN: z.string().min(1, "TELEGRAM_BOT_TOKEN majburiy"),
  TELEGRAM_BOT_USERNAME: z.string().min(1),
  TELEGRAM_WEBHOOK_URL: z.string().optional().default(""),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional().default(""),
  SUPER_ADMIN_IDS: z
    .string()
    .default("")
    .transform((value) =>
      value
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  CHANNEL_URL: z.string().optional().default(""),
  SUPPORT_USERNAME: z.string().optional().default(""),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_FOLDER: z.string().default("ustalar-topish"),

  /** Bot <-> Backend o'rtasidagi ichki (server-to-server) so'rovlar uchun maxfiy kalit */
  INTERNAL_API_KEY: z.string().min(32, "INTERNAL_API_KEY kamida 32 belgidan iborat bo'lishi kerak"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().positive().default(20),
  RATE_LIMIT_UPLOAD_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_REPORT_MAX: z.coerce.number().int().positive().default(20),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info")
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error("❌ Environment o'zgaruvchilarni tekshirishda xatolik:");
    for (const issue of parsed.error.issues) {
      // eslint-disable-next-line no-console
      console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  return parsed.data;
}

export const env = loadEnv();
