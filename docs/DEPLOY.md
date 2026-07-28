# Deploy qo'llanmasi (DEPLOY.md)

## Umumiy talablar

- Domenlar: API uchun (`api.your-domain.com`), Mini App uchun (`your-domain.com`)
- Telegram Bot token (@BotFather orqali)
- Cloudinary hisobi
- Barcha `.env` qiymatlari to'ldirilgan bo'lishi kerak (`.env.example`ga qarang)

Har qanday deploy usulida BotFather'da Mini App URL'ini sozlashni unutmang:
`/mybots` → botni tanlang → `Bot Settings` → `Menu Button` → Mini App URL'ini kiriting.

---

## Variant 1 — VPS + Docker (tavsiya etiladi, to'liq nazorat)

### 1. Serverga tayyorgarlik

```bash
# Ubuntu 22.04+ serverda
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
sudo apt install -y docker-compose-plugin certbot
```

### 2. Loyihani klonlash

```bash
git clone <repo-url> /opt/ustalar-platform
cd /opt/ustalar-platform
cp .env.example .env
nano .env   # barcha qiymatlarni to'ldiring
```

### 3. SSL sertifikat olish (Let's Encrypt)

```bash
sudo mkdir -p docker/certbot/{conf,www}
sudo certbot certonly --standalone \
  -d api.your-domain.com -d your-domain.com \
  --email you@example.com --agree-tos --non-interactive
sudo cp -r /etc/letsencrypt/* docker/certbot/conf/
```

### 4. Nginx konfiguratsiyasini sozlash

`docker/nginx/conf.d/ustalar.conf.example` faylini `ustalar.conf` nomiga nusxalab,
ichidagi `your-domain.com` / `api.your-domain.com`ni haqiqiy domenlaringizga almashtiring.

### 5. Ishga tushirish

```bash
docker compose -f docker/docker-compose.prod.yml up -d --build

# Migratsiya va seed (birinchi marta)
docker compose -f docker/docker-compose.prod.yml exec backend pnpm db:migrate:deploy
docker compose -f docker/docker-compose.prod.yml exec backend pnpm db:seed
```

### 6. Avtomatik SSL yangilanishi

```bash
echo "0 3 * * * certbot renew --quiet && docker compose -f /opt/ustalar-platform/docker/docker-compose.prod.yml restart nginx" | sudo tee -a /etc/crontab
```

### 7. Yangilanishlarni deploy qilish

CI/CD orqali avtomatik (`.github/workflows/deploy.yml`, `DEPLOY_TARGET=vps` va
`VPS_HOST`/`VPS_USERNAME`/`VPS_SSH_KEY` secretlari sozlangan bo'lsa), yoki qo'lda:

```bash
cd /opt/ustalar-platform
git pull
docker compose -f docker/docker-compose.prod.yml up -d --build
```

---

## Variant 2 — Railway

1. Railway'da yangi loyiha yarating, GitHub repozitoriyni ulang.
2. **3 ta alohida servis** yarating (backend, bot, miniapp), har biriga mos
   `docker/Dockerfile.<app>`ni "Root Directory"/"Dockerfile Path" sifatida ko'rsating.
3. Railway'ning o'z PostgreSQL va Redis plaginlarini qo'shing, ularning connection
   URL'larini backend/bot servislariga environment variable sifatida bering
   (`DATABASE_URL`, `REDIS_URL`).
4. Qolgan barcha `.env.example`dagi o'zgaruvchilarni har bir servisga mos ravishda kiriting.
5. Backend servisi uchun "Deploy Hook" yoki "Release Command"ga
   `pnpm db:migrate:deploy` qo'shing.

## Variant 3 — Render

1. **Web Service** — backend uchun (`docker/Dockerfile.backend`, port 4000)
2. **Background Worker** yoki yana bitta Web Service — bot uchun (`docker/Dockerfile.bot`)
3. **Static Site** yoki Web Service — miniapp uchun (`docker/Dockerfile.miniapp`)
4. **Render PostgreSQL** va **Render Redis (Key Value)** qo'shing
5. Environment Groups orqali `.env` qiymatlarini barcha servislarga ulashing

---

## Deploy'dan keyingi tekshiruv ro'yxati

- [ ] `GET https://api.your-domain.com/health` → `"status": "healthy"`
- [ ] `GET https://api.your-domain.com/api/v1/docs` → Swagger UI ochiladi
- [ ] Telegram botga `/start` yuborilganda javob keladi
- [ ] Mini App Telegram ichida ochiladi va autentifikatsiya muvaffaqiyatli o'tadi
- [ ] Usta ro'yxatdan o'tkazib, admin sifatida tasdiqlash sinovdan o'tkaziladi
- [ ] Broadcast test xabari yuboriladi va statistikasi to'g'ri yangilanadi

## Backup

```bash
# Qo'lda backup
docker compose -f docker/docker-compose.prod.yml exec postgres \
  pg_dump -U ustalar ustalar_db > backup_$(date +%F).sql

# Tiklash
cat backup_2026-01-01.sql | docker compose -f docker/docker-compose.prod.yml exec -T postgres \
  psql -U ustalar ustalar_db
```

Production serverida kunlik avtomatik backup uchun oddiy cron + yuqoridagi buyruqni
`/etc/cron.daily/`ga qo'shish tavsiya etiladi; uzoq muddatli saqlash uchun S3-mos
object storage'ga yuklashni ko'rib chiqing.
