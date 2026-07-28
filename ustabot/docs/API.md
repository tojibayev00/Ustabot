# API hujjatlari (API.md)

> To'liq interaktiv hujjat (so'rov/javob namunalari bilan): `GET /api/v1/docs` (Swagger UI).
> Bu fayl — tezkor ma'lumotnoma sifatida barcha endpointlarning qisqacha ro'yxati.

Base URL: `/api/v1`

## Standart javob formati

**Muvaffaqiyat:**
```json
{ "success": true, "data": {}, "meta": {}, "message": "Success" }
```

**Xatolik:**
```json
{
  "success": false,
  "error": { "message": "...", "status": 400, "code": "BAD_REQUEST", "details": [] }
}
```

## Auth

| Method | Endpoint | Ruxsat | Tavsif |
|---|---|---|---|
| POST | `/auth/telegram` | Public | Telegram initData orqali kirish |
| POST | `/auth/refresh` | Public (refresh token) | Token yangilash (rotation) |
| POST | `/auth/logout` | Auth | Joriy qurilmadan chiqish |
| POST | `/auth/logout-all` | Auth | Barcha qurilmalardan chiqish |
| GET | `/auth/me` | Auth | Joriy foydalanuvchi |

## Users

| Method | Endpoint | Ruxsat | Tavsif |
|---|---|---|---|
| GET | `/users/me` | Auth | O'z profili |
| PATCH | `/users/me` | Auth | Profilni yangilash |
| DELETE | `/users/me` | Auth | Hisobni o'chirish (soft delete) |

## Workers

| Method | Endpoint | Ruxsat | Tavsif |
|---|---|---|---|
| GET | `/workers` | Public | Tasdiqlangan ustalar (filtr/sort/pagination) |
| POST | `/workers/register` | Auth | Usta sifatida ro'yxatdan o'tish (multipart) |
| GET | `/workers/me` | Auth | O'z usta profili |
| PATCH | `/workers/me` | Auth | Profilni tahrirlash |
| DELETE | `/workers/me` | Auth | Profilni o'chirish |
| GET | `/workers/me/status` | Auth | Ariza holati |
| POST | `/workers/me/gallery` | Auth | Portfolio rasm qo'shish |
| DELETE | `/workers/me/gallery/:imageId` | Auth | Portfolio rasmini o'chirish |
| GET | `/workers/:id` | Public | Usta profili (views++) |

## Admin: Workers

| Method | Endpoint | Ruxsat |
|---|---|---|
| GET | `/admin/workers` | Moderator+ |
| PATCH | `/admin/workers/:id/approve` | Moderator+ |
| PATCH | `/admin/workers/:id/reject` | Moderator+ |
| PATCH | `/admin/workers/:id/block` | Moderator+ |
| PATCH | `/admin/workers/:id/activate` | Moderator+ |
| DELETE | `/admin/workers/:id` | Admin+ |

## Categories / Regions / Districts / Villages

| Method | Endpoint | Ruxsat |
|---|---|---|
| GET | `/categories` | Public |
| POST/PATCH/DELETE | `/categories/:id` | Admin+ |
| GET | `/regions`, `/regions/:id/districts` | Public |
| GET | `/districts/:id/villages` | Public |
| POST/PATCH/DELETE | `/regions`, `/districts`, `/villages` | Admin+ |

## Search / Reports / Notifications

| Method | Endpoint | Ruxsat |
|---|---|---|
| GET | `/search/workers` | Public |
| POST | `/reports` | Auth |
| GET | `/reports` | Moderator+ |
| PATCH | `/reports/:id` | Moderator+ |
| GET | `/notifications` | Auth |
| PATCH | `/notifications/read/:id`, `/notifications/read-all` | Auth |

## Admin: Users / Broadcast / Analytics / Settings

| Method | Endpoint | Ruxsat |
|---|---|---|
| GET | `/admin/users` | Admin+ |
| PATCH | `/admin/users/:id/block`, `/unblock` | Admin+ |
| PATCH | `/admin/users/:id/role` | Super Admin |
| POST | `/admin/broadcast` | Admin+ |
| GET | `/admin/broadcast/history` | Admin+ |
| GET | `/admin/dashboard`, `/analytics/dashboard` | Admin+ |
| GET | `/settings` | Public |
| PATCH | `/settings` | Super Admin |

## Upload

| Method | Endpoint | Ruxsat |
|---|---|---|
| POST | `/upload/image` | Auth |

## Internal (faqat Bot uchun, `x-internal-api-key` header talab qilinadi)

| Method | Endpoint |
|---|---|
| POST | `/internal/users/sync` |
| GET | `/internal/users/:telegramId` |
| GET | `/internal/workers/pending` |
| POST | `/internal/workers/:id/approve`, `/reject` |
| GET | `/internal/dashboard-summary` |
| GET | `/internal/reports/pending-count` |

## Health

| Method | Endpoint |
|---|---|
| GET | `/health` |
| GET | `/ready` |
