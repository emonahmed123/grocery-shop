"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface DataTableFilterOption {
  label: string;
  value: string;
}

/** A single-choice filter on one column, e.g. category or status. */
export interface DataTableFilterConfig {
  columnId: string;
  label: string;
  options: DataTableFilterOption[];
}

const ALL = "__all__";

interface DataTableFiltersProps {
  filters: DataTableFilterConfig[];
  values: Record<string, string | undefined>;
  onFilterChange: (columnId: string, value: string | undefined) => void;
  onClearAll: () => void;
}

const DataTableFilters = ({ filters, values, onFilterChange, onClearAll }: DataTableFiltersProps) => {
  const hasActiveFilter = filters.some((filter) => values[filter.columnId]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Select
          key={filter.columnId}
          value={values[filter.columnId] ?? ALL}
          onValueChange={(value) => onFilterChange(filter.columnId, value === ALL ? undefined : value)}
        >
          <SelectTrigger size="lg" aria-label={`Filter by ${filter.label}`} className="min-w-44">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value={ALL}>All {filter.label}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {hasActiveFilter && (
        <Button type="button" variant="ghost" onClick={onClearAll}>
          <X data-icon="inline-start" />
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default DataTableFilters;
