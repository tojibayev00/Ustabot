import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTelegramWebApp } from "@/types/telegram.types.js";

/**
 * Sahifa ochilganda Telegram'ning native Back Button'ini ko'rsatadi.
 * Bosilganda berilgan yo'lga (yoki tarixda orqaga) qaytaradi.
 */
export function useTelegramBackButton(onBack?: () => void): void {
  const navigate = useNavigate();

  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (!webApp) return;

    const handleClick = (): void => {
      if (onBack) onBack();
      else navigate(-1);
    };

    webApp.BackButton.show();
    webApp.BackButton.onClick(handleClick);

    return () => {
      webApp.BackButton.offClick(handleClick);
      webApp.BackButton.hide();
    };
  }, [navigate, onBack]);
}
