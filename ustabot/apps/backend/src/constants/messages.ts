/**
 * Tizim bo'ylab ishlatiladigan standart xabarlar.
 * Barcha foydalanuvchiga ko'rinadigan matnlar o'zbek tilida.
 */
export const MESSAGES = {
  SUCCESS: "Muvaffaqiyatli bajarildi",
  CREATED: "Muvaffaqiyatli yaratildi",
  UPDATED: "Muvaffaqiyatli yangilandi",
  DELETED: "Muvaffaqiyatli o'chirildi",

  VALIDATION_ERROR: "Kiritilgan ma'lumotlar noto'g'ri",
  UNAUTHORIZED: "Avtorizatsiyadan o'tilmagan",
  FORBIDDEN: "Ushbu amal uchun ruxsatingiz yo'q",
  NOT_FOUND: "Ma'lumot topilmadi",
  CONFLICT: "Ushbu ma'lumot allaqachon mavjud",
  INTERNAL_ERROR: "Server xatoligi yuz berdi",
  TOO_MANY_REQUESTS: "So'rovlar soni chegaradan oshib ketdi. Birozdan so'ng qayta urinib ko'ring",

  WORKER_REGISTERED: "Arizangiz qabul qilindi. Moderatsiyadan so'ng profilingiz faollashadi",
  WORKER_APPROVED: "Profilingiz tasdiqlandi va endi qidiruvda ko'rinadi",
  WORKER_REJECTED: "Afsuski, profilingiz rad etildi",
  WORKER_BLOCKED: "Profilingiz vaqtincha bloklandi",

  REPORT_SUBMITTED: "Shikoyatingiz qabul qilindi. Tez orada ko'rib chiqiladi",

  USER_BLOCKED: "Foydalanuvchi bloklangan",

  TELEGRAM_AUTH_FAILED: "Telegram orqali autentifikatsiya muvaffaqiyatsiz tugadi",

  MIN_PORTFOLIO_IMAGES: "Kamida 3 ta portfolio rasm yuklash shart",
  MAX_PORTFOLIO_IMAGES: "Ko'pi bilan 20 ta portfolio rasm yuklash mumkin"
} as const;
