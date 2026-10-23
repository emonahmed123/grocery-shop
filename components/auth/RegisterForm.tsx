"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { registerAction } from "@/app/(auth)/register/_action";
import AppField from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import RememberMeField from "@/components/auth/RememberMeField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authKeys } from "@/hooks/useAuth";
import { getSafeRedirect } from "@/lib/authRoutes";
import { type IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";

type RegisterFormProps = {
  redirectPath?: string;
};

const defaultValues: IRegisterPayload = { name: "", email: "", password: "", rememberMe: false };

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const register = useMutation({
    mutationFn: async (payload: IRegisterPayload) => {
      const result = await registerAction(payload);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: ({ data: user, message }) => {
      // No tokens from the backend: the account exists, but they still need to log in.
      if (!user) {
        toast.success(`${message}. Please sign in.`);
        router.push(redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login");
        return;
      }

      queryClient.setQueryData(authKeys.me, user);
      toast.success(`Welcome to BoroBazar, ${user.name}!`);
      router.replace(getSafeRedirect(redirectPath));
      router.refresh();
    },
  });

  const form = useForm({
    defaultValues,
    validators: { onChange: registerZodSchema },
    onSubmit: ({ value }) => register.mutate(value),
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
      <form.Field name="name">
        {(field) => <AppField field={field} label="Name" autoComplete="name" />}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <AppField field={field} label="Email Address" type="email" autoComplete="email" />
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <AppField field={field} label="Password" type="password" autoComplete="new-password" />
        )}
      </form.Field>

      <div className="flex items-center justify-between gap-3">
        <form.Field name="rememberMe">{(field) => <RememberMeField field={field} />}</form.Field>
        <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-brand">
          Privacy and policy
        </Link>
      </div>

      {register.error && (
        <Alert variant="destructive">
          <AlertDescription>{register.error.message}</AlertDescription>
        </Alert>
      )}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <AppSubmitButton isPending={register.isPending} pendingLabel="Creating Account..." disabled={!canSubmit}>
            Register
          </AppSubmitButton>
        )}
      </form.Subscribe>
    </form>
  );
};

export default RegisterForm;
