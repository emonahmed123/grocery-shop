"use client";

import { ArrowLeft, Pencil, Star, Trash2, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import {
  AvailabilityBadge,
  FlashSaleBadge,
  ProductPrice,
  StockBadge,
} from "@/components/dashboard/products/ProductBadges";
import { CategoryName, ProductThumb } from "@/components/dashboard/products/productColumns";
import ProductDetailsSkeleton from "@/components/dashboard/products/ProductDetailsSkeleton";
import ProductFormDialog from "@/components/dashboard/products/ProductFormDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminProduct, useDeleteProduct, useRemoveFlashSale } from "@/hooks/useDashboard";
import { useNow } from "@/hooks/useNow";
import { formatPrice } from "@/lib/assets";
import { formatTimeLeft, getFlashPrice, getFlashSaleStatus } from "@/lib/flashSale";
import { formatDate } from "@/lib/format";
import type { AdminProduct } from "@/types/dashboard.types";

const dateTimeFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

const Card = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <section className="flex flex-col rounded-lg border bg-background">
    <div className="flex min-h-12 items-center justify-between gap-3 border-b px-5 py-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {action}
    </div>
    <dl className="flex flex-col divide-y px-5">{children}</dl>
  </section>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-3 text-sm">
    <dt className="shrink-0 text-muted-foreground">{label}</dt>
    <dd className="min-w-0 text-right text-foreground">{children}</dd>
  </div>
);

