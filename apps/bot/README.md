# Ustalar Topish — Telegram Bot

GramMY asosida qurilgan Telegram Bot. Backend bilan **faqat REST API** orqali ishlaydi (PostgreSQL/Redis'ga bevosita ulanmaydi).

## Buyruqlar

| Buyruq | Tavsif |
|---|---|
| `/start` | Botni ishga tushirish, foydalanuvchini sinxronlash, asosiy menyu |
| `/help` | Yordam, qo'llab-quvvatlash, kanal havolalari |
| `/contact` | Qo'llab-quvvatlash kontakti |
| `/language` | Til tanlash (uz/ru/en) |
| `/profile` | Foydalanuvchi profili va usta holati |
| `/admin` | Admin panel (faqat Moderator/Admin/Super Admin) |

## Admin funksiyalari (bot ichida)

- 📋 Kutayotgan arizalar — ro'yxat + tasdiqlash/rad etish tugmalari
- 🚩 Shikoyatlar soni
- 📊 Qisqacha statistika (dashboard)
- To'liq boshqaruv uchun Mini App'dagi Admin Panelga havola

## Ishga tushirish

```bash
pnpm install
cp ../../.env.example ../../.env   # BACKEND_API_URL va INTERNAL_API_KEY to'ldirilgan bo'lishi shart
pnpm dev
```

Bot ishga tushishi uchun **backend allaqachon ishga tushgan va Redis/Postgres'ga ulangan bo'lishi shart** — chunki `/internal/*` endpointlar orqali ishlaydi.

## Ishlash rejimi

- Development: long polling
- Production: `TELEGRAM_WEBHOOK_URL` berilsa webhook, aks holda polling (webhook uchun alohida HTTPS endpoint sozlanishi kerak)
