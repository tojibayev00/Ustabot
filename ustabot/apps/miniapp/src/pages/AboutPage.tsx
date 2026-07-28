import { useQuery } from "@tanstack/react-query";
import { Send, MessageCircle, Shield, FileText } from "lucide-react";
import { settingsApi } from "@/services/api.service.js";
import { useTelegramBackButton } from "@/hooks/useTelegramBackButton.js";
import { useTelegram } from "@/hooks/useTelegram.js";
import { Card } from "@/components/ui/card.js";

export default function AboutPage(): JSX.Element {
  useTelegramBackButton();
  const { webApp } = useTelegram();
  const { data: settings } = useQuery({ queryKey: ["app-settings"], queryFn: settingsApi.get });

  function openLink(url: string): void {
    if (webApp) webApp.openLink(url);
    else window.open(url, "_blank");
  }

  return (
    <div className="space-y-5 pb-8 pt-4">
      <div className="px-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-link/10 text-3xl">
          🛠️
        </div>
        <h1 className="mt-3 text-lg font-bold text-text">Ustalar Topish</h1>
        <p className="mt-1 text-sm text-hint">Versiya {settings?.appVersion ?? "1.0.0"}</p>
      </div>

      <div className="px-4">
        <p className="text-sm leading-relaxed text-text/90">
          <b>Ustalar Topish</b> — foydalanuvchilarga o'z hududidagi professional ustalarni tez va
          ishonchli topish imkonini beruvchi platforma. Santexnikdan tortib qurilishgacha —
          barcha xizmat turlari bir joyda.
        </p>
      </div>

      <div className="px-4">
        <Card className="divide-y divide-hint/10">
          {settings?.telegramChannel && (
            <button
              onClick={() => openLink(settings.telegramChannel!)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-text"
            >
              <Send className="h-5 w-5 text-hint" /> Rasmiy kanal
            </button>
          )}
          {settings?.supportUsername && (
            <button
              onClick={() => openLink(`https://t.me/${settings.supportUsername}`)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-text"
            >
              <MessageCircle className="h-5 w-5 text-hint" /> Qo'llab-quvvatlash
            </button>
          )}
          <div className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-text">
            <Shield className="h-5 w-5 text-hint" /> Maxfiylik siyosati
          </div>
          <div className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] text-text">
            <FileText className="h-5 w-5 text-hint" /> Foydalanish shartlari
          </div>
        </Card>
      </div>

      <p className="px-4 text-center text-xs text-hint">
        © {new Date().getFullYear()} Ustalar Topish. Barcha huquqlar himoyalangan.
      </p>
    </div>
  );
}
