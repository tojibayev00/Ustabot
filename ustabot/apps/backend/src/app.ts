import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { env } from "@/config/env.js";
import { swaggerSpec } from "@/config/swagger.js";
import { requestIdMiddleware } from "@/middlewares/requestId.middleware.js";
import { requestLoggerMiddleware } from "@/middlewares/logger.middleware.js";
import { generalRateLimiter } from "@/middlewares/rateLimit.middleware.js";
import { errorMiddleware, notFoundMiddleware } from "@/middlewares/error.middleware.js";
import { healthRouter } from "@/routes/health.routes.js";
import { apiRouter } from "@/routes/index.js";

/**
 * Request Flow (Part 4 spesifikatsiyasiga muvofiq):
 *
 * Client
 *  → requestId → logger → rate limit → helmet → cors
 *  → (auth/validation — har bir route ichida)
 *  → route handler → error middleware → client
 */
export function createApp(): Application {
  const app = express();

  // Reverse-proxy (Nginx/Railway/Render) ortida to'g'ri IP aniqlash uchun
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  // ---------- Global middlewares ----------
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
          connectSrc: ["'self'"]
        }
      },
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );

  app.use(
    cors({
      origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : true,
      credentials: true
    })
  );

  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());

  app.use(generalRateLimiter);

  // ---------- Health checks (prefixsiz, load balancer uchun) ----------
  app.use(healthRouter);

  // ---------- Swagger hujjatlari ----------
  app.use(`${env.API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // ---------- API v1 ----------
  app.use(env.API_PREFIX, apiRouter);

  // ---------- 404 va xatolik handler ----------
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
