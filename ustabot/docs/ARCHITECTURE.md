# Arxitektura (ARCHITECTURE.md)

## Umumiy ko'rinish

```
Telegram User
      │
      ├──────────────┬───────────────┐
      ▼              ▼               ▼
 Telegram Bot   Telegram Mini App   (Admin Panel — Mini App ichida /admin)
      │              │
      └──────┬───────┘
             ▼
        REST API (Express)
             │
   ┌─────────┼─────────────┬─────────────┐
   ▼         ▼              ▼             ▼
PostgreSQL  Redis       Cloudinary   Telegram Bot API
(Prisma)  (cache/queue)  (rasmlar)   (xabar yuborish)
```

Loyiha **Modular Monolith** arxitekturasida qurilgan: bitta backend jarayoni ichida
mustaqil modullar (`controller → service → repository`), lekin har bir modul
kelajakda alohida mikroservisga ajratilishi mumkin bo'lgan aniq chegaralarga ega.

## Monorepo tuzilmasi

```
ustalar-platform/
├── apps/
│   ├── backend/    # Express + Prisma REST API (barcha biznes logika shu yerda)
│   ├── bot/        # Telegram Bot (GramMY) — faqat Backend API orqali ishlaydi
│   └── miniapp/    # Telegram Mini App (React) — foydalanuvchi va admin interfeysi
├── packages/       # (kelajak uchun zaxira: umumiy tiplar/UI/config)
├── docker/         # Dockerfile'lar, docker-compose, nginx
├── docs/           # Hujjatlar
└── .github/        # CI/CD workflow'lar
```

## Backend modullari (`apps/backend/src/modules`)

| Modul | Mas'uliyat |
|---|---|
| `auth` | Telegram initData tekshiruvi, JWT, refresh rotation, session (Redis) |
| `user` | O'z profilini boshqarish |
| `worker` | Ro'yxatdan o'tish, moderatsiya (approve/reject/block), portfolio, qidiruv ma'lumotlari |
| `category` / `region` | Spravochnik ma'lumotlar, cache bilan |
| `search` | Worker moduli ustidan qidiruv qatlami + qidiruv tarixi |
| `report` | Shikoyatlar |
| `notification` | Foydalanuvchi bildirishnomalari (o'qilgan/o'qilmagan) |
| `broadcast` | Ommaviy xabarlar — BullMQ queue orqali fon rejimida |
| `analytics` | Dashboard statistikasi (2 daqiqalik cache) |
| `admin` | Foydalanuvchilarni boshqarish (block/unblock/role) |
| `settings` | Global ilova sozlamalari |
| `upload` | Umumiy Cloudinary rasm yuklash |
| `internal` | **Faqat Bot uchun** — `x-internal-api-key` bilan himoyalangan server-to-server API |

Har bir modul bir xil ichki qatlamlarga ega:

```
module/
├── controller/   # Faqat HTTP request/response
├── service/      # Biznes logika, tranzaksiyalar, cache invalidation
├── repository/   # Faqat Prisma so'rovlari
├── validators/   # Zod sxemalari
├── dto/          # Prisma model → API response mapper
├── types/        # TypeScript interfeyslar
└── routes/       # Express Router + Swagger annotatsiyalari
```

## Nega Bot to'g'ridan-to'g'ri bazaga ulanmaydi?

Bot (`apps/bot`) alohida Node.js jarayoni sifatida ishlaydi va **hech qachon**
Prisma yoki Redis'ga bevosita murojaat qilmaydi. Buning o'rniga:

1. Oddiy foydalanuvchi buyruqlari (`/start`, `/profile`) — `internal` moduli orqali
2. Admin amallari (`/admin` ichidagi tasdiqlash/rad etish) — xuddi shu `internal` moduli orqali,
   lekin amalni bajaruvchi haqiqiy admin `telegramId` orqali aniqlanadi va uning nomidan
   audit log yoziladi (bot "o'zi" emas)
3. Bildirishnomalar — Backend BullMQ `notifications` queue orqali Telegram Bot API'ga
   to'g'ridan-to'g'ri (bot jarayonini chetlab o'tib) xabar yuboradi

Bu arxitektura bot va backend'ni mustaqil deploy qilish, alohida masshtablash va
xavfsizlik chegaralarini aniq saqlash imkonini beradi.

## Mini App arxitekturasi

- **Routing**: React Router, lazy-loaded sahifalar
- **Server state**: TanStack Query (cache, retry, infinite scroll)
- **Client state**: Zustand (`auth.store.ts` — faqat token/user, boshqa hech narsa)
- **Theme**: Telegram `themeParams` → CSS custom properties (`theme/telegramTheme.ts`) —
  hech qanday rang qattiq kodlanmagan
- **Admin Panel**: alohida ilova emas, `/admin/*` route'lari остида, `AdminGuard` orqali
  rolga qarab himoyalangan

## Ma'lumotlar bazasi

Batafsil: [`DATABASE.md`](./DATABASE.md). Qisqacha: PostgreSQL + Prisma, UUID PK,
soft-delete asosiy jadvallarda, barcha muhim FK'larda `Restrict`/`Cascade`/`SetNull`
qoidalari aniq belgilangan.

## Cache va Queue strategiyasi

| Narsa | Texnologiya | TTL / rejim |
|---|---|---|
| Kategoriyalar/Viloyat/Tuman | Redis (get-or-set) | 1 soat / 24 soat |
| Worker ro'yxati (qidiruv) | Redis (dinamik kalit — filtr hash) | 5 daqiqa |
| Dashboard | Redis | 2 daqiqa |
| Refresh token sessiyalari | Redis (Set + String) | Token muddati bilan bir xil |
| Rate limiting | Redis (`rate-limit-redis`) | Endpoint guruhiga qarab |
| Bildirishnoma yuborish | BullMQ `notifications` queue | Retry: 3, exponential backoff |
| Broadcast yuborish | BullMQ `broadcast` queue | Batch=25, 1.1s interval |

## Xavfsizlik chegaralari

Batafsil: [`SECURITY.md`](./SECURITY.md).
