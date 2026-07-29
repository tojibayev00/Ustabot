import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout.js";
import { SimpleLayout } from "@/layouts/SimpleLayout.js";
import { AdminLayout } from "@/layouts/AdminLayout.js";
import { AdminGuard } from "@/components/admin/AdminGuard.js";
import { FullScreenLoader } from "@/components/common/LoadingSpinner.js";

const HomePage = lazy(() => import("@/pages/HomePage.js"));
const SearchPage = lazy(() => import("@/pages/SearchPage.js"));
const WorkerProfilePage = lazy(() => import("@/pages/WorkerProfilePage.js"));
const BecomeWorkerPage = lazy(() => import("@/pages/BecomeWorkerPage.js"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage.js"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage.js"));
const AboutPage = lazy(() => import("@/pages/AboutPage.js"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage.js"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.js"));

const AdminDashboardPage = lazy(() => import("@/pages/admin/AdminDashboardPage.js"));
const AdminWorkersPage = lazy(() => import("@/pages/admin/AdminWorkersPage.js"));
const AdminReportsPage = lazy(() => import("@/pages/admin/AdminReportsPage.js"));
const AdminCategoriesPage = lazy(() => import("@/pages/admin/AdminCategoriesPage.js"));
const AdminUsersPage = lazy(() => import("@/pages/admin/AdminUsersPage.js"));
const AdminBroadcastPage = lazy(() => import("@/pages/admin/AdminBroadcastPage.js"));

function withSuspense(element: JSX.Element): JSX.Element {
  return <Suspense fallback={<FullScreenLoader />}>{element}</Suspense>;
}

// GitHub Pages kabi subpath ostida joylashtirilganda (masalan /ustabot/) to'g'ri
// ishlashi uchun. Vite build vaqtida `base` konfiguratsiyasidan avtomatik oladi.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

const router = createBrowserRouter(
  [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: withSuspense(<HomePage />) },
      { path: "/search", element: withSuspense(<SearchPage />) },
      { path: "/become-worker", element: withSuspense(<BecomeWorkerPage />) },
      { path: "/profile", element: withSuspense(<ProfilePage />) },
      { path: "/about", element: withSuspense(<AboutPage />) }
    ]
  },
  {
    element: <SimpleLayout />,
    children: [
      { path: "/workers/:id", element: withSuspense(<WorkerProfilePage />) },
      { path: "/settings", element: withSuspense(<SettingsPage />) },
      { path: "/notifications", element: withSuspense(<NotificationsPage />) }
    ]
  },
  {
    element: <AdminGuard />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: withSuspense(<AdminDashboardPage />) },
          { path: "/admin/workers", element: withSuspense(<AdminWorkersPage />) },
          { path: "/admin/reports", element: withSuspense(<AdminReportsPage />) },
          { path: "/admin/categories", element: withSuspense(<AdminCategoriesPage />) },
          { path: "/admin/users", element: withSuspense(<AdminUsersPage />) },
          { path: "/admin/broadcast", element: withSuspense(<AdminBroadcastPage />) }
        ]
      }
    ]
  },
  {
    element: <SimpleLayout />,
    children: [{ path: "*", element: withSuspense(<NotFoundPage />) }]
  }
],
  { basename }
);

export function AppRouter(): JSX.Element {
  return <RouterProvider router={router} />;
}
