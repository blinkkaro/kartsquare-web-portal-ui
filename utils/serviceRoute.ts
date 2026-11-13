type ServiceRouteCandidate = {
  /** /services/{city}/{slug}, built by the API. The only canonical service URL. */
  canonical_path?: string | null;
  slug?: string | null;
  service_id?: string | null;
  id?: string | null;
};

export function getServiceRouteParam(service: ServiceRouteCandidate): string {
  const slug = service.slug?.trim();
  if (slug) return slug;
  return service.service_id || service.id || "";
}

/**
 * Where a link to this service must point. Uses the API's `canonical_path`
 * directly (no redirect hop). Only when the payload has none (no slug or no
 * canonical city) does it fall back to the legacy single-segment URL, which the
 * web app serves without indexing it or redirects to the canonical page.
 */
export function getServiceHref(service: ServiceRouteCandidate): string {
  const canonical = service.canonical_path?.trim();
  if (canonical && /^\/services\/[a-z0-9-]+\/[a-z0-9-]+$/.test(canonical)) return canonical;
  return `/services/${getServiceRouteParam(service)}`;
}
