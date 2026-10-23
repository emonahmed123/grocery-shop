const ASSET_BASE_URL = "https://borobazar.vercel.app";

/** Resolves a demo asset path such as `/assets/images/...` to its full URL. */
export function assetUrl(path: string) {
  return `${ASSET_BASE_URL}${path}`;
}

/** Demo data uses site-relative paths; images added in the dashboard are full URLs. */
export function toImageUrl(path?: string) {
  if (!path) return "";
  return /^https?:\/\//.test(path) ? path : assetUrl(path);
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number) {
  return currency.format(value);
}
