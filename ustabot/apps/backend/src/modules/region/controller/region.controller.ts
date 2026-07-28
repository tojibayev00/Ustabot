import { regionService } from "@/modules/region/service/region.service.js";
import type {
  CreateRegionInput,
  UpdateRegionInput,
  CreateDistrictInput,
  UpdateDistrictInput,
  CreateVillageInput,
  UpdateVillageInput,
  IdParam
} from "@/modules/region/validators/region.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";

export const regionController = {
  listRegions: asyncHandler(async (_req, res) => {
    const regions = await regionService.listRegions();
    sendSuccess(res, { data: regions, message: MESSAGES.SUCCESS });
  }),

  getRegion: asyncHandler<IdParam>(async (req, res) => {
    const region = await regionService.getRegionById(req.params.id);
    sendSuccess(res, { data: region, message: MESSAGES.SUCCESS });
  }),

  createRegion: asyncHandler<unknown, unknown, CreateRegionInput>(async (req, res) => {
    const region = await regionService.createRegion(req.body);
    sendSuccess(res, { data: region, message: MESSAGES.CREATED, status: 201 });
  }),

  updateRegion: asyncHandler<IdParam, unknown, UpdateRegionInput>(async (req, res) => {
    const region = await regionService.updateRegion(req.params.id, req.body);
    sendSuccess(res, { data: region, message: MESSAGES.UPDATED });
  }),

  deleteRegion: asyncHandler<IdParam>(async (req, res) => {
    await regionService.deleteRegion(req.params.id);
    sendSuccess(res, { data: null, message: MESSAGES.DELETED });
  }),

  listDistricts: asyncHandler<IdParam>(async (req, res) => {
    const districts = await regionService.listDistrictsByRegion(req.params.id);
    sendSuccess(res, { data: districts, message: MESSAGES.SUCCESS });
  }),

  createDistrict: asyncHandler<unknown, unknown, CreateDistrictInput>(async (req, res) => {
    const district = await regionService.createDistrict(req.body);
    sendSuccess(res, { data: district, message: MESSAGES.CREATED, status: 201 });
  }),

  updateDistrict: asyncHandler<IdParam, unknown, UpdateDistrictInput>(async (req, res) => {
    const district = await regionService.updateDistrict(req.params.id, req.body);
    sendSuccess(res, { data: district, message: MESSAGES.UPDATED });
  }),

  deleteDistrict: asyncHandler<IdParam>(async (req, res) => {
    await regionService.deleteDistrict(req.params.id);
    sendSuccess(res, { data: null, message: MESSAGES.DELETED });
  }),

  listVillages: asyncHandler<IdParam>(async (req, res) => {
    const villages = await regionService.listVillagesByDistrict(req.params.id);
    sendSuccess(res, { data: villages, message: MESSAGES.SUCCESS });
  }),

  createVillage: asyncHandler<unknown, unknown, CreateVillageInput>(async (req, res) => {
    const village = await regionService.createVillage(req.body);
    sendSuccess(res, { data: village, message: MESSAGES.CREATED, status: 201 });
  }),

  updateVillage: asyncHandler<IdParam, unknown, UpdateVillageInput>(async (req, res) => {
    const village = await regionService.updateVillage(req.params.id, req.body);
    sendSuccess(res, { data: village, message: MESSAGES.UPDATED });
  }),

  deleteVillage: asyncHandler<IdParam>(async (req, res) => {
    await regionService.deleteVillage(req.params.id);
    sendSuccess(res, { data: null, message: MESSAGES.DELETED });
  })
};
