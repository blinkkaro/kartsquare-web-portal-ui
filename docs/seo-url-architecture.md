# Kartsquare URL architecture — extended `/{city}/{category}` pattern

Status: draft for backend + FE planning. Decision (product): **extend** the live
`/{city}/{category}` pattern; do **not** restructure to top-level `/[category]/…`.

## 1. Target URL structure

| Level | Pattern | Example | Status |
|---|---|---|---|
| L1 | `/{city}/{category}` | `/jaipur/automotive` | live, in sitemap |
| L1-area | `/{city}/{locality}/{category}` | `/jaipur/jhotwara/cleaning` | live (resolver) |
| L2 | `/{city}/{category}/{service-slug}` | `/jaipur/automotive/courier-logistics` | **new** (see 2.1 — collides with sub-category) |
| L3 | `/{city}/{category}/in/{provider-handle}` | `/jaipur/automotive/in/speedex-couriers` | **new** |
| Service detail (today) | `/services/{slug}` | `/services/solvitx-agri-farming` | live; UUID → slug 301 done |
| Provider profile (today) | `/in/{username}` | `/in/gaurang-tech` | live |

### 1.1 Resolver rules (FE, `lib/seo/locationListingPage.tsx`)
Segments after `{city}`:
- 1 segment → category, else locality (existing).
- 2 segments → locality+category, else category+sub-category (existing).
- **3 segments, middle `in`** → `category / in / handle` → L3 provider page (new). `in` becomes a **reserved word**: no category, sub-category or locality slug may equal `in` (backend must reject it).
- 3 segments, other → category / sub-category / service-slug → L2 detail (new).
- 4+ → 404.

