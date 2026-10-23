import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | Borobazer",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-12 py-16 text-center sm:py-20 lg:py-24 xl:py-32">
      <div className="flex max-w-md flex-col items-center xl:max-w-lg">
        <Image
          src="/images/not-found.svg"
          alt="Page not found"
          width={860}
          height={571}
          priority
          className="h-auto w-full"
        />
        <p className="mt-8 mb-5 text-sm leading-7 text-muted-foreground md:text-base lg:mt-12">
          We’re sorry! This page is currently unavailable. We request you to
          please try again later.
        </p>
        <Button asChild variant="brand" size="lg">
          <Link href="/">
            <House data-icon="inline-start" />
            Back to Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
