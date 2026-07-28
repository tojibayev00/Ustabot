import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.js";
import { getTelegramWebApp } from "@/types/telegram.types.js";
import { applyTelegramTheme } from "@/theme/telegramTheme.js";
import "@/index.css";

const webApp = getTelegramWebApp();

if (webApp) {
  webApp.ready();
  webApp.expand();
  applyTelegramTheme();
} else {
  // eslint-disable-next-line no-console
  console.warn("Telegram WebApp topilmadi — brauzerda standart mavzu bilan ishga tushirilmoqda");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("#root elementi topilmadi");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
