const SERVICE_PATH_RE = /^\/services\/([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/;
const UUID_SHAPED_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const RESERVED = new Set(["in", "book", "new", "edit", "sitemap", "api", "admin"]);

/** Lowercase hyphenated slug shape (city or service). Checked before any API call. */
export function isSlugShape(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 80 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

/**
 * True for a canonical single-service path, /services/{city-slug}/{service-slug}:
 * both lowercase slugs, the service slug not UUID-shaped (a UUID URL is never
 * canonical) and not reserved.
 */
export function isCanonicalServicePath(path: unknown): path is string {
  if (typeof path !== "string") return false;
  const m = SERVICE_PATH_RE.exec(path);
  if (!m) return false;
  const [, city, slug] = m;
  return city.length <= 80 && slug.length <= 80 && !UUID_SHAPED_RE.test(slug) && !RESERVED.has(slug) && !RESERVED.has(city);
}

/** The API's canonical_path when it is a valid canonical service path, else null. No slug-only fallback. */
export function serviceSitemapPath(s: { canonical_path?: unknown }): string | null {
  return isCanonicalServicePath(s.canonical_path) ? s.canonical_path : null;
}
