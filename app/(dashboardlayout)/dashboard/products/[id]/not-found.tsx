import { PackageX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border bg-background px-6 py-16 text-center">
      <PackageX className="size-10 text-muted-foreground" aria-hidden="true" />
      <div>
        <h1 className="font-manrope text-lg font-bold text-foreground">Product not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">It may have been deleted, or the link is wrong.</p>
      </div>
      <Button asChild variant="brand" size="lg">
        <Link href="/dashboard/products">Back to products</Link>
      </Button>
    </div>
  );
}
