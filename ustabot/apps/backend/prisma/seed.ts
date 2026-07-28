import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Kategoriyalar. Slug'lar unique va lotin alifbosida (URL-friendly).
 * Icon nomlari Lucide Icons kutubxonasidagi nomlarga mos keladi (Part 8: "Use Lucide Icons").
 */
const CATEGORIES = [
  { name: "Santexnik", slug: "santexnik", icon: "Wrench", sortOrder: 1 },
  { name: "Elektrik", slug: "elektrik", icon: "Zap", sortOrder: 2 },
  { name: "Quruvchi", slug: "quruvchi", icon: "HardHat", sortOrder: 3 },
  { name: "Bo'yoqchi", slug: "boyoqchi", icon: "PaintRoller", sortOrder: 4 },
  { name: "Kafelchi", slug: "kafelchi", icon: "Grid3x3", sortOrder: 5 },
  { name: "Duradgor / Mebel usta", slug: "duradgor-mebel-usta", icon: "Hammer", sortOrder: 6 },
  { name: "Konditsioner ustasi", slug: "konditsioner-ustasi", icon: "Wind", sortOrder: 7 },
  { name: "Payvandchi", slug: "payvandchi", icon: "Flame", sortOrder: 8 },
  { name: "Kompyuter / Telefon ustasi", slug: "kompyuter-telefon-ustasi", icon: "Laptop", sortOrder: 9 },
  { name: "Tozalash xizmati", slug: "tozalash-xizmati", icon: "Sparkles", sortOrder: 10 },
  { name: "Haydovchi / Yuk tashish", slug: "haydovchi-yuk-tashish", icon: "Truck", sortOrder: 11 },
  { name: "Signalizatsiya / Videokuzatuv", slug: "signalizatsiya-videokuzatuv", icon: "Camera", sortOrder: 12 },
  { name: "Landshaft dizayner", slug: "landshaft-dizayner", icon: "Trees", sortOrder: 13 },
  { name: "Eshik / Deraza ustasi", slug: "eshik-deraza-ustasi", icon: "DoorOpen", sortOrder: 14 }
] as const;

/**
 * O'zbekistonning 14 ta hududiy birligi (12 viloyat + Toshkent shahri + Qoraqalpog'iston Respublikasi).
 * Har biriga demo tumanlar biriktirilgan. To'liq tuman/qishloq ro'yxati
 * Admin Panel > Region Management > Bulk Import (CSV/Excel) orqali yuklanadi (Part 7).
 */
const REGIONS: { name: string; code: string; districts: string[] }[] = [
  {
    name: "Toshkent shahri",
    code: "TSH",
    districts: [
      "Bektemir",
      "Chilonzor",
      "Mirobod",
      "Mirzo Ulug'bek",
      "Olmazor",
      "Sergeli",
      "Shayxontohur",
      "Uchtepa",
      "Yakkasaroy",
      "Yunusobod",
      "Yashnobod"
    ]
  },
  {
    name: "Toshkent viloyati",
    code: "TV",
    districts: ["Bekobod", "Chirchiq", "Angren", "Olmaliq", "Qibray", "Zangiota"]
  },
  { name: "Andijon viloyati", code: "AND", districts: ["Andijon shahri", "Asaka", "Xo'jaobod"] },
  { name: "Farg'ona viloyati", code: "FAR", districts: ["Farg'ona shahri", "Marg'ilon", "Qo'qon"] },
  { name: "Namangan viloyati", code: "NAM", districts: ["Namangan shahri", "Chust", "Kosonsoy"] },
  { name: "Sirdaryo viloyati", code: "SIR", districts: ["Guliston", "Yangiyer"] },
  { name: "Jizzax viloyati", code: "JIZ", districts: ["Jizzax shahri", "Zomin"] },
  { name: "Samarqand viloyati", code: "SAM", districts: ["Samarqand shahri", "Kattaqo'rg'on"] },
  { name: "Buxoro viloyati", code: "BUX", districts: ["Buxoro shahri", "Kogon"] },
  { name: "Navoiy viloyati", code: "NAV", districts: ["Navoiy shahri", "Zarafshon"] },
  { name: "Qashqadaryo viloyati", code: "QAS", districts: ["Qarshi", "Shahrisabz"] },
  { name: "Surxondaryo viloyati", code: "SUR", districts: ["Termiz", "Denov"] },
  { name: "Xorazm viloyati", code: "XOR", districts: ["Urganch", "Xiva"] },
  { name: "Qoraqalpog'iston Respublikasi", code: "QQR", districts: ["Nukus", "Xo'jayli"] }
];

async function seedCategories(): Promise<void> {
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        sortOrder: category.sortOrder,
        isVisible: true
      },
      create: category
    });
  }
  console.log(`✅ ${CATEGORIES.length} ta kategoriya yuklandi`);
}

async function seedRegions(): Promise<void> {
  let districtCount = 0;

  for (const regionData of REGIONS) {
    const region = await prisma.region.upsert({
      where: { code: regionData.code },
      update: { name: regionData.name },
      create: { name: regionData.name, code: regionData.code }
    });

    for (const districtName of regionData.districts) {
      const existing = await prisma.district.findFirst({
        where: { regionId: region.id, name: districtName }
      });

      if (!existing) {
        await prisma.district.create({
          data: { name: districtName, regionId: region.id }
        });
        districtCount += 1;
      }
    }
  }

  console.log(`✅ ${REGIONS.length} ta viloyat va ${districtCount} ta tuman yuklandi`);
}

async function seedSettings(): Promise<void> {
  const existing = await prisma.settings.findFirst();

  if (!existing) {
    await prisma.settings.create({
      data: {
        telegramChannel: process.env.CHANNEL_URL ?? null,
        supportUsername: process.env.SUPPORT_USERNAME ?? null,
        maintenanceMode: false,
        appVersion: "1.0.0",
        minSupportedVersion: "1.0.0",
        privacyPolicy: "Maxfiylik siyosati matni tez orada qo'shiladi.",
        termsOfService: "Foydalanish shartlari matni tez orada qo'shiladi."
      }
    });
    console.log("✅ Standart sozlamalar (Settings) yaratildi");
  } else {
    console.log("ℹ️  Settings qatori allaqachon mavjud, o'tkazib yuborildi");
  }
}

async function seedSuperAdmins(): Promise<void> {
  const superAdminIds = (process.env.SUPER_ADMIN_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  for (const telegramId of superAdminIds) {
    await prisma.user.upsert({
      where: { telegramId },
      update: { role: "SUPER_ADMIN" },
      create: {
        telegramId,
        firstName: "Super Admin",
        role: "SUPER_ADMIN",
        languageCode: "uz"
      }
    });
  }

  if (superAdminIds.length > 0) {
    console.log(`✅ ${superAdminIds.length} ta Super Admin sozlandi`);
  } else {
    console.log("ℹ️  SUPER_ADMIN_IDS bo'sh — hech qanday admin yaratilmadi");
  }
}

async function main(): Promise<void> {
  console.log("🌱 Seed jarayoni boshlandi...\n");

  await seedCategories();
  await seedRegions();
  await seedSettings();
  await seedSuperAdmins();

  console.log("\n✅ Seed jarayoni muvaffaqiyatli yakunlandi");
}

main()
  .catch((error) => {
    console.error("❌ Seed jarayonida xatolik:", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
