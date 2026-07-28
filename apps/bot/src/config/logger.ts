import pino from "pino";
import { env } from "@/config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { app: "ustalar-bot", env: env.NODE_ENV },
  transport:
    env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:HH:MM:ss", ignore: "pid,hostname" } }
      : undefined
});
