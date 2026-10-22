"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { loginAction } from "@/app/(auth)/login/_action";
import AppField from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import RememberMeField from "@/components/auth/RememberMeField";
import SocialLogin from "@/components/auth/SocialLogin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authKeys } from "@/hooks/useAuth";
import { getSafeRedirect } from "@/lib/authRoutes";
import { type ILoginPayload, loginZodSchema } from "@/zod/auth.validation";

type LoginFormProps = {
  redirectPath?: string;
};

const defaultValues: ILoginPayload = { email: "", password: "", rememberMe: false };

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: async (payload: ILoginPayload) => {
      const result = await loginAction(payload);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (result) => {
      // The header reads this cache, so it shows the user without another request.
      queryClient.setQueryData(authKeys.me, result.data);
      toast.success(`Welcome back, ${result.data.name}!`);
      router.replace(getSafeRedirect(redirectPath));
      router.refresh();
    },
  });

  const form = useForm({
    defaultValues,
    validators: { onChange: loginZodSchema },
    onSubmit: ({ value }) => login.mutate(value),
  });

  return (
    <>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-5"
      >
        <form.Field name="email">
          {(field) => (
            <AppField field={field} label="Email Address" type="email" autoComplete="email" />
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <AppField field={field} label="Password" type="password" autoComplete="current-password" />
          )}
        </form.Field>

        <div className="flex items-center justify-between gap-3">
          <form.Field name="rememberMe">{(field) => <RememberMeField field={field} />}</form.Field>
          <button
            type="button"
            onClick={() => toast.info("Password reset is coming soon")}
            className="text-sm text-muted-foreground transition-colors hover:text-brand"
          >
            Forgot password?
          </button>
        </div>

        {login.error && (
          <Alert variant="destructive">
            <AlertDescription>{login.error.message}</AlertDescription>
          </Alert>
        )}

        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <AppSubmitButton isPending={login.isPending} pendingLabel="Signing In..." disabled={!canSubmit}>
              Sign In
            </AppSubmitButton>
          )}
        </form.Subscribe>
      </form>

      <SocialLogin />
    </>
  );
};

export default LoginForm;
