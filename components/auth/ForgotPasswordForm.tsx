"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { MailCheck } from "lucide-react";
import Link from "next/link";

import { forgotPasswordAction } from "@/app/(auth)/forgot-password/_action";
import AppField from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { forgotPasswordZodSchema, type IForgotPasswordPayload } from "@/zod/auth.validation";

const defaultValues: IForgotPasswordPayload = { email: "" };

/** Shown after the request; worded the same whether or not the email has an account. */
const LinkSent = ({ email, onRetry }: { email: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center gap-5 text-center">
    <div className="flex size-14 items-center justify-center rounded-full bg-brand/10 text-brand">
      <MailCheck className="size-7" aria-hidden="true" />
    </div>
    <div className="flex flex-col gap-2" role="status">
      <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        If an account exists for <span className="font-medium text-foreground">{email}</span>, we have sent a
        link to reset your password. It may take a few minutes to arrive.
      </p>
    </div>
    <div className="flex w-full flex-col gap-3">
      <Button asChild variant="brand" size="lg" className="h-12 w-full">
        <Link href="/login">Back to Sign In</Link>
      </Button>
      <Button type="button" variant="ghost" onClick={onRetry}>
        Use a different email
      </Button>
    </div>
  </div>
);

const ForgotPasswordForm = () => {
  const request = useMutation({
    mutationFn: async (payload: IForgotPasswordPayload) => {
      const result = await forgotPasswordAction(payload);
      if (!result.success) throw new Error(result.message);
      return payload.email;
    },
  });

  const form = useForm({
    defaultValues,
    validators: { onChange: forgotPasswordZodSchema },
    onSubmit: ({ value }) => request.mutate(value),
  });

  if (request.isSuccess) {
    return (
      <LinkSent
        email={request.data}
        onRetry={() => {
          request.reset();
          form.reset();
        }}
      />
    );
  }

  return (
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
          <AppField
            field={field}
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        )}
      </form.Field>

      {request.error && (
        <Alert variant="destructive">
          <AlertDescription>{request.error.message}</AlertDescription>
        </Alert>
      )}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <AppSubmitButton isPending={request.isPending} pendingLabel="Sending..." disabled={!canSubmit}>
            Send Reset Link
          </AppSubmitButton>
        )}
      </form.Subscribe>
    </form>
  );
};

export default ForgotPasswordForm;