### 1.2 Open issue to decide before building L2
Today `/jaipur/automotive/courier-logistics` already resolves as **category + sub-category** (the "service type" listing). If "service-slug" in L2 means a *service type*, it **is** the sub-category page and nothing new is needed — only slugs must be guaranteed. If L2 means an *individual listing* (one provider's service), it needs a third segment: `/jaipur/automotive/courier-logistics/{service-slug}`. Recommendation: **L2 = sub-category (exists), individual service = 3rd segment**, canonical for a service replaces `/services/{slug}`. The backend lookup (3c) is written for the latter.

## 2. Backend requirements

Repo: `kartsquare-app-backend` (not accessible from the FE session — these are specs, not implemented).

### 2a. Slugs for ALL services (P0)
- Confirmed: services exist with `slug: null` (e.g. `6878cefa-4392-4938-a3b9-d86f9d0f44e5`, "Gaurang Tech Solutions"). Those have no indexable URL and cannot be redirected.
- Migration: backfill `slug` for every service where null/empty.
  - Source: `service_name` (+ `business_name` suffix on collision). Lowercase, ASCII-fold, `[^a-z0-9]+` → `-`, trim `-`, max 80 chars.
  - Unique across `services` (unique index, `slug NOT NULL` after backfill). Collision → append `-2`, `-3`… (stable: never re-number existing rows).
  - Reserved: reject `in`, `book`, `new`, `edit`, UUID-shaped strings.
- On create: generate server-side if client sends none. On rename: **keep the old slug** (write to `service_slug_history`), so old URLs keep resolving → FE 301s to current slug.
- `GET /services/:idOrSlug` must resolve UUID, current slug **and** historical slug; response always includes `slug` (current) so FE can 301.

### 2b. Provider handle (P0)
- `/in/{username}` already exists: confirm whether `username` is the handle. If yes, only backfill + uniqueness are needed; if not, add `handle`.
- Generate from `business_name` (fallback `full_name`), same slugify rules as 2a; unique (`-2` suffix); reserved words `in`, `admin`, `api`, `services`, `store`, plus all city and category slugs.
- Immutable once public, or keep `provider_handle_history` for redirects.
- Backfill all providers; `NOT NULL` + unique index.
- Expose `handle` in provider/service payloads and in `/profile/provider/:handle`.

### 2c. Service-by-slug-within-category lookup (P1)
- `GET /listings/service?city=jaipur&category=automotive&subCategory=courier-logistics&slug=<service-slug>`
  → `200 {service, canonical_path}`; `404` if slug is not in that category/city; `308`-hint field `redirect_to` when the slug exists under a different category/city (FE issues the 301).
- `GET /listings/provider?city=jaipur&category=automotive&handle=<handle>` → provider + their services in that category; same `redirect_to` rule.
- Both return `canonical_path` so the FE never builds canonicals itself.

### 2d. Area slugs (P1)
- `locations` table already has localities (`/locations/sitemap` exists). Requirements: every locality has unique-within-city `slug`; sitemap endpoint returns `urls[]` for L1, L1-area, L2, L3; `enabled` flag per type so we can roll out gradually.
- Quality gate (anti-doorway): only emit a listing URL to the sitemap when it has ≥ N active providers (suggest N = 3); below that serve `noindex,follow`.

## 3. Redirect map

All permanent (308/301). Implement in the FE route (server `permanentRedirect`) when the data is dynamic, `next.config.ts` when static.

| # | Old | New | Condition | Status |
|---|---|---|---|---|
| R1 | `/services/{uuid}` | `/services/{slug}` | service has slug | **done** |
| R2 | `/services/{old-slug}` | `/services/{current-slug}` | slug in history | needs 2a |
| R3 | `/services/{slug}` | `/{city}/{category}/{sub-category}/{service-slug}` | L2 service pages live | future (P2) |
| R4 | `/cus/services-list?category={id}` | `/{city}/{category}` | category id→slug known | future; today self-canonical |
| R5 | `/cus/services-list?search={q}` | `/{city}/{category}/{sub-category}` | `q` matches a sub-category name exactly (case-insens.) | future; else stays noindex |
| R6 | `/cus/servicesList`, `/services` | `/cus/services-list` | always | **done** |
| R7 | `/in/{username}` | `/{city}/{category}/in/{handle}` | L3 live **and** provider has one primary category | future; otherwise keep `/in/{username}` as canonical profile |
| R8 | `/{city}/{category}/in/{old-handle}` | current handle | handle history | needs 2b |
| R9 | `/jaipur/{wrong-case-or-alias}` | canonical slug | alias table | optional |

Rules: single hop only (no chains); never redirect to a URL that is itself redirected; a 404 stays a 404 (no soft redirects to home); keep every redirect live ≥ 12 months.

Non-redirects: `/cus/services-list?search=` free-text results that match no sub-category stay `noindex,follow` with canonical → `/cus/services-list` (done).

## 4. Sitemap strategy

- Keep `/{city}/{category}` and locality URLs (from `/locations/sitemap`).
- Add L2 `…/{service-slug}` when the lookup in 2c is live; add L3 `…/in/{handle}` when its route is live. Each behind the backend `enabled` flag.
- `/services/{slug}` stays until R3 ships, then is **removed** from the sitemap (it will 301).
- Never list `/services/{uuid}`, `?search=` or `?category=` URLs. FE guard: in `app/sitemap.xml/route.ts`, skip services without a slug rather than falling back to `service_id` (fallback removed).
- Canonicals: every page's `alternates.canonical` comes from the API's `canonical_path`.

## 5. Priority & ownership

| P | Item | Owner |
|---|---|---|
| P0 | 2a service slug backfill + uniqueness + history | BE |
| P0 | 2b provider handle backfill + uniqueness | BE |
| P0 | FE: drop UUID fallback in sitemap | FE — **done** |
| P1 | 2c lookup APIs + `canonical_path` | BE |
| P1 | FE routes L2 (service) + L3 (provider) in resolver, `in` reserved | FE |
| P1 | 2d locality slug audit + sitemap `enabled`/threshold | BE |
| P2 | R2, R3, R4, R5, R7, R8 | FE + BE |
| P2 | Sitemap + canonical switch-over, remove `/services/{slug}` | FE |

## 6. Test checklist (localhost before prod)
- Every redirect: single hop, 308/301, correct target, query string dropped.
- No service/provider without slug/handle in any sitemap or internal link.
- `curl -I` old URL → 301 → new URL → 200 with self-canonical.
- No two URLs return the same content with the same canonical.
- Reserved-word collisions (`in`) rejected by backend and 404 in FE.
