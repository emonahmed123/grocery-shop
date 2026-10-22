import AccountNav from "@/components/account/AccountNav";
import Container from "@/components/mainlayout/layout/Container";

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
