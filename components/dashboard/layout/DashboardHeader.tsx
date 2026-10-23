"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getActiveNavItem } from "@/components/dashboard/layout/navItems";
import ProfileDropdown from "@/components/dashboard/layout/ProfileDropdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardHeader = () => {
  const pathname = usePathname();
  const page = getActiveNavItem(pathname);
  const subPage = page && page.href !== "/dashboard" ? page : null;

  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-360 items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <div className="hidden h-4 sm:block">
            <Separator orientation="vertical" />
          </div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                {subPage ? (
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {subPage && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{subPage.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default DashboardHeader;
