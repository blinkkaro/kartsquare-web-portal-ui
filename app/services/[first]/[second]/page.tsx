import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ServiceDetailBody, serviceMetadata } from "@/lib/seo/servicePage";
import { lookupService, serviceRedirectTarget } from "@/lib/seo/serviceSeo";
import { fetchPublicJson, getApiBaseUrl } from "@/lib/seo/upstream";
import { isCanonicalServicePath, isSlugShape } from "@/lib/seo/sitemapPaths";

/**
 * Canonical service page: /services/{city-slug}/{service-slug}.
 *
 * Statically generated and revalidated (ISR), so a hit is served from the cache
 * with no API call and no server render. It must not read `searchParams`
 * (that would force dynamic rendering); the legacy /services/{id|slug} route is
 * the one that carries `?action=`.
 *
 * The service is identified by its slug alone (globally unique); the city
 * segment is validated against the service's stored canonical city. A valid
 * service under the wrong city gets one redirect to its canonical URL.
 */
export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ first: string; second: string }> };

/** Pre-render the most recently updated services; the rest render on first hit. */
export async function generateStaticParams(): Promise<Array<{ first: string; second: string }>> {
  try {
    const res = await fetchPublicJson<{
      data?: { services?: Array<{ canonical_path?: string }> } | Array<{ canonical_path?: string }>;
    }>(`${getApiBaseUrl()}/services/sitemap`, { revalidate: 3600 });
    if (res.status !== "ok") return [];
    const data = res.body?.data;
    const list = Array.isArray(data) ? data : (data?.services ?? []);
    return list
      .map((s) => s.canonical_path)
      .filter(isCanonicalServicePath)
      .slice(0, 200)
      .map((p) => {
        const [, , first, second] = p.split("/");
        return { first, second };
      });
  } catch {
    return []; // build must not depend on the API; pages then render on demand
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { first, second } = await params;
  if (!isSlugShape(first) || !isSlugShape(second))
    return { robots: { index: false, follow: false } };
  return serviceMetadata(second, `/services/${first}/${second}`);
}

export default async function CanonicalServicePage({ params }: Props) {
  const { first: city, second: slug } = await params;
  if (!isSlugShape(city) || !isSlugShape(slug)) notFound();

  const lookup = await lookupService(slug);
  if (lookup.kind === "not-found") notFound();

  const service = lookup.service;
  const requested = `/services/${city}/${slug}`;

  if (!service.canonical_path) {
    // Valid service with no canonical city (or slug): this city prefix is arbitrary.
    // Its only URL is the legacy one, which renders it noindex.
    permanentRedirect(`/services/${service.slug || service.service_id}`);
  }

  const target = serviceRedirectTarget(requested, service);
  if (target) permanentRedirect(target);

  return <ServiceDetailBody service={service} />;
}
