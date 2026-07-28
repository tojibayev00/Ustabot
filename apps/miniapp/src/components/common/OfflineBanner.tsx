import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner(): JSX.Element | null {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = (): void => setIsOffline(false);
    const handleOffline = (): void => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-danger px-3 py-2 text-sm text-white animate-slide-up">
      <WifiOff className="h-4 w-4" />
      Internet aloqasi yo'q. Ba'zi ma'lumotlar keshdan ko'rsatilmoqda.
    </div>
  );
}
