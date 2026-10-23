import type { Metadata } from "next";
import Link from "next/link";

import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";
import { readRedirectParam } from "@/lib/authRoutes";

export const metadata: Metadata = {
  title: "Create Account | BoroBazar",
};

type RegisterPageProps = {
  searchParams: Promise<{ redirect?: string | string[] }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const redirect = readRedirectParam((await searchParams).redirect);
  const loginHref = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";

  return (
    <AuthCard
      title="SignUp for free!"
      image="/assets/images/registration.png"
      subtitle={
        <>
          Already registered?{" "}
          <Link href={loginHref} className="font-semibold text-brand hover:underline">
            Sign In Now
          </Link>
        </>
      }
    >
      <RegisterForm redirectPath={redirect} />
    </AuthCard>
  );
}
