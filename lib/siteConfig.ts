/** Owner and contact details shown across the site, kept in one place. */
export const siteOwner = {
  name: "Emon Ahmed",
  location: { area: "Shakhipur, Tangail", country: "Bangladesh" },
  phone: { display: "+880 1921-837900", href: "tel:+8801921837900" },
  email: "imonshomon@gmail.com",
  whatsappHref: "https://wa.me/8801921837900",
  github: "https://github.com/emonahmed123",
  facebook: "https://www.facebook.com/Emonahmed65",
  linkedin: "https://www.linkedin.com/in/emon-ahmed123",
};

/**
 * The live store's address, used for absolute links such as the sitemap.
 * Set SITE_URL to override it (for example after moving to a custom domain).
 */
export const siteUrl = (process.env.SITE_URL ?? "https://grocery-store-sable.vercel.app").replace(/\/$/, "");
