import Image from "next/image";
import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type StoreSearch, searchHref } from "@/lib/storeSearch";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

type CategoryFilterProps = {
  categories: Category[];
  search: StoreSearch;
};

const CategoryIcon = ({ category }: { category: Category }) => (
  <Image
    src={category.icon ?? category.image.thumbnail}
    alt=""
    width={40}
    height={40}
    unoptimized
    className="size-10 shrink-0 object-contain"
  />
);

const linkClass = "flex items-center gap-4 px-3.5 py-2.5 text-sm text-foreground transition-colors hover:bg-fill-thumbnail";

/** Category links keep the current search and sort; the active one links back to "all". */
const CategoryFilter = ({ categories, search }: CategoryFilterProps) => {
  const active = search.category;
  const hrefFor = (slug: string) => searchHref(search, { category: active === slug ? undefined : slug });
  // Open the parent of the active subcategory.
  const openParent = categories.find(
    (category) => category.slug === active || category.children?.some((child) => child.slug === active),
  )?.slug;

  return (
    <section>
      <h3 className="mb-5 text-base font-semibold text-foreground">Categories</h3>
      <div className="overflow-hidden rounded-md border">
        <Accordion type="single" collapsible defaultValue={openParent}>
          {categories.map((category) => {
            const isActive = category.slug === active;

            if (!category.children?.length) {
              return (
                <div key={category.id} className="not-last:border-b">
                  <Link
                    href={hrefFor(category.slug)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(linkClass, isActive && "bg-fill-thumbnail font-medium")}
                  >
                    <CategoryIcon category={category} />
                    {category.name}
                  </Link>
                </div>
              );
            }

            return (
              <AccordionItem key={category.id} value={category.slug}>
                <div className={cn("px-3.5 transition-colors hover:bg-fill-thumbnail", isActive && "bg-fill-thumbnail")}>
                  <AccordionTrigger className="items-center">
                    <span className="flex items-center gap-4 font-normal text-foreground">
                      <CategoryIcon category={category} />
                      {category.name}
                    </span>
                  </AccordionTrigger>
                </div>
                <AccordionContent>
                  <ul aria-label={`${category.name} subcategories`}>
                    {[{ id: "all", name: `All ${category.name}`, slug: category.slug }, ...category.children].map(
                      (child) => {
                        const isChildActive = child.slug === active;
                        return (
                          <li key={child.id} className="mx-4 not-last:border-b">
                            <Link
                              href={hrefFor(child.slug)}
                              aria-current={isChildActive ? "true" : undefined}
                              className="flex items-center justify-between gap-3 py-3 text-sm text-foreground hover:text-brand"
                            >
                              {child.name}
                              <span
                                aria-hidden="true"
                                className={cn(
                                  "size-4 shrink-0 rounded-full border",
                                  isChildActive && "border-4 border-brand",
                                )}
                              />
                            </Link>
                          </li>
                        );
                      },
                    )}
                  </ul>
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
