"use client";

import { KeyRound, LogOut, Store, UserRound } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout, useMe } from "@/hooks/useAuth";
import type { AuthUser } from "@/types/auth.types";
import { getInitials } from "@/lib/utils";

/** Avatar with the small "online" dot used in the AdminCN header. */
const UserAvatar = ({ user }: { user: AuthUser }) => (
  <div className="relative">
    <Avatar>
      {user.image && <AvatarImage src={user.image} alt="" />}
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
    <span className="absolute right-0 bottom-0 block size-2 rounded-full bg-brand ring-2 ring-background" />
  </div>
);

const ProfileDropdown = () => {
  const { data: user, isPending } = useMe();
  const logout = useLogout();

  if (isPending) {
    return (
      <div className="size-9 overflow-hidden rounded-full">
        <Skeleton className="size-full" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-circle" aria-label="Account menu">
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-1 font-normal">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <UserRound />
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/change-password">
              <KeyRound />
              Change Password
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">
              <Store />
              Visit Store
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={logout.isPending} onSelect={() => logout.mutate()}>
          <LogOut />
          {logout.isPending ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
