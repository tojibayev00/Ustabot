import swaggerJsdoc from "swagger-jsdoc";
import { env } from "@/config/env.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Ustalar Topish API",
      version: env.APP_VERSION,
      description:
        "Ustalar Topish — Telegram Bot va Telegram Mini App uchun REST API hujjatlari.",
      contact: {
        name: "Ustalar Topish Team"
      }
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
        description: "Local development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
            meta: { type: "object" },
            message: { type: "string", example: "Success" }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                message: { type: "string" },
                status: { type: "number" },
                code: { type: "string" },
                details: { type: "array", items: { type: "object" } }
              }
            }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/modules/**/routes/*.ts", "./src/modules/**/*.routes.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
