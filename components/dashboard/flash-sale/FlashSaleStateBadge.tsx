import { Badge } from "@/components/ui/badge";
import type { FlashSaleState } from "@/types/dashboard.types";

const STATES: Record<FlashSaleState, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  live: { label: "Live", variant: "success" },
  scheduled: { label: "Scheduled", variant: "warning" },
  "sold-out": { label: "Sold out", variant: "secondary" },
  ended: { label: "Ended", variant: "secondary" },
  removed: { label: "Removed", variant: "destructive" },
  replaced: { label: "Replaced", variant: "outline" },
};

export const FLASH_SALE_STATE_OPTIONS = (Object.keys(STATES) as FlashSaleState[]).map((state) => ({
  label: STATES[state].label,
  value: state,
}));

const FlashSaleStateBadge = ({ state }: { state: FlashSaleState }) => {
  const { label, variant } = STATES[state] ?? { label: state, variant: "secondary" };
  return <Badge variant={variant}>{label}</Badge>;
};

export default FlashSaleStateBadge;
