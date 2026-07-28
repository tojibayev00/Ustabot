import { createHash } from "node:crypto";
import { prisma } from "@/config/database.js";
import { workerRepository, type WorkerFilters, type SortOption } from "@/modules/worker/repository/worker.repository.js";
import {
  toWorkerDetailResponse,
  toWorkerListItemResponse,
  toAdminWorkerListItemResponse,
  toWorkerStatusResponse
} from "@/modules/worker/dto/worker.dto.js";
import type {
  RegisterWorkerInput,
  UpdateWorkerInput,
  ListWorkersQuery,
  AdminListWorkersQuery
} from "@/modules/worker/validators/worker.validators.js";
import type {
  WorkerDetailResponse,
  WorkerListItemResponse,
  WorkerStatusResponse,
  AdminWorkerListItemResponse
} from "@/modules/worker/types/worker.types.js";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/shared/cloudinary.helper.js";
import { getOrSetCache, invalidateCacheByPattern, CACHE_TTL } from "@/shared/cache.js";
import { parsePagination, parseSort, buildPaginationMeta, type PaginationMeta } from "@/shared/pagination.js";
import { notifyAdmins, notifyUser } from "@/shared/notify.js";
import { recordAdminLog } from "@/shared/adminLog.js";
import { hashIp } from "@/utils/hash.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { ConflictError } from "@/errors/ConflictError.js";
import { BadRequestError } from "@/errors/BadRequestError.js";
import { ForbiddenError } from "@/errors/ForbiddenError.js";
import { PORTFOLIO_IMAGE_LIMITS } from "@/constants/pagination.js";
import { MESSAGES } from "@/constants/messages.js";

const SORTABLE_FIELDS = ["createdAt", "views", "experienceYears", "firstName"] as const;

/** PATCH /workers/me — shu maydonlardan biri o'zgarsa, status qayta PENDING ga tushadi */
const CRITICAL_FIELDS = [
  "categoryId",
  "regionId",
  "districtId",
  "villageId",
  "description",
  "address",
  "phone"
] as const;

function buildListCacheKey(prefix: string, query: Record<string, unknown>): string {
  const normalized = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");
  const hash = createHash("md5").update(normalized).digest("hex");
  return `${prefix}${hash}`;
}

async function uploadPortfolioFiles(
  files: Express.Multer.File[]
): Promise<{ imageUrl: string; publicId: string; width: number; height: number; size: number }[]> {
  const uploaded = await Promise.all(
    files.map((file) => uploadImageToCloudinary(file.buffer, "portfolio"))
  );
  return uploaded.map((image) => ({
    imageUrl: image.url,
    publicId: image.publicId,
    width: image.width,
    height: image.height,
    size: image.size
  }));
}

