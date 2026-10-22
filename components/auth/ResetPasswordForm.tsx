"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { resetPasswordAction } from "@/app/(auth)/reset-password/_action";
import AppField from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";

/** `token` comes from the emailed link and travels with the form, unseen. */
const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();

  const reset = useMutation({
    mutationFn: async (payload: IResetPasswordPayload) => {
      const result = await resetPasswordAction(payload);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      router.replace("/login");
    },
  });

  const form = useForm({
    defaultValues: { token, password: "", confirmPassword: "" } satisfies IResetPasswordPayload,
    validators: { onChange: resetPasswordZodSchema },
    onSubmit: ({ value }) => reset.mutate(value),
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
      <form.Field name="password">
        {(field) => (
          <AppField field={field} label="New Password" type="password" autoComplete="new-password" />
        )}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => (
          <AppField field={field} label="Confirm New Password" type="password" autoComplete="new-password" />
        )}
      </form.Field>

      <p className="text-xs text-muted-foreground">Use at least 8 characters with a letter and a number.</p>

      {reset.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {reset.error.message}{" "}
            {/expired|invalid/i.test(reset.error.message) && (
              <Link href="/forgot-password" className="font-semibold underline">
                Request a new link
              </Link>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <AppSubmitButton isPending={reset.isPending} pendingLabel="Resetting..." disabled={!canSubmit}>
            Reset Password
          </AppSubmitButton>
        )}
      </form.Subscribe>
    </form>
  );
};

export default ResetPasswordForm;
