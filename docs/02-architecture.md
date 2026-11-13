# 02 · Architecture

## Stack (as installed)

Next.js **16.1.1** (App Router, Turbopack) · React **19.2** · TypeScript 5.9 (`strict`) · **Material-UI v7** + Emotion for UI · **Redux Toolkit** (UI state only) · **TanStack Query v5** (server state) · Axios · React Hook Form + **Yup** · Socket.io client · Framer Motion · Swiper · Recharts · Sentry · PostHog · Firebase phone auth · Google Maps.

There is **no Tailwind and no shadcn/ui** in this repo. Styling is MUI `sx`/theme plus a small `app/globals.css`. Do not add either; see `03-design-system.md`.

## Folder map

```
app/            Routes. page.tsx = server component by default; layout.tsx per level.
components/
  common/       Shared (Nav, Footer, CategoryIcon, LoginModal, Ai chat)
  auth/         Auth screens
  pages/        Page-specific views, one folder per page (home, servicesList, provider, ...)
  supplier/     Supplier dashboard features
services/       One folder per backend domain: <x>Service.ts + apiEndPoints.ts + <x>Interface.ts
hooks/          TanStack Query hooks (useCategories, useServicesList, ...) + small UI hooks
store/          Redux store + typed hooks
features/ui/    Redux slices: auth user, login modal, profile drawer, theme mode, app config
contexts/       SocketContext
lib/            Framework-free helpers: seo/, categoryIcons.ts, cloudinaryLoader.ts
utils/          auth.ts, theme.ts (MUI), serviceRoute.ts, directions.ts, mainAreaResolver.ts
helper/         SecureStorage (AES), RegistrationGuard, navigation helpers
constants/      colors.ts, routes, city themes, location data
data/           Static JSON (blogs, bundled category icon drawings)
tests/          unit/, integration/, e2e/   (+ legacy __tests__/)
docs/           This documentation
```

## Rendering strategy

Default to **server components**. Of the ~85 `page.tsx` files, ~76 are server components that export `metadata` / `generateMetadata` and render a client view from `components/pages/*`. That split matters: SEO tags and JSON-LD are produced on the server; MUI-heavy interactivity is a client island.

| Surface | Strategy | How |
| --- | --- | --- |
| Marketing, blogs, legal pages | Static | Server component, no data fetch. |
| `/{city}/{category}[/{sub}]`, `/in/{username}`, `/services/{slug}` | Server-rendered with cache | `fetch(..., { next: { revalidate } })` in `lib/seo/*` (300 s for profiles, 3600 s for page SEO). Metadata + JSON-LD built server-side. |
| `sitemap.xml`, `robots.txt`, `og` | Route handlers | `app/sitemap.xml/route.ts`, `app/robots.ts`, `app/og/route.tsx`. |
| Home, search, services list | Server shell + client islands | Client components fetch with TanStack Query. |
| Customer account, bookings, feed, provider/supplier dashboards | Client-rendered, `noindex` | Auth-gated, `seoPrivate(...)` metadata. |

Rules:
- A file gets `"use client"` only for state, effects, event handlers, browser APIs or MUI components that need them. Push the boundary down: keep the page server-side and import a small client view.
- Never fetch with Axios in a server component. Server-side fetches use `fetch` with an explicit `next.revalidate` (or `cache: "no-store"` for personalised data).
- Private pages must use `seoPrivate()` (noindex). Public pages must use the builders in `lib/seo/buildMetadata.ts`.

## State management

| Kind of state | Tool | Examples |
| --- | --- | --- |
| Server data (anything from the API) | **TanStack Query** | categories, services, bookings, profile |
| UI state shared across the tree | **Redux Toolkit** (`features/ui/*`) | login modal open, profile drawer, auth user, theme mode |
| Component state | `useState` / `useReducer` | form inputs, open/closed, selected tab |
| Forms | React Hook Form + Yup | signup, business info, address |
| Realtime | `SocketContext` | notification push only |

