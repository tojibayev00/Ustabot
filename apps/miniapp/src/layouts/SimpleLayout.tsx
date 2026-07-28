import { Outlet } from "react-router-dom";
import { OfflineBanner } from "@/components/common/OfflineBanner.js";

export function SimpleLayout(): JSX.Element {
  return (
    <div className="min-h-[100dvh] bg-bg pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <OfflineBanner />
      <Outlet />
    </div>
  );
}
