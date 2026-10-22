const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** "2026-10-22T09:48:22Z" -> "Oct 22, 2026"; a dash when the date is missing. */
export const formatDate = (value?: string) => (value ? dateFormat.format(new Date(value)) : "—");

/** The last characters of a Mongo id are enough to tell orders apart. */
export const formatOrderId = (id: string) => `#${id.slice(-6).toUpperCase()}`;
