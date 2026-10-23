export type NavLink = {
  label: string;
  href: string;
  /** Other path prefixes that count as this link being active. */
  matches?: string[];
};

export const mainLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/search", matches: ["/products"] },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

export const pageLinks: NavLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Condition", href: "/terms" },
  
];

export function isActiveLink(pathname: string, link: NavLink) {
  if (link.href === "/") return pathname === "/";
  return [link.href, ...(link.matches ?? [])].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
