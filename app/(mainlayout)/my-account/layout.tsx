import { redirect } from "next/navigation";

import { getMeAction } from "@/actions/auth.actions";
import AccountNav from "@/components/account/AccountNav";
import Container from "@/components/mainlayout/layout/Container";
import { isAdmin } from "@/lib/roles";

// Customers only: admins manage their profile and password from the dashboard.
export default async function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getMeAction();
  if (!user) redirect("/login?redirect=/my-account");
  if (isAdmin(user)) redirect("/dashboard");

  return (
    <Container className="pt-28 pb-12 md:pt-32 lg:pb-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="lg:w-72 lg:shrink-0">
          <AccountNav />
        </aside>
        <section className="min-w-0 flex-1 rounded-md border p-5 sm:p-7 lg:p-8">{children}</section>
      </div>
    </Container>
  );
}
