import type { Metadata } from "next";
import Link from "next/link";

import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import { readRedirectParam } from "@/lib/authRoutes";

export const metadata: Metadata = {
  title: "Sign In | BoroBazar",
};

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const redirect = readRedirectParam((await searchParams).redirect);
  const registerHref = redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register";

  return (
    <AuthCard
      title="Welcome Back!"
      image="/assets/images/login.png"
      subtitle={
        <>
          Don&apos;t have an account?{" "}
          <Link href={registerHref} className="font-semibold text-brand hover:underline">
            Create Account
          </Link>
        </>
      }
    >
      <LoginForm redirectPath={redirect} />
    </AuthCard>
  );
}
