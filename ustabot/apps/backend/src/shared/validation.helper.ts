/** Ortiqcha bo'shliqlarni olib tashlash va bitta bo'shliqqa keltirish */
export function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

/** Qidiruv uchun matnni normalizatsiya qilish: kichik harf, ortiqcha bo'shliqsiz */
export function normalizeForSearch(input: string): string {
  return normalizeWhitespace(input).toLowerCase();
}

/** Kategoriya/region nomidan URL-friendly slug yaratish (lotin harflarga asoslangan) */
export function toSlug(input: string): string {
  const cyrillicToLatinMap: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "j",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "x",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "i",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya"
  };

  const transliterated = input
    .toLowerCase()
    .split("")
    .map((char) => cyrillicToLatinMap[char] ?? char)
    .join("");

  return transliterated
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}