export const workerService = {
  // ================= PUBLIC =================

  async listPublic(
    userId: string | undefined,
    query: ListWorkersQuery
  ): Promise<{ items: WorkerListItemResponse[]; meta: PaginationMeta }> {
    const { page, limit, skip } = parsePagination(query);
    const { field, order } = parseSort(query.sort, SORTABLE_FIELDS, "createdAt");

    const filters: WorkerFilters = {
      status: "APPROVED",
      categoryId: query.category,
      regionId: query.region,
      districtId: query.district,
      villageId: query.village,
      minExperience: query.experience,
      search: query.search,
      verified: query.verified
    };

    const cacheKey = buildListCacheKey("workers:list:", { ...query, page, limit, field, order });

    const result = await getOrSetCache(cacheKey, CACHE_TTL.WORKERS_LIST, async () => {
      const sort: SortOption = { field, order };
      const [rows, total] = await Promise.all([
        workerRepository.findMany(filters, skip, limit, sort),
        workerRepository.count(filters)
      ]);
      return {
        items: rows.map(toWorkerListItemResponse),
        meta: buildPaginationMeta(page, limit, total)
      };
    });

    void userId; // kelajakda foydalanuvchiga moslashtirilgan tartiblash uchun zaxira qilingan
    return result;
  },

  async getPublicById(
    id: string,
    viewer: { userId?: string; ip: string }
  ): Promise<WorkerDetailResponse> {
    const worker = await workerRepository.findPublicById(id);
    if (!worker) {
      throw new NotFoundError("Usta topilmadi yoki hali tasdiqlanmagan");
    }

    // Ko'rishlar sonini va tarixini asinxron (bloklamasdan) yozamiz
    void workerRepository.incrementViews(id);
    void prisma.viewHistory.create({
      data: {
        workerId: id,
        viewerId: viewer.userId ?? null,
        ipHash: hashIp(viewer.ip)
      }
    });

    return toWorkerDetailResponse(worker);
  },

  // ================= WORKER (o'z profili) =================

  async register(
    userId: string,
    telegramId: string,
    input: RegisterWorkerInput,
    files: Express.Multer.File[]
  ): Promise<WorkerDetailResponse> {
    const existing = await workerRepository.findByUserId(userId);
    if (existing) {
      throw new ConflictError("Siz allaqachon usta sifatida ro'yxatdan o'tgansiz");
    }

    if (files.length < PORTFOLIO_IMAGE_LIMITS.MIN) {
      throw new BadRequestError(MESSAGES.MIN_PORTFOLIO_IMAGES);
    }
    if (files.length > PORTFOLIO_IMAGE_LIMITS.MAX) {
      throw new BadRequestError(MESSAGES.MAX_PORTFOLIO_IMAGES);
    }

    const phoneOwner = await workerRepository.findByPhone(input.phone);
    if (phoneOwner) {
      throw new ConflictError("Ushbu telefon raqam bilan boshqa usta ro'yxatdan o'tgan");
    }

    const uploadedImages = await uploadPortfolioFiles(files);

    const worker = await workerRepository.createWithPortfolio(
      {
        userId,
        categoryId: input.categoryId,
        regionId: input.regionId,
        districtId: input.districtId,
        villageId: input.villageId,
        firstName: input.firstName,
        lastName: input.lastName,
        age: input.age,
        phone: input.phone,
        telegramUsername: input.telegramUsername,
        description: input.description,
        experienceYears: input.experienceYears,
        address: input.address,
        latitude: input.latitude,
        longitude: input.longitude,
        workingHoursStart: input.workingHoursStart,
        workingHoursEnd: input.workingHoursEnd,
        status: "PENDING"
      },
      uploadedImages
    );

    await prisma.user.update({ where: { id: userId }, data: { role: "WORKER" } });

    await notifyAdmins(
      "Yangi usta arizasi",
      `${input.firstName} ${input.lastName} usta sifatida ro'yxatdan o'tishni so'ramoqda. Ko'rib chiqish uchun Admin Panelga o'ting.`,
      "APPROVAL"
    );

    await notifyUser({
      userId,
      telegramId,
      title: "Arizangiz qabul qilindi",
      message: MESSAGES.WORKER_REGISTERED,
      type: "SYSTEM"
    });

    return toWorkerDetailResponse(worker);
  },

  async getMyWorker(userId: string): Promise<WorkerDetailResponse> {
    const worker = await workerRepository.findByUserId(userId);
    if (!worker) throw new NotFoundError("Sizda usta profili mavjud emas");
    return toWorkerDetailResponse(worker);
  },

  async getMyStatus(userId: string): Promise<WorkerStatusResponse> {
    const worker = await workerRepository.findByUserId(userId);
    if (!worker) throw new NotFoundError("Sizda usta profili mavjud emas");
    return toWorkerStatusResponse(worker);
  },

  /** Muhim maydonlar o'zgarsa, status PENDING'ga qaytadi (Part 5: Business Rules) */
  async updateMyWorker(userId: string, input: UpdateWorkerInput): Promise<WorkerDetailResponse> {
    const existing = await workerRepository.findByUserId(userId);
    if (!existing) throw new NotFoundError("Sizda usta profili mavjud emas");

    if (input.phone && input.phone !== existing.phone) {
      const phoneOwner = await workerRepository.findByPhone(input.phone);
      if (phoneOwner && phoneOwner.id !== existing.id) {
        throw new ConflictError("Ushbu telefon raqam band");
      }
    }

    const isCriticalChange = CRITICAL_FIELDS.some(
      (field) => input[field] !== undefined && input[field] !== existing[field]
    );

    const updated = await workerRepository.update(existing.id, {
      ...input,
      ...(isCriticalChange
        ? { status: "PENDING", isVerified: false, approvedAt: null, approvedBy: null, rejectionReason: null }
        : {})
    });

    await invalidateCacheByPattern("workers:list:*");

    if (isCriticalChange) {
      await notifyAdmins(
        "Usta profili yangilandi",
        `${updated.firstName} ${updated.lastName} muhim ma'lumotlarni o'zgartirdi. Qayta ko'rib chiqish talab qilinadi.`,
        "APPROVAL"
      );
    }

    const detail = await workerRepository.findById(existing.id);
    return toWorkerDetailResponse(detail!);
  },

  async deleteMyWorker(userId: string): Promise<void> {
    const existing = await workerRepository.findByUserId(userId);
    if (!existing) throw new NotFoundError("Sizda usta profili mavjud emas");

    await workerRepository.softDelete(existing.id);
    await invalidateCacheByPattern("workers:list:*");
  },

  // ---------- Gallery ----------

  async addGalleryImages(userId: string, files: Express.Multer.File[]): Promise<WorkerDetailResponse> {
    const existing = await workerRepository.findByUserId(userId);
    if (!existing) throw new NotFoundError("Sizda usta profili mavjud emas");

    if (files.length === 0) {
      throw new BadRequestError("Kamida bitta rasm yuklang");
    }

    const currentCount = await workerRepository.countPortfolioImages(existing.id);
    if (currentCount + files.length > PORTFOLIO_IMAGE_LIMITS.MAX) {
      throw new BadRequestError(MESSAGES.MAX_PORTFOLIO_IMAGES);
    }

    const uploadedImages = await uploadPortfolioFiles(files);
    await workerRepository.addPortfolioImages(existing.id, uploadedImages);
    await invalidateCacheByPattern("workers:list:*");

    const detail = await workerRepository.findById(existing.id);
    return toWorkerDetailResponse(detail!);
  },

  async removeGalleryImage(userId: string, imageId: string): Promise<WorkerDetailResponse> {
    const existing = await workerRepository.findByUserId(userId);
    if (!existing) throw new NotFoundError("Sizda usta profili mavjud emas");

    const image = await workerRepository.findPortfolioImage(imageId, existing.id);
    if (!image) throw new NotFoundError("Rasm topilmadi");

    const currentCount = await workerRepository.countPortfolioImages(existing.id);
    if (currentCount <= PORTFOLIO_IMAGE_LIMITS.MIN) {
      throw new BadRequestError(MESSAGES.MIN_PORTFOLIO_IMAGES);
    }

    await deleteImageFromCloudinary(image.publicId);
    await workerRepository.deletePortfolioImage(imageId);
    await invalidateCacheByPattern("workers:list:*");

    const detail = await workerRepository.findById(existing.id);
    return toWorkerDetailResponse(detail!);
  },

  // ================= ADMIN =================

  async listForAdmin(
    query: AdminListWorkersQuery
  ): Promise<{ items: AdminWorkerListItemResponse[]; meta: PaginationMeta }> {
    const { page, limit, skip } = parsePagination(query);

    const filters: WorkerFilters = {
      status: query.status,
      categoryId: query.category,
      regionId: query.region,
      search: query.search
    };

    const [rows, total] = await Promise.all([
      workerRepository.findManyForAdmin(filters, skip, limit),
      workerRepository.countForAdmin(filters)
    ]);

    return {
      items: rows.map(toAdminWorkerListItemResponse),
      meta: buildPaginationMeta(page, limit, total)
    };
  },

  async approve(adminId: string, workerId: string): Promise<void> {
    const worker = await workerRepository.findById(workerId);
    if (!worker) throw new NotFoundError("Usta topilmadi");

    const previousStatus = worker.status;

    await workerRepository.updateStatus(workerId, {
      status: "APPROVED",
      isVerified: true,
      approvedBy: adminId,
      approvedAt: new Date(),
      rejectionReason: null
    });

    await recordAdminLog({
      adminId,
      action: "WORKER_APPROVED",
      entity: "Worker",
      entityId: workerId,
      oldValue: { status: previousStatus },
      newValue: { status: "APPROVED" }
    });

    await invalidateCacheByPattern("workers:list:*");

    await notifyUser({
      userId: worker.userId,
      telegramId: (await prisma.user.findUniqueOrThrow({ where: { id: worker.userId } })).telegramId,
      title: "Tabriklaymiz!",
      message: MESSAGES.WORKER_APPROVED,
      type: "APPROVAL"
    });
  },

  async reject(adminId: string, workerId: string, reason: string): Promise<void> {
    const worker = await workerRepository.findById(workerId);
    if (!worker) throw new NotFoundError("Usta topilmadi");

    await workerRepository.updateStatus(workerId, {
      status: "REJECTED",
      isVerified: false,
      rejectionReason: reason
    });

    await recordAdminLog({
      adminId,
      action: "WORKER_REJECTED",
      entity: "Worker",
      entityId: workerId,
      newValue: { status: "REJECTED", reason }
    });

    await invalidateCacheByPattern("workers:list:*");

    const user = await prisma.user.findUniqueOrThrow({ where: { id: worker.userId } });
    await notifyUser({
      userId: worker.userId,
      telegramId: user.telegramId,
      title: "Ariza rad etildi",
      message: `${MESSAGES.WORKER_REJECTED}. Sabab: ${reason}`,
      type: "REJECTION"
    });
  },

  async block(adminId: string, workerId: string): Promise<void> {
    const worker = await workerRepository.findById(workerId);
    if (!worker) throw new NotFoundError("Usta topilmadi");

    await workerRepository.updateStatus(workerId, { status: "BLOCKED", isVerified: false });

    await recordAdminLog({
      adminId,
      action: "WORKER_BLOCKED",
      entity: "Worker",
      entityId: workerId,
      oldValue: { status: worker.status },
      newValue: { status: "BLOCKED" }
    });

    await invalidateCacheByPattern("workers:list:*");

    const user = await prisma.user.findUniqueOrThrow({ where: { id: worker.userId } });
    await notifyUser({
      userId: worker.userId,
      telegramId: user.telegramId,
      title: "Profilingiz bloklandi",
      message: MESSAGES.WORKER_BLOCKED,
      type: "SYSTEM"
    });
  },

  async activate(adminId: string, workerId: string): Promise<void> {
    const worker = await workerRepository.findById(workerId);
    if (!worker) throw new NotFoundError("Usta topilmadi");

    if (worker.status !== "BLOCKED") {
      throw new ForbiddenError("Faqat bloklangan ustalarni faollashtirish mumkin");
    }

    await workerRepository.updateStatus(workerId, { status: "APPROVED", isVerified: true });

    await recordAdminLog({
      adminId,
      action: "WORKER_ACTIVATED",
      entity: "Worker",
      entityId: workerId,
      oldValue: { status: "BLOCKED" },
      newValue: { status: "APPROVED" }
    });

    await invalidateCacheByPattern("workers:list:*");
  },

  async removeByAdmin(adminId: string, workerId: string): Promise<void> {
    const worker = await workerRepository.findById(workerId);
    if (!worker) throw new NotFoundError("Usta topilmadi");

    await workerRepository.softDelete(workerId);

    await recordAdminLog({
      adminId,
      action: "WORKER_DELETED",
      entity: "Worker",
      entityId: workerId
    });

    await invalidateCacheByPattern("workers:list:*");
  }
};
