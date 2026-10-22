import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

const sortOptions = [
  { value: "lowest-price", label: "Lowest Price" },
  { value: "highest-price", label: "Highest Price" },
  { value: "newest", label: "Newest" },
  { value: "popularity", label: "Popularity" },
];

type SearchToolbarProps = {
  total: number;
};

const SearchToolbar = ({ total }: SearchToolbarProps) => {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {/* The filters drawer for small screens comes with the filtering logic. */}
        <Button variant="outline" className="lg:hidden">
          <SlidersHorizontal />
          Filters
        </Button>
        <p className="text-sm font-semibold text-foreground md:text-base">
          {total.toLocaleString("en-US")} Items Found
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select defaultValue={sortOptions[0].value}>
          <SelectTrigger aria-label="Sort products">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchToolbar;
