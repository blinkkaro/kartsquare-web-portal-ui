import { getApiBaseUrl } from "@/lib/seo/upstream";
import { isCanonicalServicePath } from "@/lib/seo/sitemapPaths";

export interface ListingLink {
  href: string;
  name: string;
}

interface ListedService {
  canonical_path?: string | null;
  business_name?: string | null;
  service_name?: string | null;
}

/**
 * Every listed service in a city that has a canonical page, for plain server-rendered links. Without them many
 * listing pages are reachable only from the sitemap, which gives search engines little reason to crawl them.
 * Returns an empty list when the API is unavailable: the directory is then left out, never faked.
 */
export async function getListingLinks(citySlug: string): Promise<ListingLink[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/services?page=1&limit=100`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { data?: { services?: ListedService[] } };
    return (body.data?.services ?? [])
      .flatMap((s) => {
        const href = s.canonical_path;
        const name = (s.business_name || s.service_name || "").trim();
        return name && isCanonicalServicePath(href) && href.startsWith(`/services/${citySlug}/`) ? [{ href, name }] : [];
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}
