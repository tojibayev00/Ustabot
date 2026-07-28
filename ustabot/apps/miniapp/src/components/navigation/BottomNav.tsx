import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/constants/navigation.js";
import { cn } from "@/utils/cn.js";

export function BottomNav(): JSX.Element {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-hint/10 bg-header-bg pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5"
      aria-label="Asosiy navigatsiya"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            cn(
              "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-md py-1 text-[11px] font-medium transition-colors",
              isActive ? "text-link" : "text-hint"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 1.8} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
