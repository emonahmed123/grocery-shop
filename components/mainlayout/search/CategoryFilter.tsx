import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import Image from "next/image";
import Link from "next/link";

type CategoryFilterProps = {
  categories: Category[];
  activeSlug?: string;
};

const CategoryIcon = ({ category }: { category: Category }) => (
  <Image
    src={assetUrl(category.icon)}
    alt=""
    width={40}
    height={40}
    className="size-10 shrink-0 object-contain"
  />
);

const CategoryFilter = ({ categories, activeSlug }: CategoryFilterProps) => {
  return (
    <section>
      <h3 className="mb-5 text-base font-semibold text-foreground">
        Categories
      </h3>
      <div className="overflow-hidden rounded-md border">
        <Accordion type="single" collapsible defaultValue={activeSlug}>
          {categories.map((category) => {
            const isActive = category.slug === activeSlug;

            if (!category.children?.length) {
              return (
                <div key={category.id} className="not-last:border-b">
                  <Link
                    href={`/search?category=${category.slug}`}
                    className={cn(
                      "flex items-center gap-4 px-3.5 py-2.5 text-sm text-foreground transition-colors hover:bg-fill-thumbnail",
                      isActive && "bg-fill-thumbnail",
                    )}
                  >
                    <CategoryIcon category={category} />
                    {category.name}
                  </Link>
                </div>
              );
            }

            return (
              <AccordionItem key={category.id} value={category.slug}>
                <div
                  className={cn(
                    "px-3.5 transition-colors hover:bg-fill-thumbnail",
                    isActive && "bg-fill-thumbnail",
                  )}
                >
                  <AccordionTrigger className="items-center">
                    <span className="flex items-center gap-4 font-normal text-foreground">
                      <CategoryIcon category={category} />
                      {category.name}
                    </span>
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  <RadioGroup aria-label={`${category.name} subcategories`}>
                    {category.children.map((child) => (
                      <div
                        key={child.id}
                        className="mx-4 flex items-center justify-between gap-3 py-3 not-last:border-b"
                      >
                        <Label htmlFor={`category-${child.slug}`} className="flex-1">
                          {child.name}
                        </Label>
                        <RadioGroupItem id={`category-${child.slug}`} value={child.slug} />
                      </div>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
};

export default CategoryFilter;
