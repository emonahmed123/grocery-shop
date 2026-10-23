import { ShoppingBasket } from "lucide-react";

/** Square brand icon that still reads well when the sidebar collapses to icons. */
const BrandMark = () => (
  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground">
    <ShoppingBasket className="size-4.5" aria-hidden="true" />
  </div>
);

export default BrandMark;
