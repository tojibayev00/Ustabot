# Hissa qo'shish (CONTRIBUTING.md)

## Git Workflow

- `main` — production, faqat `release/*` yoki `hotfix/*` orqali birlashtiriladi
- `develop` — asosiy ishlab chiqish branch'i
- `feature/<nom>` — yangi funksiya
- `fix/<nom>` — xatolik tuzatish
- `hotfix/<versiya>` — production'dagi shoshilinch tuzatish
- `release/<versiya>` — release tayyorgarligi

## Commit xabarlari

[Conventional Commits](https://www.conventionalcommits.org/) formatida:

```
feat(worker): usta ro'yxatdan o'tish qo'shildi
fix(search): pagination xatoligi tuzatildi
refactor(auth): token tekshiruvi soddalashtirildi
docs(api): Swagger tavsiflari yangilandi
test(report): integration testlar qo'shildi
chore(deps): bog'liqliklar yangilandi
```

## Pull Request talablari

Har bir PR merge qilinishidan oldin:

- [ ] `pnpm lint` xatoliksiz o'tadi
- [ ] `pnpm type-check` xatoliksiz o'tadi
- [ ] `pnpm test` (tegishli app uchun) muvaffaqiyatli
- [ ] Yangi endpoint qo'shilgan bo'lsa — Swagger annotatsiyasi va `docs/API.md` yangilangan
- [ ] Schema o'zgargan bo'lsa — Prisma migratsiya yaratilgan va `docs/DATABASE.md` yangilangan
- [ ] Placeholder/TODO/FIXME qoldirilmagan

## Kod uslubi

- TypeScript Strict Mode — `any` ishlatilmaydi
- Controller → Service → Repository qatlamlari aralashtirilmaydi
- Har bir modul bir xil papka strukturasiga amal qiladi (`docs/ARCHITECTURE.md`)
- Foydalanuvchiga ko'rinadigan barcha matnlar o'zbek tilida

## Lokal development

```bash
corepack enable
pnpm install
cp .env.example .env
docker compose -f docker/docker-compose.dev.yml up -d postgres redis
pnpm --filter @ustalar/backend db:migrate
pnpm --filter @ustalar/backend db:seed
pnpm dev
```
