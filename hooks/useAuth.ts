"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getMeAction, logoutAction } from "@/actions/auth.actions";
import type { AuthUser } from "@/types/auth.types";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/** The logged-in user shared by every component; `null` means guest. */
export function useMe() {
  return useQuery<AuthUser | null>({
    queryKey: authKeys.me,
    queryFn: () => getMeAction(),
    staleTime: 5 * 60 * 1000,
    // Guests resolve to null (no error), so a retry only happens on real failures.
    retry: 1,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logoutAction(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      toast.success("You have been logged out");
      // Re-run the proxy so a protected page the user is on sends them to login.
      router.refresh();
    },
    onError: () => toast.error("Logout failed, please try again"),
  });
}
