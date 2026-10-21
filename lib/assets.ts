const ASSET_BASE_URL = "https://borobazar.vercel.app";

/** Resolves a demo asset path such as `/assets/images/...` to its full URL. */
export function assetUrl(path: string) {
  return `${ASSET_BASE_URL}${path}`;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number) {
  return currency.format(value);
}
