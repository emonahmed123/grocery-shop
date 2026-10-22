"use client";

import type { AnyFieldApi } from "@tanstack/react-form";

import { getFieldError } from "@/components/form/AppField";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AppTextareaFieldProps = {
  field: AnyFieldApi;
  label: string;
  placeholder?: string;
  rows?: number;
};

/** Multi-line counterpart of AppField with the same label and error layout. */
const AppTextareaField = ({ field, label, placeholder, rows = 4 }: AppTextareaFieldProps) => {
  const error = getFieldError(field);
  const errorId = `${field.name}-error`;

  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={field.name}>{label}</Label>
      <Textarea
        id={field.name}
        name={field.name}
        rows={rows}
        value={field.state.value as string}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={error !== null}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

export default AppTextareaField;
