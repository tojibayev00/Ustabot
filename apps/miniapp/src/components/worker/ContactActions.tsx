import { Phone, Send, MapPin, Share2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { ReportDialog } from "@/components/dialogs/ReportDialog.js";
import { useTelegram } from "@/hooks/useTelegram.js";
import type { WorkerDetail } from "@/services/api.service.js";

interface ContactActionsProps {
  worker: WorkerDetail;
}

export function ContactActions({ worker }: ContactActionsProps): JSX.Element {
  const { webApp } = useTelegram();

  function handleShare(): void {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(
      `${worker.firstName} ${worker.lastName} — ${worker.category.name}`
    )}`;

    if (webApp) {
      webApp.openTelegramLink(url);
    } else if (navigator.share) {
      void navigator.share({ title: worker.firstName, url: window.location.href });
    } else {
      void navigator.clipboard.writeText(window.location.href);
    }
  }

  function handleOpenMaps(): void {
    const url = `https://www.google.com/maps/search/?api=1&query=${worker.latitude},${worker.longitude}`;
    if (webApp) webApp.openLink(url);
    else window.open(url, "_blank");
  }

  function handleOpenTelegram(): void {
    if (!worker.telegramUsername) return;
    const url = `https://t.me/${worker.telegramUsername}`;
    if (webApp) webApp.openTelegramLink(url);
    else window.open(url, "_blank");
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button asChild variant="primary">
        <a href={`tel:${worker.phone}`}>
          <Phone className="h-4 w-4" /> Qo'ng'iroq qilish
        </a>
      </Button>

      {worker.telegramUsername && (
        <Button variant="secondary" onClick={handleOpenTelegram}>
          <Send className="h-4 w-4" /> Telegram
        </Button>
      )}

      <Button variant="secondary" onClick={handleOpenMaps}>
        <MapPin className="h-4 w-4" /> Xaritada ko'rish
      </Button>

      <Button variant="secondary" onClick={handleShare}>
        <Share2 className="h-4 w-4" /> Ulashish
      </Button>

      <ReportDialog
        workerId={worker.id}
        trigger={
          <Button variant="ghost" className="w-full text-danger">
            <Flag className="h-4 w-4" /> Shikoyat qilish
          </Button>
        }
      />
    </div>
  );
}
