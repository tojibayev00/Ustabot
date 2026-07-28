# Xavfsizlik siyosati (SECURITY.md)

## Zaiflik haqida xabar berish

Agar xavfsizlik zaifligini topsangiz, **hech qachon uni ochiq Issue sifatida e'lon qilmang**.
Buning o'rniga to'g'ridan-to'g'ri loyiha maintaineriga yozing (kontakt: `SUPPORT_USERNAME`
sozlamasida ko'rsatilgan Telegram akkaunt). Muammoni tavsiflab, imkon qadar
takrorlash qadamlarini yozing.

## Autentifikatsiya va avtorizatsiya

- Foydalanuvchi autentifikatsiyasi **faqat** Telegram Mini App `initData`sining
  HMAC-SHA256 orqali tekshirilishiga asoslangan (`shared/telegramInitData.helper.ts`).
  Frontend'dan kelgan hech qanday foydalanuvchi ma'lumotiga bevosita ishonilmaydi.
- JWT access token — 15 daqiqa, refresh token — 30 kun, **rotation** bilan (har safar
  yangilanganda eski refresh token darhol bekor qilinadi, Redis orqali).
- RBAC 5 bosqichli: USER → WORKER → MODERATOR → ADMIN → SUPER_ADMIN, har bir endpoint
  aniq permission yoki minimal rol talab qiladi (`middlewares/admin.middleware.ts`).
- Bot ↔ Backend orasidagi server-to-server so'rovlar alohida maxfiy kalit
  (`INTERNAL_API_KEY`) bilan himoyalangan — bu kalit hech qachon frontend'ga chiqarilmaydi.

## Ma'lumotlarni himoyalash

- IP manzillar hech qachon xom holda saqlanmaydi — faqat SHA-256 hash (`utils/hash.ts`).
- Telefon raqamlar loglarda avtomatik "redact" qilinadi (`config/logger.ts`).
- JWT/refresh token/parol/maxfiy kalitlar hech qachon logga yozilmaydi.
- Barcha input Zod orqali validatsiya qilinadi; noma'lum maydonlar rad etiladi.
- Fayl yuklashda MIME-type va kengaytma tekshiriladi, hajm 2MB bilan cheklangan,
  rasm yuklashdan oldin qayta siqiladi va EXIF metadata olib tashlanadi.

## Tarmoq xavfsizligi

- Helmet: CSP, HSTS, X-Frame-Options, X-Content-Type-Options va h.k.
- CORS faqat `.env`da ko'rsatilgan domenlarga ruxsat beradi.
- Redis-backed rate limiting: umumiy API 100/daq, auth 20/daq, upload 10/daq,
  shikoyat 20/soat.
- Barcha Prisma so'rovlari parametrlashtirilgan (SQL Injection imkonsiz).

## Audit

- Har bir admin amali (`approve`, `reject`, `block`, kategoriya o'zgarishi va h.k.)
  `AdminLog` jadvaliga yoziladi va **hech qachon o'chirilmaydi yoki tahrirlanmaydi**.

## Muhit o'zgaruvchilari

- `.env` fayli hech qachon Git'ga commit qilinmaydi (`.gitignore`da).
- `.env.example`da faqat namunaviy (haqiqiy bo'lmagan) qiymatlar mavjud.
- Production'da barcha maxfiy kalitlar kamida 32 belgidan iborat, tasodifiy
  generatsiya qilingan qiymatlar bo'lishi shart (`env.ts` Zod orqali buni tekshiradi).

## Ma'lum cheklovlar / kelajakdagi yaxshilanishlar

- Hozircha Sentry/Prometheus/Grafana integratsiyasi yo'q — arxitektura ularga tayyor
  (Part 9: "Observability"), lekin implementatsiya keyingi bosqichga qoldirilgan.
- 2FA yoki qo'shimcha admin login qatlami yo'q — admin huquqi to'liq Telegram akkaunti
  egaligiga (va bazadagi rolga) asoslangan.