const Gallery = ({ product }: { product: AdminProduct }) => {
  const images = [product.image, ...product.gallery].filter(Boolean);
  const [selected, setSelected] = useState(images[0] ?? "");

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-fill-thumbnail">
        {selected ? (
          <Image src={selected} alt={product.name} fill sizes="(min-width: 1024px) 26rem, 100vw" unoptimized className="object-contain" />
        ) : (
          <ProductThumb src="" className="size-full" />
        )}
      </div>
      {images.length > 1 && (
        <ul className="flex flex-wrap gap-2" aria-label="Product images">
          {images.map((url) => (
            <li key={url}>
              <button
                type="button"
                onClick={() => setSelected(url)}
                aria-label="Show this image"
                aria-pressed={url === selected}
                className="rounded-md ring-brand ring-offset-2 aria-pressed:ring-2"
              >
                <ProductThumb src={url} className="size-16" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FlashSaleCard = ({ product }: { product: AdminProduct }) => {
  const now = useNow();
  const removeFlashSale = useRemoveFlashSale();
  const [confirming, setConfirming] = useState(false);
  const flashSale = product.flashSale;

  if (!flashSale) {
    return (
      <Card
        title="Flash sale"
        action={
          <Button asChild variant="link" size="sm">
            <Link href="/dashboard/flash-sale">Set up</Link>
          </Button>
        }
      >
        <p className="py-6 text-center text-sm text-muted-foreground">This product is not on a flash sale.</p>
      </Card>
    );
  }

  const status = now === null ? null : getFlashSaleStatus(flashSale, now);
  const soldPercent = flashSale.quantityLimit
    ? Math.min(100, Math.round((flashSale.soldCount / flashSale.quantityLimit) * 100))
    : null;

  return (
    <Card
      title="Flash sale"
      action={
        <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
          Remove
        </Button>
      }
    >
      <Row label="Status">
        <FlashSaleBadge flashSale={flashSale} />
      </Row>
      <Row label="Flash price">
        <span className="font-semibold text-brand">
          {formatPrice(getFlashPrice(product.price, flashSale.discountPercentage))}
        </span>{" "}
        <span className="text-muted-foreground">({flashSale.discountPercentage}% off)</span>
      </Row>
      <Row label="Runs">
        {dateTimeFormat.format(new Date(flashSale.startAt))} – {dateTimeFormat.format(new Date(flashSale.endAt))}
      </Row>
      {status === "live" && now !== null && <Row label="Ends in">{formatTimeLeft(flashSale.endAt, now)}</Row>}
      {status === "scheduled" && now !== null && <Row label="Starts in">{formatTimeLeft(flashSale.startAt, now)}</Row>}
      <Row label="Sold">
        {flashSale.quantityLimit ? (
          <div className="flex w-40 flex-col items-end gap-1.5">
            <span>
              {flashSale.soldCount} / {flashSale.quantityLimit}
            </span>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-fill-thumbnail">
              <div
                className="h-full w-(--sold) rounded-full bg-brand"
                style={{ "--sold": `${soldPercent}%` } as React.CSSProperties}
              />
            </div>
          </div>
        ) : (
          `${flashSale.soldCount} (no limit)`
        )}
      </Row>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Remove the flash sale?"
        description={<>{product.name} goes back to its normal price straight away.</>}
        confirmLabel="Remove"
        destructive
        isPending={removeFlashSale.isPending}
        onConfirm={() => removeFlashSale.mutate(product.id, { onSuccess: () => setConfirming(false) })}
      />
    </Card>
  );
};

/** Everything about one product, with edit and delete. */
const ProductDetails = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: product, isPending, error, refetch } = useAdminProduct(id);
  const deleteProduct = useDeleteProduct();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (isPending) return <ProductDetailsSkeleton />;

  if (error || !product) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error?.message ?? "This product no longer exists."}{" "}
          {error ? (
            <button type="button" onClick={() => refetch()} className="font-semibold underline">
              Try again
            </button>
          ) : (
            <Link href="/dashboard/products" className="font-semibold underline">
              Back to products
            </Link>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/products"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All Products
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-manrope text-xl font-bold text-foreground lg:text-2xl">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <AvailabilityBadge isAvailable={product.isAvailable} />
              <FlashSaleBadge flashSale={product.flashSale} />
              <span className="text-sm text-muted-foreground">/{product.slug}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="h-10" onClick={() => setEditing(true)}>
              <Pencil data-icon="inline-start" />
              Edit
            </Button>
            <Button variant="destructive" size="lg" className="h-10" onClick={() => setDeleting(true)}>
              <Trash2 data-icon="inline-start" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Re-keyed after an edit, so a changed image list starts on the new main image. */}
        <div className="lg:col-span-2">
          <Gallery key={product.updatedAt ?? product.image} product={product} />
        </div>

        <div className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-3">
          <Card title="Pricing">
            <Row label="Customer pays">
              <ProductPrice product={product} />
            </Row>
            <Row label="Price">{formatPrice(product.price)}</Row>
            <Row label="Sale price">{product.salePrice === undefined ? "—" : formatPrice(product.salePrice)}</Row>
            <Row label="Max price">{product.maxPrice === undefined ? "—" : formatPrice(product.maxPrice)}</Row>
          </Card>

          <Card title="Inventory">
            <Row label="Stock">
              <StockBadge stock={product.inStock} />
            </Row>
            <Row label="Unit">{product.unit || "—"}</Row>
            <Row label="Category">
              <CategoryName slug={product.category} />
            </Row>
            <Row label="Rating">
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5 fill-current text-warning" aria-hidden="true" />
                {product.averageRating.toFixed(1)} ({product.ratingCount})
              </span>
            </Row>
          </Card>

          <FlashSaleCard product={product} />

          <Card title="Details">
            <Row label="Tags">
              {product.tags.length > 0 ? (
                <span className="flex flex-wrap justify-end gap-1">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </span>
              ) : (
                "—"
              )}
            </Row>
            <Row label={product.variations?.name ?? "Variations"}>
              {product.variations ? (
                <span className="flex flex-wrap justify-end gap-1">
                  {product.variations.values.map((value) => (
                    <Badge key={value} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </span>
              ) : (
                "—"
              )}
            </Row>
            <Row label="Added">{formatDate(product.createdAt)}</Row>
            <Row label="Updated">{formatDate(product.updatedAt)}</Row>
          </Card>

          <section className="rounded-lg border bg-background p-5 sm:col-span-2">
            <h2 className="mb-2 text-sm font-semibold text-foreground">Description</h2>
            <p className="text-sm leading-6 whitespace-pre-line text-muted-foreground">
              {product.description || "No description yet."}
            </p>
          </section>
        </div>
      </div>

      {product.isOnFlashSale && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="size-3.5 text-brand" aria-hidden="true" />
          Customers pay the flash price while the sale runs; the regular price comes back when it ends.
        </p>
      )}

      <ProductFormDialog open={editing} onOpenChange={setEditing} product={product} />

      <ConfirmDialog
        open={deleting}
        onOpenChange={setDeleting}
        title="Delete this product?"
        description={
          <>
            <strong className="text-foreground">{product.name}</strong> will be removed from the store.
          </>
        }
        confirmLabel="Delete"
        destructive
        isPending={deleteProduct.isPending}
        onConfirm={() =>
          deleteProduct.mutate(product.id, { onSuccess: () => router.replace("/dashboard/products") })
        }
      />
    </div>
  );
};

export default ProductDetails;
