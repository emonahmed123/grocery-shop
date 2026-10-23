"use client";

import { Facebook, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const providers = [
  { name: "Facebook", icon: Facebook },
  { name: "Twitter", icon: Twitter },
  { name: "LinkedIn", icon: Linkedin },
];

// Placeholder until the backend supports OAuth providers.
const SocialLogin = () => (
  <div className="mt-6 flex flex-col items-center gap-4">
    <p className="text-sm text-muted-foreground">or continue with</p>
    <ul className="flex gap-2.5">
      {providers.map(({ name, icon: Icon }) => (
        <li key={name}>
          <Button
            type="button"
            variant="outline"
            size="icon-circle"
            aria-label={`Continue with ${name}`}
            onClick={() => toast.info(`${name} login is coming soon`)}
          >
            <Icon />
          </Button>
        </li>
      ))}
    </ul>
  </div>
);

export default SocialLogin;
