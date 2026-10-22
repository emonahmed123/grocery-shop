"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { changePasswordAction } from "@/actions/account.actions";
import AppField from "@/components/form/AppField";
import AppSubmitButton from "@/components/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { changePasswordZodSchema, type IChangePasswordPayload } from "@/zod/account.validation";

const defaultValues: IChangePasswordPayload = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordForm = () => {
  const change = useMutation({
    mutationFn: async (payload: IChangePasswordPayload) => {
      const result = await changePasswordAction(payload);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      form.reset();
    },
  });

  const form = useForm({
    defaultValues,
    validators: { onChange: changePasswordZodSchema },
    onSubmit: ({ value }) => change.mutate(value),
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="flex max-w-xl flex-col gap-5"
    >
      <form.Field name="oldPassword">
        {(field) => (
          <AppField field={field} label="Old Password" type="password" autoComplete="current-password" />
        )}
      </form.Field>

      <form.Field name="newPassword">
        {(field) => (
          <AppField field={field} label="New Password" type="password" autoComplete="new-password" />
        )}
      </form.Field>

      <form.Field name="confirmPassword">
        {(field) => (
          <AppField field={field} label="Confirm New Password" type="password" autoComplete="new-password" />
        )}
      </form.Field>

      {change.error && (
        <Alert variant="destructive">
          <AlertDescription>{change.error.message}</AlertDescription>
        </Alert>
      )}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <div className="sm:w-56">
            <AppSubmitButton isPending={change.isPending} pendingLabel="Changing..." disabled={!canSubmit}>
              Change Password
            </AppSubmitButton>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
};

export default ChangePasswordForm;
