import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getMeAction } from "@/actions/auth.actions";
import AppSidebar from "@/components/dashboard/layout/AppSidebar";
import DashboardHeader from "@/components/dashboard/layout/DashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isAdmin } from "@/lib/roles";

// The proxy already sends guests to login; this also keeps non-admins out.
export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getMeAction();
  if (!user) redirect("/login?redirect=/dashboard");
  if (!isAdmin(user)) redirect("/my-account/profile");

  // The sidebar stores whether it was collapsed in this cookie.
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="mx-auto w-full max-w-360 flex-1 px-4 py-6 sm:px-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
