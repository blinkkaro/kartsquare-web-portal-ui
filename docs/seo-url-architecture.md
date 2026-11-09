# Kartsquare URL architecture — extended `/{city}/{category}` pattern

Status: **approved decisions**, ready for backend + FE build.
Decision: **extend** the live `/{city}/{category}` pattern; do **not** restructure to top-level `/[category]/…`.

## Decisions (product-approved)

1. **L2 = sub-category (service type).** `/jaipur/automotive/courier-logistics` is the L2 page. There is **no** third segment for a provider's individual service listing.
2. **Provider handle = `username`** (already live at `/in/{username}`). No new field. Backend: backfill, unique index, reserved words (`in`), history on rename.
3. **Sitemap threshold = 1 provider** (`SEO_MIN_PROVIDERS_SITEMAP = 1`). Raise to 3 once the marketplace has 50+ providers.
4. **Redirect rules:** one hop only, no soft redirects, keep each redirect 12 months.

## 1. URL structure

| Level | Pattern | Example | Status |
|---|---|---|---|
| L1 | `/{city}/{category}` | `/jaipur/automotive` | live, in sitemap |
| L2 | `/{city}/{category}/{sub-category}` | `/jaipur/automotive/courier-logistics` | live in resolver; needs guaranteed slugs + sitemap |
| L2-area | `/{city}/{locality}/{category}/{sub-category}` | `/jaipur/jhotwara/automotive/courier-logistics` | later, when area slugs are ready |
| L1-area | `/{city}/{locality}/{category}` | `/jaipur/jhotwara/cleaning` | live in resolver |
| L3 | `/{city}/{category}/in/{handle}` | `/jaipur/automotive/in/speedex-couriers` | **new** |
| Service detail | `/services/{slug}` | `/services/solvitx-agri-farming` | live — stays the canonical page for one service |
| Provider profile | `/in/{username}` | `/in/gaurang-tech` | live |

Because there is no per-listing URL under the city tree, **`/services/{slug}` remains the permanent canonical address of a single service** (former redirect R3 is dropped).

### 1.1 Resolver rules (`lib/seo/locationListingPage.tsx`)
Segments after `{city}`:
- 1 → category, else locality (existing).
- 2 → locality + category, else category + sub-category (existing).
- 3, middle segment is `in` → `category / in / handle` → L3 provider page (**new**).
- 3, otherwise → locality + category + sub-category (L2-area, when area slugs exist); else 404.
- 4+ → 404.

`in` is a **reserved word**: no category, sub-category, locality or handle may equal `in`; the backend must reject it.

### 1.2 Open item — L3 vs `/in/{username}` duplication
L3 (`/jaipur/automotive/in/speedex`) and the profile (`/in/speedex`) describe the same provider. Proposed: L3 shows the provider's services **in that category** and is self-canonical when the provider has services in more than one category; for single-category providers L3 canonicals to `/in/{username}` to avoid duplicate content. Needs a product confirm before FE builds L3.

## 2. Backend requirements
Repo `kartsquare-app-backend` (not accessible from the FE session — these are specs, not implemented).

### 2a. Slugs for ALL services — P0
- Known gap: services exist with `slug: null` (e.g. `6878cefa-4392-4938-a3b9-d86f9d0f44e5`, "Gaurang Tech Solutions"). They have no indexable URL and cannot be redirected.
- Migration: backfill `slug` for every row where null/empty.
  - Source: `service_name`, with `business_name` appended on collision. Lowercase, ASCII-fold, `[^a-z0-9]+` → `-`, trim `-`, max 80 chars.
  - Unique across `services` (unique index; `slug NOT NULL` after backfill). Collision → `-2`, `-3`… (never renumber existing rows).
  - Reserved: reject `in`, `book`, `new`, `edit`, UUID-shaped strings.
- On create: generate server-side if none supplied. On rename: keep the old slug in `service_slug_history`.
- `GET /services/:idOrSlug` resolves UUID, current slug **and** historical slug. Response always includes the current `slug` so the FE can 301.

### 2b. Provider handle = `username` — P0
- No new field. Backfill any provider with null/empty `username` from `business_name` (fallback `full_name`) using the same slugify rules.
- Unique index on `username` (case-insensitive). Collision → `-2`.
- Reserved words (reject on create/rename): `in`, `admin`, `api`, `services`, `store`, `login`, `signup`, plus every city and category slug.
- Existing usernames that are not URL-safe (spaces, uppercase, symbols) need a normalized, unique `handle` value derived from them; confirm how many rows are affected before deciding between rewriting `username` and a derived column.
- Rename keeps old values in `provider_handle_history` → FE 301 to the current handle.
- Expose `username` in provider and service payloads.

