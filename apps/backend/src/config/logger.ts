import pino from "pino";
import { env } from "@/config/env.js";

/**
 * Global logger instance.
 * Development'da chiroyli formatlangan, production'da JSON formatda log yozadi.
 *
 * DIQQAT: hech qachon quyidagilarni logga yozmang:
 * tokenlar, parollar, telefon raqamlar, Cloudinary maxfiy kalitlari.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    app: env.APP_NAME,
    env: env.NODE_ENV
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.token",
      "*.accessToken",
      "*.refreshToken",
      "*.phone",
      "*.secret"
    ],
    censor: "[REDACTED]"
  },
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:HH:MM:ss",
            ignore: "pid,hostname"
          }
        }
      : undefined
});

export type Logger = typeof logger;
