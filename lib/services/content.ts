import { CATEGORY_BY_SLUG, CATEGORY_CONTENT } from "@/data/services/categories";
import type { CategoryContent } from "./types";

/** The content hub. /services itself stays a redirect to the app list (next.config.ts). */
export const SERVICES_HUB_PATH = "/explore-services";

/** Canonical path of a category content page. Lowercase, no trailing slash. */
export function categoryContentPath(slug: string): string {
  return `/services/c/${slug}`;
}

/**
 * Content for a slug, or undefined. Draft (unreviewed) pages are public so people can read them,
 * but they are noindex, carry no FAQ structured data and are not in the sitemap until reviewed.
 */
export function getCategoryContent(slug: string): CategoryContent | undefined {
  return CATEGORY_BY_SLUG[slug.toLowerCase()];
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