### 2c. Lookup APIs — P1
- Sub-category (L2) page: already served by the listing endpoint (category + sub-category slugs). Requirement: every sub-category has a unique-within-category `slug`; return `canonical_path`.
- `GET /listings/provider?city=jaipur&category=automotive&handle=<username>` → provider + their services in that category. `404` if the provider has none there; `redirect_to` when the handle changed or the category is wrong (FE issues the 301).
- All listing endpoints return `canonical_path` so the FE never builds canonicals itself.

### 2d. Area slugs — P1
- `locations` already has localities (`/locations/sitemap`). Every locality needs a unique-within-city `slug`. Sitemap endpoint returns `urls[]` for L1, L1-area, L2, L2-area and L3, each behind an `enabled` flag for gradual rollout.
- **Sitemap quality gate:** emit a listing URL only when it has at least `SEO_MIN_PROVIDERS_SITEMAP` active providers. **Initial value 1**, raise to 3 at 50+ providers. Pages below the threshold are served `noindex,follow`.

## 3. Redirect map
All permanent (308/301). Dynamic data → FE server `permanentRedirect`; static → `next.config.ts`.

| # | Old | New | Condition | Status |
|---|---|---|---|---|
| R1 | `/services/{uuid}` | `/services/{slug}` | service has slug | **done** |
| R2 | `/services/{old-slug}` | `/services/{current-slug}` | slug in history | needs 2a |
| R3 | ~~`/services/{slug}` → city tree~~ | — | — | **dropped** (no per-listing URL) |
| R4 | `/cus/services-list?category={id}` | `/{city}/{category}` | category id → slug known | P2; self-canonical until then |
| R5 | `/cus/services-list?search={q}` | `/{city}/{category}/{sub-category}` | `q` equals a sub-category name (case-insensitive) | P2; otherwise stays `noindex` |
| R6 | `/cus/servicesList`, `/services` | `/cus/services-list` | always | **done** |
| R7 | `/in/{username}` | `/{city}/{category}/in/{username}` | only if 1.2 resolves to "L3 is canonical" | decision pending; default: no redirect |
| R8 | `/{city}/{category}/in/{old-handle}` | current handle | handle history | needs 2b |

Rules: single hop; never redirect to a URL that itself redirects; a missing page is a real 404 (never a redirect to home); keep each redirect ≥ 12 months.

`/cus/services-list?search=` with no sub-category match stays `noindex,follow`, canonical → `/cus/services-list` (**done**).

## 4. Sitemap strategy
- Keep `/{city}/{category}` and locality URLs (from `/locations/sitemap`).
- Add L2 (`…/{sub-category}`) and L2-area URLs once each has ≥ `SEO_MIN_PROVIDERS_SITEMAP` providers.
- Add L3 (`…/in/{handle}`) once its route is live and the 1.2 canonical rule is settled.
- `/services/{slug}` **stays** in the sitemap — it is the canonical single-service page.
- Never list `/services/{uuid}`, `?search=` or `?category=` URLs. FE: `app/sitemap.xml/route.ts` skips slug-less services (**done**).
- Canonicals come from the API's `canonical_path`.

## 5. Priority & ownership

| P | Item | Owner |
|---|---|---|
| P0 | Backfill service slugs (2a) | BE |
| P0 | Backfill/normalize provider handles from `username` (2b) | BE |
| P0 | FE: drop UUID fallback in sitemap | FE — **done** |
| P1 | L2 route: guaranteed sub-category slugs + `canonical_path` (2c) | FE + BE |
| P1 | L3 route `/{city}/{category}/in/{handle}` + provider lookup API (2c) | FE + BE |
| P1 | Locality slug audit + sitemap `enabled`/threshold (2d) | BE |
| P2 | Redirects R2, R4, R5, R7, R8 | FE + BE |
| P2 | Sitemap + canonical update for L2/L3 | FE |

## 6. Test checklist (localhost before prod)
- Every redirect: single hop, 301/308, correct target, query string dropped.
- No service without slug or provider without handle in any sitemap or internal link.
- `curl -I` old URL → 301 → new URL → 200 with self-canonical.
- No two URLs return the same content with the same canonical.
- Reserved word `in` rejected by backend and 404 in FE.
- Sitemap contains no URL below the provider threshold.
