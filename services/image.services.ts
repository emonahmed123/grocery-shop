import "server-only";

const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

/** What imgbb gives back for one image; only the fields the store uses. */
export type UploadedImage = {
  /** Full-size direct link; this is what gets saved. */
  url: string;
  /** Small version, good for lists and category thumbnails. */
  thumbUrl: string;
};

type ImgbbResponse = {
  success?: boolean;
  data?: { url: string; thumb?: { url: string } };
  error?: { message?: string };
};

/**
 * Hosts one image on imgbb and returns its live links. imgbb takes a single
 * image per request, so several images mean several calls.
 */
export async function uploadImageToImgbb(image: Blob, name: string): Promise<UploadedImage> {
  const key = process.env.IMGBB_API_KEY;
  if (!key) throw new Error("Image uploads are not set up: IMGBB_API_KEY is missing");

  const body = new FormData();
  body.append("image", image, name);
  body.append("name", name.replace(/\.[^.]+$/, ""));

  // The key stays on the server; it never reaches the browser.
  const response = await fetch(`${IMGBB_UPLOAD_URL}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(60_000),
  });
  const result = (await response.json().catch(() => ({}))) as ImgbbResponse;

  if (!response.ok || !result.success || !result.data?.url) {
    throw new Error(result.error?.message ?? `Image host answered ${response.status}`);
  }

  return { url: result.data.url, thumbUrl: result.data.thumb?.url ?? result.data.url };
}
