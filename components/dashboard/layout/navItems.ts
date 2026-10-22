import { KeyRound, LayoutDashboard, type LucideIcon, Package, ShoppingBag, Store, UserRound, Zap } from "lucide-react";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const dashboardNav: { title: string; items: DashboardNavItem[] }[] = [
  {
    title: "Manage",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/products", label: "Products", icon: Package },
      { href: "/dashboard/flash-sale", label: "Flash Sale", icon: Zap },
      { href: "/dashboard/orders", label: "All Orders", icon: ShoppingBag },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/dashboard/profile", label: "My Profile", icon: UserRound },
      { href: "/dashboard/change-password", label: "Change Password", icon: KeyRound },
    ],
  },
  {
    title: "Storefront",
    items: [{ href: "/", label: "Visit Store", icon: Store }],
  },
];

/** `/dashboard` matches exactly; sections also match their sub-pages. */
export const isActiveNavItem = (pathname: string, href: string) =>
  href === "/dashboard" || href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

/** The dashboard page the path belongs to, for the header breadcrumb. */
export const getActiveNavItem = (pathname: string) =>
  dashboardNav
    .flatMap((section) => section.items)
    .find((item) => item.href.startsWith("/dashboard") && isActiveNavItem(pathname, item.href));
