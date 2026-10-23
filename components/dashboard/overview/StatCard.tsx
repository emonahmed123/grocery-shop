import type { LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: LucideIcon;
  isLoading?: boolean;
}

const StatCard = ({ label, value, hint, icon: Icon, isLoading = false }: StatCardProps) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border bg-background p-5">
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <p className="mt-1 font-manrope text-2xl font-bold text-foreground lg:text-3xl">{value}</p>
      )}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
      <Icon className="size-5" aria-hidden="true" />
    </div>
  </div>
);

export default StatCard;
