import { InlineKeyboard } from "grammy";
import { env } from "@/config/env.js";

export function buildAdminMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("📋 Kutayotgan arizalar", "admin:pending")
    .row()
    .text("🚩 Shikoyatlar", "admin:reports")
    .row()
    .text("📊 Statistika", "admin:dashboard")
    .row()
    .webApp("🛠 To'liq Admin Panel", `${env.WEBAPP_URL}/admin`);
}

export function buildWorkerApprovalKeyboard(workerId: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("✅ Tasdiqlash", `worker:approve:${workerId}`)
    .text("❌ Rad etish", `worker:reject:${workerId}`);
}

export function buildBackToAdminMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text("⬅️ Orqaga", "admin:menu");
}
