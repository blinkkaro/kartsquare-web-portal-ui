import { SITE_URL } from "./buildMetadata";

type BreadcrumbEntry = {
  name: string;
  item: string;
};

/**
 * Generates BreadcrumbList JSON-LD for Search results dominance.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbEntry[]) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item.startsWith("http") ? item.item : `${SITE_URL}${item.item}`,
    })),
  });
}

/**
 * Common breadcrumb trails for kartsquare
 */
export const BREADCRUMBS = {
  HOME: [{ name: "Home", item: "/" }],
  BLOGS: [
    { name: "Home", item: "/" },
    { name: "Blogs", item: "/blogs" },
  ],
  STORE: [
    { name: "Home", item: "/" },
    { name: "Store", item: "/store" },
  ],
  SERVICES: [
    { name: "Home", item: "/" },
    { name: "Services", item: "/services" },
  ],
};
