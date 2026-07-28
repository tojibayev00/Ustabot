import { getTelegramWebApp, type TelegramThemeParams } from "@/types/telegram.types.js";

const CSS_VAR_MAP: Record<keyof TelegramThemeParams, string> = {
  bg_color: "--tg-bg-color",
  secondary_bg_color: "--tg-secondary-bg-color",
  text_color: "--tg-text-color",
  hint_color: "--tg-hint-color",
  link_color: "--tg-link-color",
  button_color: "--tg-button-color",
  button_text_color: "--tg-button-text-color",
  header_bg_color: "--tg-header-bg-color",
  accent_text_color: "--tg-accent-text-color",
  section_bg_color: "--tg-section-bg-color",
  section_header_text_color: "--tg-section-header-text-color",
  subtitle_text_color: "--tg-subtitle-text-color",
  destructive_text_color: "--tg-destructive-text-color"
};

/**
 * Telegram'dan kelgan theme parametrlarini CSS custom propertylarga yozadi.
 * Shu tufayli butun ilova (Tailwind orqali) avtomatik ravishda Telegram'ning
 * joriy mavzusiga (och/qorong'i) moslashadi — hech qanday rang qattiq
 * kodlanmagan (Part 8: "Never hardcode colors").
 */
export function applyTelegramTheme(): void {
  const webApp = getTelegramWebApp();
  if (!webApp) return;

  const root = document.documentElement;

  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP) as [keyof TelegramThemeParams, string][]) {
    const value = webApp.themeParams[key];
    if (value) {
      root.style.setProperty(cssVar, value);
    }
  }

  root.classList.toggle("dark", webApp.colorScheme === "dark");
}

export function subscribeToThemeChanges(onChange: () => void): () => void {
  const webApp = getTelegramWebApp();
  if (!webApp) return () => undefined;

  const handler = (): void => {
    applyTelegramTheme();
    onChange();
  };

  webApp.onEvent("themeChanged", handler);
  return () => webApp.offEvent("themeChanged", handler);
}
