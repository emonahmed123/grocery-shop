"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { uploadImageAction } from "@/actions/upload.actions";
import { formatFileSize, MAX_UPLOAD_BYTES, UPLOAD_IMAGE_TYPES } from "@/lib/imageUpload";
import { unwrapResult } from "@/queries/unwrapResult";

/** Photos larger than this are scaled down in the browser before they are sent. */
const SHRINK_ABOVE_BYTES = 1.5 * 1024 * 1024;
const MAX_SIDE = 2000;

/**
 * Phone photos are often 5–10 MB. Scaling them to 2000 px as WebP keeps them
 * sharp for the store and well under the upload limit. GIFs are left alone,
 * since they may be animated.
 */
async function shrinkImage(file: File): Promise<File> {
  if (file.type === "image/gif" || file.size <= SHRINK_ABOVE_BYTES) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
  } catch {
    // The original still goes up if the browser cannot read it here.
    return file;
  }
}

async function uploadOne(file: File) {
  if (!UPLOAD_IMAGE_TYPES.includes(file.type)) throw new Error(`${file.name}: use a JPG, PNG, WebP or GIF image`);

  const ready = await shrinkImage(file);
  if (ready.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name} is ${formatFileSize(ready.size)}; the limit is 4 MB`);
  }

  const formData = new FormData();
  formData.append("image", ready);
  return unwrapResult(uploadImageAction(formData));
}

/**
 * Sends images to imgbb through the server, all at once, one request each
 * (imgbb takes one image per request). Returns the live links of the ones
 * that worked, in the order given; failures show as toasts.
 */
export function useImageUpload(onBusyChange?: (busy: boolean) => void) {
  const [pending, setPending] = useState(0);
  // A ref, so the busy callback fires exactly when uploads start and stop.
  const running = useRef(0);

  const track = (change: number) => {
    const wasBusy = running.current > 0;
    running.current += change;
    setPending(running.current);
    if (wasBusy !== running.current > 0) onBusyChange?.(running.current > 0);
  };

  const upload = async (files: File[]) => {
    if (files.length === 0) return [];
    track(files.length);

    const results = await Promise.allSettled(
      files.map(async (file) => {
        try {
          return await uploadOne(file);
        } finally {
          track(-1);
        }
      }),
    );

    const urls: string[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") urls.push(result.value.url);
      else toast.error(result.reason instanceof Error ? result.reason.message : "An image failed to upload");
    }
    return urls;
  };

  return { upload, pending, isUploading: pending > 0 };
}
