"use server";

import { getMeAction } from "@/actions/auth.actions";
import { getApiErrorMessage } from "@/lib/axios/httpClient";
import { formatFileSize, MAX_UPLOAD_BYTES, UPLOAD_IMAGE_TYPES } from "@/lib/imageUpload";
import { isAdmin } from "@/lib/roles";
import { type UploadedImage, uploadImageToImgbb } from "@/services/image.services";
import type { ApiResult } from "@/types/api.types";

/**
 * Uploads one image from the admin's computer to imgbb and returns its live
 * link, which the form then saves like any pasted URL. The browser calls this
 * once per image, so each request stays small.
 */
export async function uploadImageAction(formData: FormData): Promise<ApiResult<UploadedImage>> {
  // Server actions are public endpoints, and this one spends the imgbb quota.
  try {
    if (!isAdmin(await getMeAction())) return { success: false, message: "Only admins can upload images" };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Could not verify your account") };
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) return { success: false, message: "Choose an image to upload" };
  if (!UPLOAD_IMAGE_TYPES.includes(image.type)) {
    return { success: false, message: `${image.name}: use a JPG, PNG, WebP or GIF image` };
  }
  if (image.size > MAX_UPLOAD_BYTES) {
    return { success: false, message: `${image.name} is ${formatFileSize(image.size)}; the limit is 4 MB` };
  }

  try {
    const uploaded = await uploadImageToImgbb(image, image.name || "image");
    return { success: true, message: "Image uploaded", data: uploaded };
  } catch (error) {
    return { success: false, message: `${image.name}: ${getApiErrorMessage(error, "upload failed")}` };
  }
}
