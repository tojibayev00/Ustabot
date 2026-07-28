# Testlash strategiyasi (TESTING.md)

## Umumiy yondashuv

| Daraja | Vosita | Nimani tekshiradi | Infratuzilma talabi |
|---|---|---|---|
| Unit | Vitest | Pure funksiyalar, servislar (repository mock qilingan) | Yo'q |
| Integration | Vitest + Supertest | Real HTTP so'rov → Express app | PostgreSQL + Redis ishga tushgan bo'lishi kerak |
| E2E | Playwright | To'liq foydalanuvchi ssenariylari (brauzerda) | Dev server (`pnpm dev`) ishga tushgan bo'lishi kerak |

## Backend

```bash
cd apps/backend

# Faqat unit testlar (hech qanday tashqi servis kerak emas)
pnpm test:unit

# Integration testlar (avval infratuzilmani ishga tushiring!)
docker compose -f ../../docker/docker-compose.dev.yml up -d postgres redis
pnpm test:integration

# Barcha testlar + coverage
pnpm test:coverage
```

### Nima test qilingan (unit)

- `shared/phone.helper.ts` — telefon normalizatsiya/validatsiya
- `shared/validation.helper.ts` — slug generatsiya, matn normalizatsiya, UUID tekshiruvi
- `shared/pagination.ts` — sahifalash va saralash mantiqi
- `shared/jwt.helper.ts` — token yaratish/tekshirish, muddati o'tgan token
- `utils/duration.ts` — "15m"/"30d" formatlarini soniyaga o'girish
- `constants/roles.ts` va `constants/permissions.ts` — RBAC ierarxiyasi va ruxsatlar
- `errors/*` — barcha xatolik klasslari va Zod xatoligini formatlash
- `modules/category/service` — repository to'liq mock qilingan holda biznes logika (slug unikallik, o'chirish cheklovi)

### Nima test qilingan (integration)

- `GET /health`, `GET /ready` — standart javob formati
- 404 handler — standart xatolik formati
- `POST /auth/telegram` — validatsiya va yaroqsiz initData holatlari
- `GET /auth/me` — token'siz so'rovda 401

> Qolgan modullar (Worker, Report, Broadcast va h.k.) uchun integration testlar xuddi shu naqsh
> bo'yicha kengaytiriladi: `supertest` bilan real HTTP so'rov, natijani standart response
> formatiga solishtirish.

## Mini App

```bash
cd apps/miniapp

# Unit/component testlar (jsdom muhitida)
pnpm test

# Coverage bilan
pnpm test:coverage

# E2E (avval dev serverni alohida ishga tushirish shart emas — Playwright o'zi ishga tushiradi)
pnpm exec playwright install --with-deps chromium   # birinchi marta
pnpm test:e2e
```

### Nima test qilingan

- `utils/cn.ts` — Tailwind class birlashtirish
- `utils/phone.ts` — telefon validatsiya/normalizatsiya
- `components/ui/button.tsx` — render, onClick, disabled/loading holati
- `components/common/EmptyState.tsx` — render va action tugmasi
- `e2e/auth-gate.spec.ts` — Telegram tashqarisida ochilganda to'g'ri xatolik ekrani

## CI'da testlar

GitHub Actions workflow (`.github/workflows/ci.yml`) quyidagilarni avtomatik bajaradi:

1. Lint + type-check (barcha app'lar)
2. Backend unit testlar
3. PostgreSQL + Redis service container'larini ko'tarish
4. Backend integration testlar (real DB/Redis bilan)
5. Mini App unit/component testlar
6. Build (barcha app'lar)

E2E testlar hozircha CI pipeline'ga alohida qo'lda ishga tushiriladigan bosqich sifatida
qo'shilgan (`workflow_dispatch`), chunki ular to'liq backend + Mini App ishga tushishini talab qiladi.

## Coverage maqsadi

Spesifikatsiyaga ko'ra maqsad — **≥80%**. Joriy `vitest.config.ts`dagi threshold **60%** ga
o'rnatilgan (real loyihada modullar to'liq test qilingani sayin bosqichma-bosqich 80%
gacha oshiriladi — bu qiymatni sun'iy ravishda 80%ga qo'yib, keyin testlarni "moslashtirish"
yaxshi amaliyot emas).
