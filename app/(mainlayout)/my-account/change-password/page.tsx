import type { Metadata } from "next";

import ChangePasswordForm from "@/components/account/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Change Password | BoroBazar",
};

export default function ChangePasswordPage() {
  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-foreground md:text-2xl">Change Password</h1>
      <ChangePasswordForm />
    </>
  );
}
