# 05 · SEO and URL architecture

The full, product-approved specification (decisions, backend requirements, priorities, test checklist) is **[`seo-url-architecture.md`](./seo-url-architecture.md)**. That file is the source of truth; this page is the working summary for everyday changes. If they disagree, the long file wins. Do not duplicate edits into both.

## URL patterns

| Level | Pattern | Example | Canonical |
| --- | --- | --- | --- |
| City + category (L1) | `/{city}/{category}` | `/jaipur/automotive` | self (`canonical_path` from the API) |
| City + category + sub-category (L2) | `/{city}/{category}/{sub-category}` | `/jaipur/automotive/courier-logistics` | self |
| City + locality + category | `/{city}/{locality}/{category}` | `/jaipur/jhotwara/cleaning` | self |
| Locality + L2 | `/{city}/{locality}/{category}/{sub-category}` | later, when area slugs exist | self |
| **Provider profile** | `/in/{username}` | `/in/gaurang-tech` | self. **The only provider URL.** |
| **Single service** | `/services/{city}/{slug}` | `/services/jaipur/solvitx-agri-farming` | self. City = the service's stored primary city (from the API), never the visitor's. |
| Search | `/search?q=` | | `noindex,follow`, canonical `/search` |

Resolver (`lib/seo/locationListingPage.tsx`), segments after `{city}`: 1 → category, else locality; 2 → locality + category, else category + sub-category; 3 → locality + category + sub-category; 4+ → 404.

Rules:
- `in` is a **reserved word**. No category, sub-category, locality or username may equal `in`.
- There is **no** category-scoped provider page (`/{city}/{category}/in/{handle}`). Any such URL, if ever requested, 301s to `/in/{username}`.
- Never build a canonical in the frontend: use `canonical_path` from the API.
- A missing page is a real 404. Never redirect a missing page to the home page.
- New routes are kebab-case.

## Metadata and structured data

| Need | Use |
| --- | --- |
| Public page metadata | builders in `lib/seo/buildMetadata.ts` (`seoPublic`, etc.) |
| Private/logged-in page | `seoPrivate({ title, description })` → `noindex` |
| Page title/description from the CMS | `lib/seo/sitePageSeo.ts` (`GET /seo/pages/:pageKey`, revalidate 3600 s, with fallback copy) |
| Provider/service JSON-LD | `lib/seo/publicProfile.ts`, `buildMetadata.ts` JSON-LD builders |
| Breadcrumbs | `lib/seo/breadcrumbs.ts` |
| Open Graph image | `app/og/route.tsx` |

Structured data must follow the business rules in `01-project-overview.md`: no `aggregateRating` unless the API returns real reviews, and never the word "verified" in `description`.

## Sitemap strategy

`app/sitemap.xml/route.ts` builds the sitemap; `app/robots.ts` references it.

- Static pages (home, about, contact, blogs, careers, legal, `/business-listing`) are always included.
- City/category and locality URLs come from `GET /locations/sitemap`.
- L2 and L2-area URLs are listed only when they have at least `SEO_MIN_PROVIDERS_SITEMAP` active providers (**1 today**; raise to 3 once the marketplace has 50+ providers). Pages under the threshold are served `noindex,follow`.
- Providers are listed as `/in/{username}` only. `/services/{slug}` stays in the sitemap.
- **Never** list `/services/{uuid}`, `?search=`, `?category=` or slug-less services.
- Blog URLs come from `lib/seo/blogSitemap.ts`.

## Redirect map

All permanent (308/301). Static ones live in `next.config.ts`; data-driven ones use `permanentRedirect` in the server component. One hop only, never to a URL that itself redirects, kept at least 12 months.

| # | Old | New | Status |
| --- | --- | --- | --- |
| R1 | `/services/{uuid}`, `/services/{slug}` | `/services/{city}/{slug}` | done (single hop, `?action=` kept) |
| R2 | `/services/{old-slug}`, `/services/{any-city}/{old-slug}`, wrong city | `/services/{city}/{current-slug}` | done in FE (redirect on API `canonical_path`); needs backend migration 011 deployed |
| R4 | `/cus/services-list?category={id}` | `/{city}/{category}` | planned |
| R5 | `/cus/services-list?search={q}` where `q` is a sub-category name | `/{city}/{category}/{sub-category}` | planned; otherwise stays `noindex` |
| R6 | `/cus/servicesList`, `/services` | `/cus/services-list` | done |
| R8 | `/in/{old-username}` | `/in/{current-username}` | needs backend username history |
| — | `/contactUs`, `/aboutUs`, `/aboutus`, `/en/aboutus`, `/privacyPolicy`, `/termsConditions` | kebab-case equivalents | done (`next.config.ts`) |

## Static content pages (`/explore-services` hub, `/services/c/{category}`, sub-category copy)

