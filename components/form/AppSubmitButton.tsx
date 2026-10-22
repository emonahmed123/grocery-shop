import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type AppSubmitButtonProps = {
  isPending: boolean;
  pendingLabel: string;
  disabled?: boolean;
  children: React.ReactNode;
};

const AppSubmitButton = ({ isPending, pendingLabel, disabled = false, children }: AppSubmitButtonProps) => (
  <Button
    type="submit"
    variant="brand"
    size="lg"
    disabled={disabled || isPending}
    aria-busy={isPending}
    className="h-12 w-full"
  >
    {isPending ? (
      <>
        <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" />
        {pendingLabel}
      </>
    ) : (
      children
    )}
  </Button>
);

export default AppSubmitButton;
