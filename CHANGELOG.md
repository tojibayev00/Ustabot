# Changelog

Format [Keep a Changelog](https://keepachangelog.com/) asosida,
versiyalash [Semantic Versioning](https://semver.org/) bo'yicha.

## [1.0.0] — Ishlab chiqilmoqda

### Qo'shildi

- **Phase 1** — Monorepo skeleton (pnpm + Turborepo), Docker konfiguratsiyasi
- **Phase 2** — Backend foundation (config, middleware, error handling, logging)
- **Phase 3** — To'liq Prisma schema (16 model), seed data
- **Phase 4** — Autentifikatsiya (Telegram initData, JWT rotation, Redis sessiyalar)
- **Phase 5** — Barcha core modullar: Category, Region/District/Village, User, Worker,
  Upload, Search, Report, Notification, Broadcast, Analytics, Settings
- **Phase 6** — To'liq REST API (Swagger hujjatlari bilan)
- **Phase 7** — Telegram Bot (GramMY) — barcha buyruqlar, admin moderatsiya
- **Phase 8** — Telegram Mini App (React) — Home, Search, Worker Profile,
  Become Worker Wizard, Profile, Settings, About
- **Phase 9** — Admin Panel (Mini App ichida) — Dashboard, Workers, Reports,
  Categories, Users, Broadcast
- **Phase 10** — Optimizatsiya (React.memo, cache, lazy loading)
- **Phase 11** — Test infratuzilmasi (Vitest unit/integration, Playwright E2E skeleton)
- **Phase 12** — CI/CD (GitHub Actions), deploy hujjatlari (VPS/Railway/Render)

### Xavfsizlik

- Telegram HMAC-SHA256 initData tekshiruvi
- JWT access/refresh rotation
- RBAC (5 daraja)
- Redis-backed rate limiting
- IP hashing (ViewHistory)
