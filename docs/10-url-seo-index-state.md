# URL / SEO / indexing: frontend state, decisions, open items

Read first for any service URL, redirect, sitemap, metadata or home-page category work. Backend counterpart (more detail,
prod/staging DB state): backend repo `docs/10-url-seo-index-state.md`. Contract: `05-seo-url-architecture.md`.
Last updated: 2026-11-14. No credentials in docs.

## URL scheme (owner-decided)
- Provider `/in/{username}` (exact casing). Service `/services/{city}/{slug}` (e.g. `/services/jaipur/ck-solar`).
  City pages `/{city}/{category}[/{sub}]`, `/{city}/{locality}/{category}`. No root `/{category}/{provider}`.
- Service links must use `getServiceHref(service)` (`utils/serviceRoute.ts`): `canonical_path` when valid, else legacy
  `/services/{slug|id}`. Never build service URLs by hand.

## Routes (App Router)
- `app/services/[first]/[second]/page.tsx`: canonical page. ISR (`revalidate = 300`), `generateStaticParams` from
  `/services/sitemap` (max 200), wrong city -> 308 to canonical, city-less service -> redirect to legacy `/services/{slug}`.
- `app/services/[first]/page.tsx`: legacy `/services/{uuid|slug}`: dynamic, one 308 to canonical, or renders noindex if the
  service has no canonical city. `app/services/[first]/book`: booking, unchanged.
- `middleware.ts`: 308 to lowercase for `/services/*` (matcher `/blogs/:segment`, `/services/:path*`).
- `app/sitemap.xml/route.ts`: static + `/services/sitemap` + `/locations/sitemap` (only when `enabled`) + `/profile/sitemap`;
  cached 1 h. NOTE: it hard-codes `https://api.kartsquare.com/api/v1`. Service entries use `serviceSitemapPath`
  (`lib/seo/sitemapPaths.ts`, canonical path only).
- `lib/seo/*`: `upstream.ts` (404/410/400 = not found; network/5xx/429 = throw), `serviceSeo.ts` (lookup, redirect target
  keeps only `?action=`, JSON-LD from real fields only, no aggregateRating), `jsonLd.ts` (escape `<>&`, U+2028/9),
  `publicProfile.ts`, `servicePage.tsx`.

## Home page
- Category grid uses `useCategoryAvailability(citySlug, localitySlug)` -> `GET /locations/:city/categories?view=availability`
  (listing-parity counts). It no longer infers categories from `/services?limit=100`. No known city = empty state, never
  fake categories.
- `useHomeServices` = small `view=card` request (limit 24), scoped by `city_slug`/`locality_slug`, only for service-type names.
- `lib/homeServices.ts`: `popularHomeCategoriesFromAvailability`. City comes from `useAILocation` (default city Jaipur
  while location is unknown; `source: "default"`).

## Rules and gotchas
- A production build fetches real slugs from the API (`generateStaticParams`): build against the NEW backend, else prerender
  fails (500 on canonical lookups). For local verification use a mock API and `next build --webpack` (Turbopack rejects a
  symlinked `node_modules`).
- Known limits: App Router cannot emit 503 (backend outage = 500); wrong-city redirect on the ISR page drops the query
  string; an unknown-service 404 can be cached up to 5 min.
- Tests: `tests/unit/lib` + `__tests__/seo` run (146 pass). 12 jsdom component suites cannot run
  (`jest-environment-jsdom` not installed). Browser smoke tests were never run.

## Status (2026-11-14)
- Merged to `development` (PR #89). **Not merged/deployed to `main`/prod yet.** Prod backend is live with the new
  endpoints; prod public `sitemap.xml` has no `/services/...` URLs until this frontend deploys and the 1 h cache turns over.
- Open: deploy FE + purge CDN; **HTML sitemap page `/sitemap`** (not built: server page, `revalidate = 3600`, same data as
  XML via one shared helper, plain `<a>` links grouped by locations/services/providers/stores/blogs/static, footer link,
  `index, follow`; `sitemap` is a reserved slug); FE `.env` API URL for staging/prod builds; browser smoke tests.
