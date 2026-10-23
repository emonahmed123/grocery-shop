import type { Metadata } from "next";

import ProfileForm from "@/components/account/ProfileForm";
import PageHeader from "@/components/dashboard/PageHeader";
import SettingsCard from "@/components/dashboard/SettingsCard";

export const metadata: Metadata = {
  title: "My Profile | BoroBazar Dashboard",
};

export default function DashboardProfilePage() {
  return (
    <>
      <PageHeader title="My Profile" description="Update the name shown on your admin account." />
      <SettingsCard>
        <ProfileForm />
      </SettingsCard>
    </>
  );
}
