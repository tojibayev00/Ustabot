import { createHmac } from "node:crypto";
import { telegramConfig } from "@/config/telegram.js";

export interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
}

export interface ParsedInitData {
  user: TelegramWebAppUser;
  authDate: number;
  queryId?: string;
}

/**
 * Telegram Mini App initData'ni rasmiy algoritm bo'yicha tekshiradi:
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 *
 * 1. "hash" maydonini ajratib olamiz.
 * 2. Qolgan maydonlarni kalit bo'yicha alifbo tartibida saralab, "key=value" ko'rinishida "\n" bilan birlashtiramiz.
 * 3. secret_key = HMAC_SHA256("WebAppData", bot_token)
 * 4. hash' = HMAC_SHA256(data_check_string, secret_key) — hex ko'rinishida
 * 5. hash' === hash bo'lsa, ma'lumot Telegram tomonidan yuborilgan va o'zgartirilmagan.
 *
 * Bu funksiya HECH QACHON frontend yuborgan foydalanuvchi ma'lumotiga ishonmaydi —
 * faqat shu tekshiruvdan o'tgan initData'dagi "user" maydoni haqiqiy hisoblanadi.
 */
export function verifyTelegramInitData(initData: string): ParsedInitData | null {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");

  if (!hash) {
    return null;
  }

  params.delete("hash");

  const dataCheckEntries: string[] = [];
  for (const [key, value] of params.entries()) {
    dataCheckEntries.push(`${key}=${value}`);
  }
  dataCheckEntries.sort();
  const dataCheckString = dataCheckEntries.join("\n");

  const secretKey = createHmac("sha256", "WebAppData").update(telegramConfig.botToken).digest();
  const computedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (computedHash !== hash) {
    return null;
  }

  const authDateRaw = params.get("auth_date");
  const authDate = authDateRaw ? Number.parseInt(authDateRaw, 10) : 0;

  const ageSeconds = Math.floor(Date.now() / 1000) - authDate;
  if (!authDate || ageSeconds > telegramConfig.initDataMaxAgeSeconds || ageSeconds < 0) {
    return null;
  }

  const userRaw = params.get("user");
  if (!userRaw) {
    return null;
  }

  let user: TelegramWebAppUser;
  try {
    user = JSON.parse(userRaw) as TelegramWebAppUser;
  } catch {
    return null;
  }

  if (!user.id || !user.first_name) {
    return null;
  }

  return {
    user,
    authDate,
    queryId: params.get("query_id") ?? undefined
  };
}
