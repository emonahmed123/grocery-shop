"use client";

import {
  isActiveLink,
  mainLinks,
  pageLinks,
  type NavLink,
} from "@/components/mainlayout/layout/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout, useMe } from "@/hooks/useAuth";
import { isAdmin } from "@/lib/roles";
import { getInitials } from "@/lib/utils";
import { LayoutDashboard, LogOut, Menu, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkListProps = {
  links: NavLink[];
  pathname: string;
};

const LinkList = ({ links, pathname }: LinkListProps) => (
  <ul className="flex flex-col">
    {links.map((link) => (
      <li key={link.href}>
        <SheetClose asChild>
          <Link
            href={link.href}
            aria-current={isActiveLink(pathname, link) ? "page" : undefined}
            className="block rounded-md px-3 py-2.5 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground"
          >
            {link.label}
          </Link>
        </SheetClose>
      </li>
    ))}
  </ul>
);

/** Account area at the bottom of the menu: login for guests, logout for users. */
const MobileAccount = () => {
  const { data: user, isPending } = useMe();
  const logout = useLogout();

  if (isPending) return <Skeleton className="h-9 w-full" />;

  if (!user) {
    return (
      <SheetClose asChild>
        <Button asChild variant="brand" size="lg" className="w-full">
          <Link href="/login">
            <UserRound data-icon="inline-start" />
            Login
          </Link>
        </Button>
      </SheetClose>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Avatar>
          {user.image && <AvatarImage src={user.image} alt="" />}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <SheetClose asChild>
        <Button asChild variant="brand" size="lg" className="w-full">
          {/* Admins manage their account from the dashboard; My Account is for customers. */}
          {isAdmin(user) ? (
            <Link href="/dashboard">
              <LayoutDashboard data-icon="inline-start" />
              Dashboard
            </Link>
          ) : (
            <Link href="/my-account/profile">
              <UserRound data-icon="inline-start" />
              My Account
            </Link>
          )}
        </Button>
      </SheetClose>
      <SheetClose asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          <LogOut data-icon="inline-start" />
          Logout
        </Button>
      </SheetClose>
    </div>
  );
};

/** Slide-in menu shown below the `lg` breakpoint. */
const MobileNav = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Image
            src="https://borobazar.vercel.app/_next/static/media/logo.026129ac.svg"
            width={131}
            height={30}
            alt="BoroBazar"
          />
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-1 flex-col gap-4 overflow-y-auto px-2">
          <LinkList links={mainLinks} pathname={pathname} />
          <Separator />
          <p className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Pages
          </p>
          <LinkList links={pageLinks} pathname={pathname} />
        </nav>
        <div className="p-4">
          <MobileAccount />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
