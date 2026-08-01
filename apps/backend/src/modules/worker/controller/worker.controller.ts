import type { Request } from "express";
import { workerService } from "@/modules/worker/service/worker.service.js";
import type {
  RegisterWorkerInput,
  UpdateWorkerInput,
  ListWorkersQuery,
  AdminListWorkersQuery,
  RejectWorkerInput,
  WorkerIdParam,
  GalleryImageParam
} from "@/modules/worker/validators/worker.validators.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { sendSuccess } from "@/shared/response.js";
import { MESSAGES } from "@/constants/messages.js";
import { UnauthorizedError } from "@/errors/UnauthorizedError.js";
import { BadRequestError } from "@/errors/BadRequestError.js";

function getFilesArray(req: Request): Express.Multer.File[] {
  if (Array.isArray(req.files)) return req.files;
  return [];
}

export const workerController = {
  list: asyncHandler<Record<string, string>, unknown, unknown, ListWorkersQuery>(async (req, res) => {
    const result = await workerService.listPublic(req.user?.id, req.query);
    sendSuccess(res, { data: result.items, meta: result.meta, message: MESSAGES.SUCCESS });
  }),

  getById: asyncHandler<WorkerIdParam>(async (req, res) => {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const worker = await workerService.getPublicById(req.params.id, { userId: req.user?.id, ip });
    sendSuccess(res, { data: worker, message: MESSAGES.SUCCESS });
  }),

  register: asyncHandler<Record<string, string>, unknown, RegisterWorkerInput>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const files = getFilesArray(req);
    const worker = await workerService.register(req.user.id, req.user.telegramId, req.body, files);
    sendSuccess(res, { data: worker, message: MESSAGES.WORKER_REGISTERED, status: 201 });
  }),

  getMyWorker: asyncHandler(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const worker = await workerService.getMyWorker(req.user.id);
    sendSuccess(res, { data: worker, message: MESSAGES.SUCCESS });
  }),

  getMyStatus: asyncHandler(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const status = await workerService.getMyStatus(req.user.id);
    sendSuccess(res, { data: status, message: MESSAGES.SUCCESS });
  }),

  updateMyWorker: asyncHandler<Record<string, string>, unknown, UpdateWorkerInput>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const worker = await workerService.updateMyWorker(req.user.id, req.body);
    sendSuccess(res, { data: worker, message: MESSAGES.UPDATED });
  }),

  deleteMyWorker: asyncHandler(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await workerService.deleteMyWorker(req.user.id);
    sendSuccess(res, { data: null, message: MESSAGES.DELETED });
  }),

  addGalleryImages: asyncHandler(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const files = getFilesArray(req);
    if (files.length === 0) throw new BadRequestError("Kamida bitta rasm yuklang");
    const worker = await workerService.addGalleryImages(req.user.id, files);
    sendSuccess(res, { data: worker, message: MESSAGES.UPDATED });
  }),

  removeGalleryImage: asyncHandler<GalleryImageParam>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const worker = await workerService.removeGalleryImage(req.user.id, req.params.imageId);
    sendSuccess(res, { data: worker, message: MESSAGES.DELETED });
  }),

  // ---------- Admin ----------

  adminList: asyncHandler<Record<string, string>, unknown, unknown, AdminListWorkersQuery>(async (req, res) => {
    const result = await workerService.listForAdmin(req.query);
    sendSuccess(res, { data: result.items, meta: result.meta, message: MESSAGES.SUCCESS });
  }),

  approve: asyncHandler<WorkerIdParam>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await workerService.approve(req.user.id, req.params.id);
    sendSuccess(res, { data: null, message: "Usta tasdiqlandi" });
  }),

  reject: asyncHandler<WorkerIdParam, unknown, RejectWorkerInput>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await workerService.reject(req.user.id, req.params.id, req.body.reason);
    sendSuccess(res, { data: null, message: "Usta rad etildi" });
  }),

  block: asyncHandler<WorkerIdParam>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await workerService.block(req.user.id, req.params.id);
    sendSuccess(res, { data: null, message: "Usta bloklandi" });
  }),

  activate: asyncHandler<WorkerIdParam>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await workerService.activate(req.user.id, req.params.id);
    sendSuccess(res, { data: null, message: "Usta faollashtirildi" });
  }),

  removeByAdmin: asyncHandler<WorkerIdParam>(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await workerService.removeByAdmin(req.user.id, req.params.id);
    sendSuccess(res, { data: null, message: MESSAGES.DELETED });
  })
};
