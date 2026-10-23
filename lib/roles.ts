import type { AuthUser } from "@/types/auth.types";

export const USER_ROLES = { user: "user", admin: "admin" } as const;

export const isAdmin = (user: Pick<AuthUser, "role"> | null | undefined) =>
  user?.role === USER_ROLES.admin;
