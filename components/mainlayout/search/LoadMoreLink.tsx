"use client";

import { Loader2 } from "lucide-react";
import Link, { useLinkStatus } from "next/link";

import { Button } from "@/components/ui/button";

const LoadMoreLabel = () => {
  // True while the next page is on its way.
  const { pending } = useLinkStatus();
  return pending ? (
    <>
      <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" />
      Loading...
    </>
  ) : (
    "Load More"
  );
};

/** Shows one more page; the list stays in place while it loads. */
const LoadMoreLink = ({ href }: { href: string }) => (
  <Button asChild variant="brand" size="lg">
    <Link href={href} scroll={false} prefetch={false}>
      <LoadMoreLabel />
    </Link>
  </Button>
);

export default LoadMoreLink;
