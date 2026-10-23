"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return String(error);
};

/** The field's first error, but only once the user has left the field. */
export const getFieldError = (field: AnyFieldApi) => {
  const { isTouched, errors } = field.state.meta;
  return isTouched && errors.length > 0 ? getErrorMessage(errors[0]) : null;
};

type AppFieldProps = {
  field: AnyFieldApi;
  label: string;
  type?: "text" | "email" | "password" | "number" | "url" | "datetime-local";
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  /** Id of a `<datalist>` with suggestions. */
  list?: string;
  min?: number;
  step?: number | "any";
};

/** Text input wired to a TanStack Form field; passwords get a show/hide toggle. */
const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  autoComplete,
  disabled = false,
  list,
  min,
  step,
}: AppFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const error = getFieldError(field);
  const errorId = `${field.name}-error`;

  const inputProps = {
    id: field.name,
    name: field.name,
    value: field.state.value as string,
    placeholder,
    autoComplete,
    disabled,
    list,
    min,
    step,
    onBlur: field.handleBlur,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value),
    "aria-invalid": error !== null,
    "aria-describedby": error ? errorId : undefined,
  };

  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={field.name}>{label}</Label>
      {type === "password" ? (
        <InputGroup className="h-12">
          <InputGroupInput {...inputProps} type={showPassword ? "text" : "password"} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-sm"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <Input {...inputProps} type={type} className="h-12" />
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

export default AppField;