Written as typed data in the repo, reviewed through pull requests. No database, no admin UI.

- `data/services/categories.ts` (category pages), `data/services/landing.ts` (copy under existing `/{city}/{category}/{sub-category}` pages), `data/services/hub.ts` (hub review flag).
- **`reviewed: false` is the default.** An unreviewed page is public so people can read it, but it is `noindex`, has no FAQPage JSON-LD and is absent from the sitemap. A person flips the flag in a PR after reading the copy.
- **The hub is `/explore-services`.** `/services` is unchanged: it stays a redirect to `/cus/services-list`. The hub is visible to everyone but `noindex` and absent from the sitemap until `HUB_REVIEWED` is true. Each hub card opens a category guide when that page is viewable, else the city list when it has providers, else it is left out, so the hub never links to a 404.
- Route priority: the static `c` segment in `app/services/c/[category]` wins over `[first]/[second]`. `c` is not a valid city or slug. `/services/c` itself 308s to `/services`. `/services/{city}/{slug}` and legacy `/services/{slug}` are untouched.
- Provider lists and Jaipur links come from the API (`/locations/jaipur/categories`, the listing endpoint) and appear only when a category has live services there. Provider cards link to the API's `canonical_path`. They show no rating, price or availability.
- Copy rules are enforced by tests (`tests/unit/services`): required sections, unique title/description/H1, near-duplicate intro check, and a banned-claims list (`lib/services/claims.ts`: verified, guarantee, best, 24/7, instant, fixed price and similar; "does not guarantee" is allowed as a disclaimer).
- Sub-category copy still obeys the listing's own indexing threshold (`listing.indexable`): the flag alone never makes a thin page indexable.

## Checklist for any change that adds or moves a public URL

1. Is there exactly one canonical URL for this content?
2. Does the old URL (if any) redirect in one hop, with the right status?
3. Is the page in the sitemap only if it should be indexed, and `noindex` if not?
4. Do the metadata, canonical and JSON-LD come from the builders in `lib/seo/`?
5. Is there a test in `tests/` (or `__tests__/seo/`) covering it? `curl -I` the old and new URL on localhost.

## Service and profile page contract (`app/services/[id]`, `app/in/[username]`)

Backend contract: `kartsquare-app-backend` `docs/05`. The web app never builds a canonical itself.

- Routes: `app/services/[first]/[second]` = canonical page, statically generated + ISR (`revalidate = 300`), so a cached hit is served with no render and no API call; `app/services/[first]` = legacy `/services/{uuid|slug}` (dynamic: carries `?action=`); `app/services/[first]/book` = booking, unchanged. `proxy`/middleware 308s any uppercase `/services/*` path to lowercase.
- One API call per render (`lookupService`, `React.cache`). The API resolves UUID, current slug and historical slug and returns `canonical_path` (`/services/{city}/{slug}`, `null` while slug-less or city-less).
- `canonical_path` differs from the requested path: **one** `permanentRedirect` (HTTP 308) straight to it. On the legacy route only `?action=` is carried over (enquiry context); the ISR canonical page cannot read query strings, so a wrong-city request drops them. The target must pass `isCanonicalServicePath` (lowercase city and slug, slug not UUID-shaped or reserved), otherwise no redirect. A valid service under a city prefix when it has no canonical city redirects to its legacy URL (the only one it has).
- Slug-less or city-less service: stays on its legacy URL, `noindex`, canonical = that URL, no JSON-LD, not in the sitemap, until it has both.
- Outcome classes (`lib/seo/upstream.ts`): API 404/410/400 = missing, so `notFound()`. Network error, timeout, 5xx, 429, 401/403, bad body = `UpstreamError`, which propagates to the error boundary. **Never `notFound()`, never a cached "missing".** Do not wrap these calls and `notFound()`/`permanentRedirect()` in one try/catch.
- JSON-LD is built from real fields (`buildServiceJsonLd`, `buildProfileJsonLd`) with `url` and `@id` from the canonical path, serialised with `serializeJsonLd`. The stored `structured_data` column (AI-generated) is not used. No `aggregateRating` until the API exposes a confirmed published-review aggregate.
- Booking stays `/services/{id|slug}/book` (the API resolves either).

Verified on a production build (Next 16.1.1, webpack, against a mock API, 2026-11-13): canonical page 200; UUID and historical slug 308 with `Location` = final canonical (+`?action=`); unknown entity 404 + `noindex`; backend 503 on the page = **HTTP 500** (error boundary, `no-store`), and the next request after recovery is 200, so an outage is neither cached nor reported as 404. **Limitation:** the App Router cannot emit 503 from a server component; 500 is what the default error boundary returns. A 503 would need a route handler or `proxy` health check in front, which is not built.
