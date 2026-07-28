import { LayoutDashboard, Users2, Flag, LayoutGrid, Radio, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/workers", label: "Ustalar", icon: ShieldCheck },
  { path: "/admin/reports", label: "Shikoyatlar", icon: Flag },
  { path: "/admin/categories", label: "Kategoriyalar", icon: LayoutGrid },
  { path: "/admin/users", label: "Foydalanuvchilar", icon: Users2 },
  { path: "/admin/broadcast", label: "Broadcast", icon: Radio }
];
