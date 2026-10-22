import type { Metadata } from "next";
import Link from "next/link";

import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reset Password | BoroBazar",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  // The emailed link looks like /reset-password?token=...; a repeated param is not trusted.
  const { token: tokenParam } = await searchParams;
  const token = typeof tokenParam === "string" ? tokenParam : undefined;

  return (
    <AuthCard
      title="Reset Password"
      image="/assets/images/registration.png"
      subtitle={
        <>
          Choose a new password for your account.{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Back to Sign In
          </Link>
        </>
      }
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="flex flex-col gap-5">
          <Alert variant="destructive">
            <AlertDescription>
              This reset link is missing its token. Open the link from your email again, or request a new one.
            </AlertDescription>
          </Alert>
          <Button asChild variant="brand" size="lg" className="h-12 w-full">
            <Link href="/forgot-password">Request a New Link</Link>
          </Button>
        </div>
      )}
    </AuthCard>
  );
}
