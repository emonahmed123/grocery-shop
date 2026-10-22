import Container from "@/components/mainlayout/layout/Container";

// `(auth)` is a route group outside `(mainlayout)`: login and register share this
// shell without the site header and footer, and no `/auth` is added to the URL.
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-svh items-center bg-fill-thumbnail py-10 md:py-16">
      <Container>{children}</Container>
    </main>
  );
}
