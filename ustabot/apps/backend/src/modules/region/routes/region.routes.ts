import { Router } from "express";
import { regionController } from "@/modules/region/controller/region.controller.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { requirePermission } from "@/middlewares/admin.middleware.js";
import { PERMISSIONS } from "@/constants/permissions.js";
import {
  createRegionSchema,
  updateRegionSchema,
  createDistrictSchema,
  updateDistrictSchema,
  createVillageSchema,
  updateVillageSchema,
  idParamSchema
} from "@/modules/region/validators/region.validators.js";

const requireRegionManage = [authenticate, requirePermission(PERMISSIONS.REGION_MANAGE)];

// ================= /regions =================
export const regionRouter = Router();

/**
 * @openapi
 * /regions:
 *   get:
 *     tags: [Regions]
 *     summary: Barcha viloyatlar ro'yxati
 *     security: []
 *     responses:
 *       200: { description: Viloyatlar ro'yxati }
 */
regionRouter.get("/", regionController.listRegions);

/**
 * @openapi
 * /regions/{id}:
 *   get:
 *     tags: [Regions]
 *     summary: Bitta viloyat
 *     security: []
 *     responses:
 *       200: { description: Viloyat }
 */
regionRouter.get("/:id", validate({ params: idParamSchema }), regionController.getRegion);

/**
 * @openapi
 * /regions/{id}/districts:
 *   get:
 *     tags: [Regions]
 *     summary: Viloyatga tegishli tumanlar
 *     security: []
 *     responses:
 *       200: { description: Tumanlar ro'yxati }
 */
regionRouter.get(
  "/:id/districts",
  validate({ params: idParamSchema }),
  regionController.listDistricts
);

regionRouter.post(
  "/",
  ...requireRegionManage,
  validate({ body: createRegionSchema }),
  regionController.createRegion
);

regionRouter.patch(
  "/:id",
  ...requireRegionManage,
  validate({ params: idParamSchema, body: updateRegionSchema }),
  regionController.updateRegion
);

regionRouter.delete(
  "/:id",
  ...requireRegionManage,
  validate({ params: idParamSchema }),
  regionController.deleteRegion
);

// ================= /districts =================
export const districtRouter = Router();

/**
 * @openapi
 * /districts/{id}/villages:
 *   get:
 *     tags: [Regions]
 *     summary: Tumanga tegishli qishloqlar
 *     security: []
 *     responses:
 *       200: { description: Qishloqlar ro'yxati }
 */
districtRouter.get(
  "/:id/villages",
  validate({ params: idParamSchema }),
  regionController.listVillages
);

districtRouter.post(
  "/",
  ...requireRegionManage,
  validate({ body: createDistrictSchema }),
  regionController.createDistrict
);

districtRouter.patch(
  "/:id",
  ...requireRegionManage,
  validate({ params: idParamSchema, body: updateDistrictSchema }),
  regionController.updateDistrict
);

districtRouter.delete(
  "/:id",
  ...requireRegionManage,
  validate({ params: idParamSchema }),
  regionController.deleteDistrict
);

// ================= /villages =================
export const villageRouter = Router();

villageRouter.post(
  "/",
  ...requireRegionManage,
  validate({ body: createVillageSchema }),
  regionController.createVillage
);

villageRouter.patch(
  "/:id",
  ...requireRegionManage,
  validate({ params: idParamSchema, body: updateVillageSchema }),
  regionController.updateVillage
);

villageRouter.delete(
  "/:id",
  ...requireRegionManage,
  validate({ params: idParamSchema }),
  regionController.deleteVillage
);
