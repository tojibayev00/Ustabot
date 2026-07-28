# Ustalar Topish

Professional ustalarni topish uchun Telegram Bot + Telegram Mini App platformasi.

> ⚠️ Loyiha faol ishlab chiqilmoqda. Quyidagi holat **Phase 1 — Project Initialization** bosqichini aks ettiradi. Backend, Bot va Mini App ilovalarining o'zi keyingi fazalarda qo'shiladi.

## Loyiha haqida

**Ustalar Topish** — foydalanuvchilarga o'z hududidagi professional ustalarni (santexnik, elektrik, quruvchi va h.k.) topish imkonini beruvchi sof directory platforma. To'lov va buyurtma tizimi yo'q — faqat usta profilini topish va u bilan bevosita bog'lanish.

- 👤 Foydalanuvchi — usta qidiradi, profilni ko'radi, bog'lanadi
- 🛠 Usta — profil yaratadi, portfolio yuklaydi, admin tasdig'ini kutadi
- 🛡 Moderator/Admin — ustalarni tasdiqlaydi, shikoyatlarni ko'rib chiqadi
- 👑 Super Admin — to'liq tizim boshqaruvi

## Arxitektura

Modular Monolith arxitekturasi, monorepo tuzilmasida:

```
ustalar-platform/
├── apps/
│   ├── backend/     # Express + Prisma REST API
│   ├── bot/         # Telegram Bot (GramMY)
│   └── miniapp/     # Telegram Mini App (React + Vite)
├── packages/
│   ├── shared/      # Umumiy utils, konstantalar
│   ├── types/       # Umumiy TypeScript tiplar
│   ├── config/      # Umumiy konfiguratsiya
│   └── ui/          # Umumiy UI komponentlar (shadcn/ui asosida)
├── docker/          # Dockerfile'lar, docker-compose, nginx config
├── docs/            # Loyiha hujjatlari
└── .github/         # CI/CD workflow'lar
```

Batafsil arxitektura tavsifi: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) *(keyingi fazada qo'shiladi)*.

## Texnologiyalar

| Qatlam | Texnologiya |
|---|---|
| Til | TypeScript (Strict Mode) |
| Backend | Node.js 20 LTS, Express |
| Frontend | React, TailwindCSS, shadcn/ui |
| State | TanStack Query, Zustand |
| Database | PostgreSQL + Prisma ORM |
| Cache/Queue | Redis, BullMQ |
| Storage | Cloudinary |
| Bot | GramMY |
| Monorepo | pnpm workspaces + Turborepo |
| Deploy | Docker, GitHub Actions, Railway / Render / VPS |

## Talablar

- Node.js **20.x LTS**
- pnpm **9.x** (`corepack enable`)
- Docker va Docker Compose (lokal Postgres/Redis uchun)

## O'rnatish

```bash
# 1. Repozitoriyani klonlash
git clone <repo-url> ustalar-platform
cd ustalar-platform

# 2. pnpm faollashtirish
corepack enable
corepack prepare pnpm@9.12.0 --activate

# 3. Environment fayllarini sozlash
cp .env.example .env
# .env faylini o'z qiymatlaringiz bilan to'ldiring

# 4. Bog'liqliklarni o'rnatish
pnpm install

# 5. Infratuzilmani ishga tushirish (Postgres + Redis)
docker compose -f docker/docker-compose.dev.yml up -d postgres redis

# 6. Database migratsiya va seed (Phase 3'dan keyin mavjud bo'ladi)
pnpm db:migrate
pnpm db:seed

# 7. Barcha ilovalarni dev rejimida ishga tushirish
pnpm dev
```

## Skriptlar

| Buyruq | Tavsif |
|---|---|
| `pnpm dev` | Barcha app'larni dev rejimida ishga tushiradi |
| `pnpm build` | Barcha app'larni build qiladi |
| `pnpm lint` | ESLint tekshiruvi |
| `pnpm type-check` | TypeScript tip tekshiruvi |
| `pnpm test` | Barcha testlarni ishga tushiradi |
| `pnpm format` | Prettier bilan formatlash |
| `pnpm db:migrate` | Prisma migratsiyalarni qo'llash |
| `pnpm db:seed` | Boshlang'ich ma'lumotlarni yuklash |
| `pnpm db:studio` | Prisma Studio'ni ochish |

## Docker orqali ishga tushirish

```bash
# Development
docker compose -f docker/docker-compose.dev.yml up --build

# Production
docker compose -f docker/docker-compose.prod.yml up -d --build
```

## Rivojlanish holati (Development Roadmap)

- [x] Phase 1 — Project Initialization
- [x] Phase 2 — Backend Foundation
- [x] Phase 3 — Database (Prisma Schema, Migration, Seed)
- [x] Phase 4 — Authentication
- [x] Phase 5 — Core Modules
- [x] Phase 6 — REST API
- [x] Phase 7 — Telegram Bot
- [x] Phase 8 — Telegram Mini App
- [x] Phase 9 — Admin Panel
- [x] Phase 10 — Optimization
- [x] Phase 11 — Testing
- [x] Phase 12 — CI/CD & Deployment

## Hujjatlar

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — tizim arxitekturasi
- [`docs/API.md`](./docs/API.md) — API endpointlari ro'yxati (to'liq: `/api/v1/docs`)
- [`docs/DATABASE.md`](./docs/DATABASE.md) — ma'lumotlar bazasi sxemasi
- [`docs/DEPLOY.md`](./docs/DEPLOY.md) — deploy qo'llanmasi (VPS/Railway/Render)
- [`docs/SECURITY.md`](./docs/SECURITY.md) — xavfsizlik siyosati
- [`docs/TESTING.md`](./docs/TESTING.md) — testlash strategiyasi
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — hissa qo'shish qo'llanmasi
- [`CHANGELOG.md`](./CHANGELOG.md) — o'zgarishlar tarixi

## Litsenziya

Xususiy loyiha — barcha huquqlar himoyalangan. Batafsil: [`LICENSE`](./LICENSE).
