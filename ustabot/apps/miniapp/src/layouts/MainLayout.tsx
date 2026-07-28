import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/navigation/BottomNav.js";
import { OfflineBanner } from "@/components/common/OfflineBanner.js";

export function MainLayout(): JSX.Element {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg pb-[calc(64px+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
      <OfflineBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
