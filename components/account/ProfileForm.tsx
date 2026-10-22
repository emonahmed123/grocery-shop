"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProfileAction } from "@/app/(mainlayout)/my-account/profile/_action";
import AppField from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { authKeys, useMe } from "@/hooks/useAuth";
import type { AuthUser } from "@/types/auth.types";
import { type IProfilePayload, profileZodSchema } from "@/zod/account.validation";

const ProfileFields = ({ user }: { user: AuthUser }) => {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: async (payload: IProfilePayload) => {
      const result = await updateProfileAction(payload);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: ({ data, message }) => {
      // The header reads the same cache, so the new name shows everywhere at once.
      queryClient.setQueryData(authKeys.me, data);
      toast.success(message);
    },
  });

  const form = useForm({
    defaultValues: { name: user.name } satisfies IProfilePayload,
    validators: { onChange: profileZodSchema },
    onSubmit: ({ value }) => update.mutate(value),
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <form.Field name="name">
          {(field) => <AppField field={field} label="Full Name" autoComplete="name" />}
        </form.Field>

        <div className="flex flex-col gap-2.5">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" value={user.email} disabled readOnly className="h-12" />
          <p className="text-xs text-muted-foreground">Your email is used to sign in and cannot be changed.</p>
        </div>
      </div>

      {update.error && (
        <Alert variant="destructive">
          <AlertDescription>{update.error.message}</AlertDescription>
        </Alert>
      )}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isDirty] as const}>
        {([canSubmit, isDirty]) => (
          <div className="sm:w-56">
            <AppSubmitButton isPending={update.isPending} pendingLabel="Saving..." disabled={!canSubmit || !isDirty}>
              Save Changes
            </AppSubmitButton>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
};

/** Waits for the signed-in user, then edits their details. */
const ProfileForm = () => {
  const { data: user, isPending, refetch } = useMe();

  if (isPending) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          We could not load your profile.{" "}
          <button type="button" onClick={() => refetch()} className="font-semibold underline">
            Try again
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  return <ProfileFields key={user.id} user={user} />;
};

export default ProfileForm;
