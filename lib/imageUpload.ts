/** Image types imgbb takes that the store can show. */
export const UPLOAD_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Largest file sent in one upload. Vercel turns away request bodies over
 * 4.5 MB, so one image per request has to stay under that.
 */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
