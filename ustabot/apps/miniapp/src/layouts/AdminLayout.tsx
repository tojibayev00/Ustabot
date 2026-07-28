import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavigation.js";
import { cn } from "@/utils/cn.js";

export function AdminLayout(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-bg md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-hint/10 bg-header-bg md:block">
        <div className="flex items-center gap-2 px-4 py-4">
          <button onClick={() => navigate("/")} className="text-hint">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-[15px] font-semibold text-text">Admin Panel</span>
        </div>
        <nav className="space-y-0.5 px-2">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium",
                  isActive ? "bg-link/10 text-link" : "text-text hover:bg-secondary-bg"
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 pb-16 md:pb-0">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 border-b border-hint/10 bg-header-bg px-4 py-3 md:hidden">
          <button onClick={() => navigate("/")} className="text-hint">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-[15px] font-semibold text-text">Admin Panel</span>
        </div>

        <main className="p-4">
          <Outlet />
        </main>

        {/* Mobile bottom tabs */}
        <nav className="fixed inset-x-0 bottom-0 z-40 flex overflow-x-auto border-t border-hint/10 bg-header-bg pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 md:hidden">
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex min-w-[76px] flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium",
                  isActive ? "text-link" : "text-hint"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
