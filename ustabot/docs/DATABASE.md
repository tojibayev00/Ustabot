# Ma'lumotlar bazasi (DATABASE.md)

## Umumiy

- Engine: **PostgreSQL 16**
- ORM: **Prisma 5**
- Primary Key: har bir jadvalda **UUID** (`@default(uuid())`)
- Vaqt zonasi: **UTC**
- Soft Delete: `deletedAt` ustuni orqali — `User`, `Worker`, `Category`, `Notification`

## Modellar

| Model | Jadval nomi | Tavsif |
|---|---|---|
| `User` | `users` | Har bir Telegram foydalanuvchisi |
| `Worker` | `workers` | Usta profili |
| `Category` | `categories` | Xizmat kategoriyalari |
| `Region` / `District` / `Village` | `regions` / `districts` / `villages` | Geografik ierarxiya |
| `PortfolioImage` | `portfolio_images` | Usta portfolio rasmlari (3–20 ta) |
| `Report` | `reports` | Ustaga yozilgan shikoyatlar |
| `Notification` | `notifications` | Foydalanuvchi bildirishnomalari |
| `BroadcastHistory` | `broadcast_history` | Admin ommaviy xabarlari tarixi |
| `Favorite` | `favorites` | Saqlangan ustalar (Future) |
| `Review` | `reviews` | Baholash (Future, feature flag bilan o'chirilgan) |
| `Settings` | `settings` | Global konfiguratsiya (bitta qator) |
| `AdminLog` | `admin_logs` | O'zgarmas audit jurnali |
| `SearchHistory` | `search_history` | Qidiruv tahlili (Future) |
| `ViewHistory` | `view_history` | Profil ko'rishlar tarixi (IP hash qilingan) |

## Cascade qoidalari

| Amal | Xatti-harakat |
|---|---|
| Region o'chirish | Tumanlar mavjud bo'lsa — **rad etiladi** (`Restrict`) |
| Category o'chirish | Ustalar mavjud bo'lsa — **rad etiladi** (`Restrict`) |
| Worker o'chirish | Portfolio rasmlari **avtomatik o'chadi** (`Cascade`); Reports/AdminLogs **saqlanib qoladi** |
| User o'chirish | Worker profili, Notifications, Favorites — **cascade** o'chadi |

## Buyruqlar

```bash
# Prisma Client generatsiya qilish
pnpm db:generate

# Development migratsiya yaratish va qo'llash
pnpm db:migrate

# Production'ga migratsiyalarni qo'llash (yangi migratsiya yaratmaydi)
pnpm db:migrate:deploy

# Boshlang'ich ma'lumotlarni yuklash (kategoriyalar, hududlar, settings)
pnpm db:seed

# Prisma Studio — GUI orqali ma'lumotlarni ko'rish/tahrirlash
pnpm db:studio

# Bazani to'liq tozalab, qayta migratsiya va seed qilish (FAQAT development uchun)
pnpm db:reset
```

## Seed ma'lumotlari

`prisma/seed.ts` quyidagilarni yuklaydi:

- 14 ta xizmat kategoriyasi (Santexnik, Elektrik, Quruvchi va h.k.)
- O'zbekistonning 14 ta hududi + demo tumanlar (to'liq ro'yxat Admin Panel'dagi Bulk Import orqali yuklanadi)
- Standart `Settings` qatori
- `SUPER_ADMIN_IDS` environment o'zgaruvchisida ko'rsatilgan Telegram ID'lar uchun `SUPER_ADMIN` roli bilan foydalanuvchi

Seed skripti **idempotent** — necha marta ishga tushirilsa ham dublikat yaratmaydi (`upsert` va mavjudlikni tekshirish orqali).

## Muhim cheklovlar

- `Worker.phone` — unique
- `User.telegramId` — unique
- `User.username` — nullable, lekin mavjud bo'lsa unique
- `Category.slug` — unique
- `Region.code` — unique
- `Favorite` — (`userId`, `workerId`) juftligi bo'yicha unique
- `Review` — (`workerId`, `userId`) juftligi bo'yicha unique (bitta foydalanuvchi bitta ustaga bitta review)

## Indekslar

Tez-tez filtrlanadigan ustunlarda indeks o'rnatilgan: `Worker.status`, `Worker.categoryId`, `Worker.regionId`, `Worker.districtId`, `Worker.views`, `Worker.createdAt`, shuningdek qo'shma indeks `(status, categoryId, regionId)` — qidiruv so'rovlarini tezlashtirish uchun.
