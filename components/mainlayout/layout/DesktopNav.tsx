"use client";

import {
  isActiveLink,
  mainLinks,
  pageLinks,
} from "@/components/mainlayout/layout/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DesktopNav = () => {
  const pathname = usePathname();
  const onPage = pageLinks.some((link) => isActiveLink(pathname, link));

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-6 xl:gap-8">
        {mainLinks.map((link) => (
          <li key={link.href}>
            <LineHoverLink
              href={link.href}
              variant="scribble"
              active={isActiveLink(pathname, link)}
            >
              {link.label}
            </LineHoverLink>
          </li>
        ))}
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-current={onPage ? "page" : undefined}
                className="group inline-flex items-center gap-1 font-semibold text-muted-foreground transition-colors outline-none hover:text-brand focus-visible:text-brand aria-[current=page]:text-brand data-[state=open]:text-brand"
              >
                Pages
                <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {pageLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
};

export default DesktopNav;
