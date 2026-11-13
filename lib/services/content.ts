import { CATEGORY_BY_SLUG, CATEGORY_CONTENT } from "@/data/services/categories";
import type { CategoryContent } from "./types";

export const SERVICES_HUB_PATH = "/services";

/** Canonical path of a category content page. Lowercase, no trailing slash. */
export function categoryContentPath(slug: string): string {
  return `/services/c/${slug}`;
}

/** Draft content may be seen in development, or in production with SERVICES_PREVIEW=true. */
export function isPreviewEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.SERVICES_PREVIEW === "true";
}

/** Content for a slug, or undefined. Unreviewed content is returned only when previewing. */
export function getCategoryContent(slug: string): CategoryContent | undefined {
  const c = CATEGORY_BY_SLUG[slug.toLowerCase()];
  if (!c) return undefined;
  return c.reviewed || isPreviewEnabled() ? c : undefined;
}

/** Only reviewed content is indexed and listed in the sitemap. */
export function isCategoryIndexable(c: CategoryContent): boolean {
  return c.reviewed === true;
}

export function indexableCategories(): CategoryContent[] {
  return CATEGORY_CONTENT.filter(isCategoryIndexable);
}

/** Related categories that have content, in the order written. */
export function relatedCategories(c: CategoryContent): CategoryContent[] {
  return c.related.map((s) => CATEGORY_BY_SLUG[s]).filter((x): x is CategoryContent => Boolean(x));
}

/** The hub is live only when the flag is on. Keep in step with next.config.ts. */
export function isServicesHubEnabled(): boolean {
  return process.env.SERVICES_HUB_ENABLED === "true";
}
