import { InlineKeyboard } from "grammy";
import { env } from "@/config/env.js";

export function buildWorkerProfileKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .webApp("👤 Mening profilim", `${env.WEBAPP_URL}/profile`)
    .row()
    .webApp("✏️ Profilni tahrirlash", `${env.WEBAPP_URL}/profile/edit`);
}

export function buildBecomeWorkerKeyboard(): InlineKeyboard {
  return new InlineKeyboard().webApp("🛠 Usta bo'lish", `${env.WEBAPP_URL}/become-worker`);
}
