"use client";

import type { AnyFieldApi } from "@tanstack/react-form";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/** Keeps the session after the browser closes when switched on. */
const RememberMeField = ({ field }: { field: AnyFieldApi }) => (
  <div className="flex items-center gap-2.5">
    <Switch
      id={field.name}
      checked={field.state.value as boolean}
      onCheckedChange={(checked) => field.handleChange(checked)}
    />
    <Label htmlFor={field.name}>Remember me</Label>
  </div>
);

export default RememberMeField;
