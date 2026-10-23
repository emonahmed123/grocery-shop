import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type QuantityCounterProps = {
  quantity: number;
  /** Product name, so screen readers hear "Increase Lettuce quantity". */
  label: string;
  onDecrease: () => void;
  onIncrease: () => void;
  /** False once the quantity reaches the stock. */
  canIncrease?: boolean;
  /** `card`: white pill over the product image. `compact`: small row in the cart drawer. */
  variant?: "card" | "compact";
};

const QuantityCounter = ({
  quantity,
  label,
  onDecrease,
  onIncrease,
  canIncrease = true,
  variant = "card",
}: QuantityCounterProps) => {
  const isCard = variant === "card";

  return (
    <div
      className={
        isCard
          ? "flex h-9 w-full items-center justify-between rounded-full bg-background px-1 shadow-md lg:h-10"
          : "flex items-center gap-2.5"
      }
    >
      <Button
        variant={isCard ? "ghost" : "outline"}
        size={isCard ? "icon-circle" : "icon-circle-sm"}
        aria-label={`Decrease ${label} quantity`}
        onClick={onDecrease}
      >
        <Minus />
      </Button>
      <span
        aria-live="polite"
        className="min-w-6 text-center text-sm font-semibold text-foreground"
      >
        {quantity}
      </span>
      <Button
        variant={isCard ? "ghost" : "outline"}
        size={isCard ? "icon-circle" : "icon-circle-sm"}
        aria-label={`Increase ${label} quantity`}
        disabled={!canIncrease}
        onClick={onIncrease}
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityCounter;