Never copy server data into Redux. Never put UI flags into TanStack Query.

Query client defaults (`app/providers.tsx`): `staleTime` 2 min, `gcTime` 5 min, no refetch on window focus or mount, retry once and only on network/5xx (never on 4xx, so a 429 does not burn the rate limit). Per-hook overrides are fine for slow-changing data (`useCategories`: 10 min stale).

## API integration pattern

Three layers, always in this order; UI code touches only the top one.

```
component  →  hooks/useX.ts  →  services/x/xService.ts  →  services/api.ts (Axios)  →  backend
```

1. **`services/api.ts`**: the one Axios instance. Base URL `NEXT_PUBLIC_API_URL`, 10 s timeout. A request interceptor adds `Authorization: Bearer <token>` (token read from encrypted storage) unless the call passes `requiresAuth: false`. A response interceptor unwraps `response.data` and, on 401, queues requests behind a single refresh-token call; with no token it opens the login modal.
2. **`services/<domain>/*Service.ts`**: typed functions (`GET<T>(url, params, requiresAuth)`), endpoint strings kept in `apiEndPoints.ts`, types in `*Interface.ts`.
3. **`hooks/use*.ts`**: `useQuery` / `useMutation` wrappers with stable `queryKey`s and `select` for shaping.

Details in `04-api-contracts.md`. ESLint warns on `axios` / `@/services/api` imports from `app/`, `components/` and `hooks/`.

## Routing

| Zone | Routes | Access |
| --- | --- | --- |
| **Public / SEO** | `/`, `/about-us`, `/blogs/*`, `/careers`, `/contact-us`, `/{city}/{category}[/{sub}]`, `/in/{username}`, `/services/{slug}`, `/search`, legal pages | Anyone. Indexable (except `/search`). |
| **Auth** | `/login`, `/signUp`, `/forgotPassword`, `/resetPassword`, `/emailVerfication`, `/selectRole`, `/supplier/login`, `/supplier/register` | Logged-out. |
| **Customer** | `/cus/bookings`, `/cus/feed`, `/cus/reels`, `/cus/services-list`, `/myAccount/*` | Logged-in customer. `noindex`. |
| **Provider** | `/dashboard`, `/schedule`, `/business-listing`, `/verifyDocuments`, `/preferences`, `/myAccount/*` (business, schedule, advertise), `/spr/*` | Logged-in `SERVICE_PROVIDER`. `noindex`. |
| **Supplier** | `/sup/*`, `/supplier/(dashboard)`, `/supplier/onboarding` | Logged-in `SUPPLIER`. `noindex`. |
| **Admin** | none in this repo | Separate `kartsquare-admin-ui`. |

Gates: `helper/RegistrationGuard.tsx` wraps routes that need a completed registration. `middleware.ts` only 308-redirects numeric blog ids to slugs. `next.config.ts` holds the static redirects (camelCase to kebab-case URLs) and rewrites.

Known debt: several routes are still camelCase (`/contactUs`, `/signUp`, `/privacyPolicy`). New routes are **kebab-case**; old ones redirect.

## Authentication

- Tokens are stored AES-encrypted by `helper/SecureStorage.ts` (key `NEXT_PUBLIC_SECRET_KEY`) in the browser. Use `utils/auth.ts` (`storeTokens`, `getTokens`, `clearTokens`, `getUserRole`, `getUserId`); never touch storage directly.
- Phone sign-in uses Firebase OTP; email sign-in uses `/auth/login`.
- A `NEXT_PUBLIC_` key is visible to every visitor: client-side encryption protects against casual inspection, not an attacker. Never put real secrets in `NEXT_PUBLIC_*`.

## Observability

Sentry (`instrumentation*.ts`, `sentry.*.config.ts`), PostHog (`instrumentation-client.ts`), Vercel Speed Insights. API failures are logged with `console.error` in services and re-thrown so the query shows an error state.
