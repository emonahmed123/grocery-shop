"use client";

import { ImageOff } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ProductImageProps = Omit<ImageProps, "src" | "unoptimized" | "fill"> & { src: string };

/**
 * A `fill` image for products. Admins paste image links from other sites, so
 * they are not optimized, and a link that stops working shows a placeholder
 * instead of a broken image.
 */
const ProductImage = ({ src, alt, ...props }: ProductImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex items-center justify-center bg-fill-thumbnail text-muted-foreground"
      >
        <ImageOff className="size-8" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill
      unoptimized
      // An image can fail before React hydrates and misses the error event,
      // so a finished image with no size counts as failed too.
      ref={(image) => {
        if (image?.complete && image.naturalWidth === 0) setFailedSrc(src);
      }}
      onError={() => setFailedSrc(src)}
    />
  );
};

export default ProductImage;
