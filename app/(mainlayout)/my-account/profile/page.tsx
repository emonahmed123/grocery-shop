import type { Metadata } from "next";

import ProfileForm from "@/components/account/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile | BoroBazar",
};

export default function ProfilePage() {
  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-foreground md:text-2xl">Personal Information</h1>
      <ProfileForm />
    </>
  );
}
