"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const fields = [
  {
    id: "name",
    label: "Full Name (required)",
    type: "text",
    placeholder: "Enter Your Full Name",
    autoComplete: "name",
  },
  {
    id: "email",
    label: "Email Address (required)",
    type: "email",
    placeholder: "Enter Your Email",
    autoComplete: "email",
  },
  {
    id: "phone",
    label: "Phone (Optional)",
    type: "tel",
    placeholder: "Enter Your Phone",
    autoComplete: "tel",
  },
];

// No backend yet, so submitting only keeps the page from reloading.
const ContactForm = () => {
  return (
    <form
      noValidate
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-col gap-5"
    >
      {fields.map((field) => (
        <div key={field.id}>
          <Label htmlFor={field.id} className="mb-3">
            {field.label}
          </Label>
          <Input
            id={field.id}
            name={field.id}
            type={field.type}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            className="h-12"
          />
        </div>
      ))}
      <div>
        <Label htmlFor="message" className="mb-3">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Briefly describe.."
        />
      </div>
      <Button type="submit" variant="brand" size="lg" className="h-12 w-full">
        Send Message
      </Button>
    </form>
  );
};

export default ContactForm;
