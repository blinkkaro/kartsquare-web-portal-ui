import { HUB_REVIEWED } from "@/data/services/hub";
import { categoryContentPath, indexableCategories, indexableSubServices, SERVICES_HUB_PATH, subServicePath } from "./content";

/**
 * Paths of the static content pages that may be listed in the sitemap: the hub (only when it is
 * live and reviewed), every reviewed category page and every reviewed service guide. Drafts never appear.
 */
export function contentSitemapPaths(): string[] {
  const paths: string[] = [];
  if (HUB_REVIEWED) paths.push(SERVICES_HUB_PATH);
  for (const c of indexableCategories()) paths.push(categoryContentPath(c.slug));
  for (const s of indexableSubServices()) paths.push(subServicePath(s.categorySlug, s.slug));
  return paths;
}
