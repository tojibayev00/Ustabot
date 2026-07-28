import { Router } from "express";
import { searchController } from "@/modules/search/controller/search.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { optionalAuthenticate } from "@/middlewares/auth.middleware.js";
import { listWorkersQuerySchema } from "@/modules/worker/validators/worker.validators.js";

export const searchRouter = Router();

/**
 * @openapi
 * /search/workers:
 *   get:
 *     tags: [Search]
 *     summary: Ustalarni qidirish (filtr, sort, pagination, cache bilan tezlashtirilgan)
 *     security: []
 *     responses:
 *       200: { description: Qidiruv natijalari }
 */
searchRouter.get(
  "/workers",
  optionalAuthenticate,
  validate({ query: listWorkersQuerySchema }),
  searchController.searchWorkers
);
