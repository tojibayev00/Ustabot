import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store.js";

const ADMIN_ROLES = new Set(["MODERATOR", "ADMIN", "SUPER_ADMIN"]);

export function AdminGuard(): JSX.Element {
  const user = useAuthStore((s) => s.user);

  if (!user || !ADMIN_ROLES.has(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
