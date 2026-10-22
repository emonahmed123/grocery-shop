import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FilterOption } from "@/types/category";
import { ChevronDown } from "lucide-react";

type OptionFilterProps = {
  title: string;
  /** Prefix for input ids, e.g. "dietary". */
  name: string;
  options: FilterOption[];
  /** Number of options shown before "See more"; shows all when omitted. */
  visibleCount?: number;
};

const OptionFilter = ({
  title,
  name,
  options,
  visibleCount,
}: OptionFilterProps) => {
  const visible = visibleCount ? options.slice(0, visibleCount) : options;
  const hasMore = visible.length < options.length;

  return (
    <section>
      <h3 className="mb-5 text-base font-semibold text-foreground">{title}</h3>
      <div className="rounded-md border px-5">
        {visible.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between gap-3 py-3.5 not-last:border-b"
          >
            <Label htmlFor={`${name}-${option.slug}`} className="flex-1">
              {option.name}
            </Label>
            <Checkbox id={`${name}-${option.slug}`} value={option.slug} />
          </div>
        ))}
        {hasMore && (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 py-3.5 text-sm font-medium text-brand"
          >
            See more
            <ChevronDown className="size-4" />
          </button>
        )}
      </div>
    </section>
  );
};

export default OptionFilter;
