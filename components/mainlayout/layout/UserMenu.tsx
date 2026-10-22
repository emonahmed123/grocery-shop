"use client";

import { LogOut, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout, useMe } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";

/** Login button for guests, avatar menu with logout for signed-in users. */
const UserMenu = () => {
  const { data: user, isPending } = useMe();
  const logout = useLogout();

  if (isPending) {
    return (
      <div className="hidden sm:block">
        <Skeleton className="h-9 w-24" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button asChild variant="brand" size="lg" className="hidden sm:inline-flex">
        <Link href="/login">
          <UserRound data-icon="inline-start" />
          Login
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-circle" aria-label="Account menu">
          <Avatar>
            {user.image && <AvatarImage src={user.image} alt="" />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate font-semibold text-foreground">{user.name}</p>
          <p className="truncate font-normal">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/my-account/profile">
            <UserRound />
            My Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/my-account/orders">
            <ShoppingBag />
            My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onSelect={() => logout.mutate()}
        >
          <LogOut />
          {logout.isPending ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
