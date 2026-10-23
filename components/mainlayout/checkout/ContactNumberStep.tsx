"use client";

import { Phone } from "lucide-react";

import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useCheckoutActions, usePhone } from "@/store/checkout.store";

/** The rider calls this number on delivery. */
const ContactNumberStep = () => {
  const phone = usePhone();
  const { updatePhone } = useCheckoutActions();

  return (
    <div className="flex max-w-md flex-col gap-2.5">
      <Label htmlFor="phone">Mobile number</Label>
      <InputGroup className="h-12">
        <InputGroupAddon>
          <Phone aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => updatePhone(event.target.value)}
          placeholder="01XXXXXXXXX"
          aria-describedby="phone-hint"
        />
      </InputGroup>
      <p id="phone-hint" className="text-sm text-muted-foreground">
        A Bangladeshi mobile number, e.g. 01712345678.
      </p>
    </div>
  );
};

export default ContactNumberStep;
