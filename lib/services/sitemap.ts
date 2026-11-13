import { HUB_REVIEWED } from "@/data/services/hub";
import { categoryContentPath, indexableCategories, isServicesHubEnabled, SERVICES_HUB_PATH } from "./content";

/**
 * Paths of the static content pages that may be listed in the sitemap: the hub (only when it is
 * live and reviewed) and every reviewed category page. Drafts never appear.
 */
export function contentSitemapPaths(): string[] {
  const paths: string[] = [];
  if (HUB_REVIEWED && isServicesHubEnabled()) paths.push(SERVICES_HUB_PATH);
  for (const c of indexableCategories()) paths.push(categoryContentPath(c.slug));
  return paths;
}
