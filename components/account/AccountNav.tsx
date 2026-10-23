"use client";

import { KeyRound, LogOut, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLogout } from "@/hooks/useAuth";

const links = [
  { href: "/my-account/profile", label: "My Profile", icon: UserRound },
  { href: "/my-account/orders", label: "My Orders", icon: ShoppingBag },
  { href: "/my-account/change-password", label: "Change Password", icon: KeyRound },
];

const itemClass =
  "flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm text-foreground transition-colors hover:bg-fill-thumbnail aria-[current=page]:bg-fill-thumbnail aria-[current=page]:font-semibold";

/** Account sidebar: a column on desktop, a 2x2 grid on small screens. */
const AccountNav = () => {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <nav aria-label="My account" className="rounded-md border p-2">
      <ul className="grid grid-cols-2 gap-1 lg:flex lg:flex-col">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={itemClass}
            >
              <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
            className={itemClass}
          >
            <LogOut className="size-5 text-muted-foreground" aria-hidden="true" />
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AccountNav;
