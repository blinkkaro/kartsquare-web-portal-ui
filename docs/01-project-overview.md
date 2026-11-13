# 01 · Project overview

## What Kartsquare is

Kartsquare is a local-services marketplace launching in **Jaipur** (city-agnostic by design: any city without a theme entry in `constants/cityTheme.ts` gets neutral copy). Customers find, compare and request nearby service providers (electricians, AC repair, salons, packers & movers, photographers, and so on). Providers get a public profile, a way to show their services and a dashboard to manage leads and bookings. A B2B supplier side (products, quotations, enquiries) lives alongside.

This repo is the **web portal**: the public marketing/SEO site, the customer app, and the provider/supplier dashboards. The backend is a separate repo (`Blinkkaro_backend`, deployed at `api.kartsquare.com/api/v1`).

## Roles

Roles come from the backend (`utils/auth.ts → UserRole`): `ADMIN | CUSTOMER | SERVICE_PROVIDER | SUPPLIER | MANAGER | SUPPORT`. The product treats them as two audiences:

| Audience | Roles | Lives under |
| --- | --- | --- |
| **Customer** | `CUSTOMER` (and logged-out visitors) | `/`, `/{city}/{category}`, `/services/{slug}`, `/in/{username}`, `/search`, `/cus/*`, `/myAccount/*` |
| **Provider** | `SERVICE_PROVIDER`, `SUPPLIER` | `/dashboard`, `/myAccount/*` (business info, schedule, documents, advertise), `/sup/*`, `/supplier/*`, `/spr/*` |

`ADMIN`, `MANAGER`, `SUPPORT` work in the separate admin UI (`kartsquare-admin-ui`), not here.

## Core features

| Feature | Where it is | Notes |
| --- | --- | --- |
| **Search** | `app/search`, `hooks/useSearchSuggestions.ts`, `hooks/useAISearch.ts` | Text + suggestions + AI-assisted search. `/search?q=` is `noindex`. |
| **Browse by city & category** | `app/[city]/[...segments]`, `lib/seo/locationListingPage.tsx` | `/{city}/{category}[/{sub-category}]`. The main SEO surface. |
| **Request a service** | `components/pages/serviceDetails`, `services/leads`, `services/booking` | Lead creation (`POST /leads`) and bookings (`/service-bookings/*`). |
| **Kart AI** | `components/common/Ai`, `services/ai`, `constants/aiBot.ts` | Chat assistant and agentic search (`/agentic-search`, `/agentic-search/aibot`). |
| **Feed, reels, stories** | `app/cus/feed`, `app/cus/reels`, `services/post`, `services/stories` | Providers post; customers follow and watch. |
| **Provider profile** | `app/in/[username]` | The only canonical provider URL. |
| **Provider dashboard** | `app/dashboard`, `services/providerDashboard`, `ProviderworkingHours` | Bookings, schedule, working hours, analytics (Recharts). |
| **Supplier / B2B** | `app/sup`, `app/supplier`, `services/supplier*` | Products, KYC, store, quotations, enquiries. |
| **Notifications** | `contexts/SocketContext.tsx`, `services/notifications` | Socket.io, notifications only. |

## Business rules (non-negotiable)

These are product and legal constraints. They apply to UI copy, metadata, JSON-LD, alt text, seed data and tests.

1. **No fake claims.** No invented ratings, review counts, "10,000+ customers", "trusted by", awards, response times or availability. If the number does not come from the API, it does not appear. Copy about the city (`cityTheme.ts`) is brand voice only: no statistics about supply.
2. **No "verified".** Do not label a provider, listing, review or document "verified", "certified", "trusted" or "approved" in customer-facing copy or structured data unless the backend returns an explicit status for it and legal has signed off the wording. This includes SEO `description` strings.
3. **Opt-in outreach only.** Nothing contacts a provider or customer who has not asked for it: no auto-enrolment into email campaigns, WhatsApp or SMS. Email marketing (`services/emailMarketing`) requires a working unsubscribe (`/unsubscribe`) on every message. Phone numbers are shown only when the provider opted in (`UPDATE_SHOW_NUMBER`).
4. **No scraped or fabricated listings.** Providers on the site are real, registered accounts. Placeholder data (`DUMMY_CATEGORIES` in `NewCategoryGrid.tsx`, sample data) must never ship into an indexable page as if it were real.
5. **Photos are licensed.** Category photos and their credits are tracked in `docs/category-photo-credits.md`. Add the credit when you add a photo.
6. **Light theme only.** The site ignores dark mode (`features/ui/uiSlice.ts`). Do not add dark-only designs.

### Known violations to fix (found while writing these docs)

- `app/dashboard/page.tsx` metadata says "as a verified provider" (rule 2).
- `DUMMY_CATEGORIES` renders when the categories request fails, which presents fake tiles as real (rule 4). It should show an error/empty state instead.

## Environments

| Env | Web | API |
| --- | --- | --- |
| Production | `https://kartsquare.com` | `https://api.kartsquare.com/api/v1` |
| Dev | `https://dev.kartsquare.com` | `https://api-dev.kartsquare.com/api/v1` |
| Local | `http://localhost:3000` | see below |

**Local dev (decided):** run the backend locally on `:5900` and let Next proxy to it. `next.config.ts` rewrites `/api/*` to `http://localhost:5900/api/*` in non-production builds only (override with `LOCAL_API_PROXY_TARGET`). In `.env.local` (gitignored) set `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`. The browser then calls its own origin, so CORS never applies. Server-side fetches in `lib/seo` hit the same URL and are proxied too. Socket.io is not proxied (notifications only); point it at the backend directly if you need live notifications locally.

**Why not the deployed API:** its CORS allowlist (`Blinkkaro_backend/src/app.ts`) only lets `localhost:3000` through when its `NODE_ENV` is not `production`. The deployed `api` and `api-dev` hosts reject it (HTTP 500, no CORS headers), so a local page pointed straight at them cannot load categories, icons or images.
