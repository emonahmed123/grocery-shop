import type { Metadata } from "next";

import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import PageHeader from "@/components/dashboard/PageHeader";
import SettingsCard from "@/components/dashboard/SettingsCard";

export const metadata: Metadata = {
  title: "Change Password | BoroBazar Dashboard",
};

export default function DashboardChangePasswordPage() {
  return (
    <>
      <PageHeader title="Change Password" description="Use at least 8 characters with a letter and a number." />
      <SettingsCard>
        <ChangePasswordForm />
      </SettingsCard>
    </>
  );
}
