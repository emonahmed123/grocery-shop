import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = [1, 2, 3, 4, 5];

/** Read-only star rating; half values round to the nearest star. */
const Stars = ({ rating, className }: { rating: number; className?: string }) => (
  <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
    {STEPS.map((step) => (
      <Star
        key={step}
        aria-hidden="true"
        className={cn("size-4", step <= Math.round(rating) ? "fill-brand text-brand" : "text-border", className)}
      />
    ))}
  </div>
);

export default Stars;
