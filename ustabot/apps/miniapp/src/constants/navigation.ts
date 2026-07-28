import { Home, Search, PlusCircle, User, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

/** Maksimal 5 tab (Part 6: "Maximum 5 tabs") */
export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Bosh sahifa", icon: Home },
  { path: "/search", label: "Qidiruv", icon: Search },
  { path: "/become-worker", label: "Usta bo'lish", icon: PlusCircle },
  { path: "/profile", label: "Profil", icon: User },
  { path: "/about", label: "Ma'lumot", icon: Info }
];
