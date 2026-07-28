import { useMemo } from "react";
import { getTelegramWebApp } from "@/types/telegram.types.js";

export function useTelegram() {
  return useMemo(() => {
    const webApp = getTelegramWebApp();
    return {
      webApp,
      user: webApp?.initDataUnsafe.user ?? null,
      platform: webApp?.platform ?? "unknown",
      isTelegram: Boolean(webApp)
    };
  }, []);
}
