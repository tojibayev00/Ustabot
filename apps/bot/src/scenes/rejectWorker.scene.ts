/**
 * Ustani rad etish ko'p bosqichli oqim: admin "❌ Rad etish" tugmasini bosadi →
 * bot sabab matnini so'raydi → admin javob yozadi → backend'ga yuboriladi.
 *
 * To'liq conversation-plugin o'rniga soddalashtirilgan xotiradagi (in-memory)
 * holat boshqaruvi ishlatiladi: har bir admin uchun bitta kutilayotgan
 * rad etish so'rovi saqlanadi (adminTelegramId -> workerId).
 *
 * DIQQAT: bu holat faqat process xotirasida saqlanadi. Bot qayta ishga tushsa
 * (deploy/restart), kutilayotgan so'rovlar yo'qoladi — bu qabul qilingan holat,
 * chunki admin shunchaki tugmani qayta bosishi kifoya.
 */
const pendingRejections = new Map<number, string>();

export function startRejectFlow(adminTelegramId: number, workerId: string): void {
  pendingRejections.set(adminTelegramId, workerId);
}

export function getPendingRejection(adminTelegramId: number): string | undefined {
  return pendingRejections.get(adminTelegramId);
}

export function clearRejectFlow(adminTelegramId: number): void {
  pendingRejections.delete(adminTelegramId);
}
