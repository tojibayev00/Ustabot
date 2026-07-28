/**
 * O'zbekiston mobil operatorlari kodlari: 90,91,93,94,95,97,98,99,33,88,20 va h.k.
 * Qat'iy operator ro'yxatini emas, umumiy formatni tekshiramiz: +998 XX XXX XX XX
 */
const UZ_PHONE_REGEX = /^998\d{9}$/;

/**
 * Kiritilgan raqamni "+998901234567" formatiga keltiradi.
 * Bo'sh joy, tire, qavs kabi belgilarni olib tashlaydi.
 */
export function normalizePhone(input: string): string {
  const digitsOnly = input.replace(/\D/g, "");

  if (digitsOnly.startsWith("998")) {
    return `+${digitsOnly}`;
  }

  if (digitsOnly.length === 9) {
    return `+998${digitsOnly}`;
  }

  return `+${digitsOnly}`;
}

export function isValidUzbekPhone(input: string): boolean {
  const normalized = normalizePhone(input).replace("+", "");
  return UZ_PHONE_REGEX.test(normalized);
}

/** Adminlar uchun bo'lmagan kontekstda raqamni qisman yashirish: +998 90 *** ** 67 */
export function maskPhone(phone: string): string {
  const normalized = normalizePhone(phone);
  if (normalized.length < 13) return normalized;

  const prefix = normalized.slice(0, 6); // +998 90
  const suffix = normalized.slice(-2);
  return `${prefix}***${suffix}`;
}
