import type { Metadata } from "next";
import Link from "next/link";

import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | BoroBazar",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot Password?"
      image="/assets/images/login.png"
      subtitle={
        <>
          Enter your email and we will send you a reset link. Remembered it?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
