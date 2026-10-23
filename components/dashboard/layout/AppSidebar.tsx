"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import BrandMark from "@/components/dashboard/layout/BrandMark";
import { dashboardNav, isActiveNavItem } from "@/components/dashboard/layout/navItems";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

/** Collapsible admin sidebar: full labels when open, an icon rail with tooltips when closed. */
const AppSidebar = () => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  // On phones the sidebar is a sheet; close it once a page is chosen.
  const closeMobile = () => setOpenMobile(false);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" onClick={closeMobile}>
                <BrandMark />
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-foreground">BoroBazar</span>
                  <span className="text-xs text-muted-foreground">Admin Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {dashboardNav.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>
              <span className="tracking-wider uppercase">{section.title}</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild tooltip={label} isActive={isActiveNavItem(pathname, href)}>
                      <Link href={href} onClick={closeMobile}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
