"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Mail, SendHorizontal } from "lucide-react";

// No newsletter backend yet, so submitting only keeps the page from reloading.
const NewsletterForm = () => {
  return (
    <form
      noValidate
      onSubmit={(event) => event.preventDefault()}
      className="mt-5 max-w-100"
    >
      <InputGroup className="h-12">
        <InputGroupAddon>
          <Mail />
        </InputGroupAddon>
        <InputGroupInput
          type="email"
          name="email"
          placeholder="Write your email here"
          aria-label="Email address"
          autoComplete="email"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton type="submit" size="icon-sm" aria-label="Subscribe">
            <SendHorizontal className="text-brand" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
};

export default NewsletterForm;
