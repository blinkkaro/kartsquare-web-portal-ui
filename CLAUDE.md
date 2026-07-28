# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server

# Quality
npm run lint         # ESLint
npm test             # Jest tests
npm run test:coverage  # Tests with coverage

# Utilities
npm run generate-favicon   # Regenerate favicon assets
npm run update-assetlinks  # Update Android asset links
```

Run single test: `npx jest __tests__/path/to/file.test.ts`

## Architecture

**Stack**: Next.js App Router (v16.1.1) + TypeScript + Material-UI v7 + Redux Toolkit + TanStack Query

### Routing & Pages (`/app`)
All routes use App Router. Pattern: `app/[route]/page.tsx` with `layout.tsx` at each level.
- Public marketing: `about-us`, `blogs`, `careers`, `contactUs`
- Auth flows: `login`, `signup`, `forgotPassword`, `emailVerification`
- Customer portal: `cus/bookings`, `cus/reels`, `cus/servicesList`
- Account management: `myAccount/*` (11 sub-routes)
- Supplier/marketplace: `in/*`, `External/*`

### Data Fetching (`/services` + `/hooks`)
Each domain has a service folder with 3 files:
- `*.service.ts` — raw Axios calls via `services/api.ts`
- `*.query.ts` — TanStack Query `useQuery` wrappers
- `*.mutation.ts` — TanStack `useMutation` wrappers

38 custom hooks in `/hooks` consume these services. **Use TanStack Query for all server state** — no direct Axios in components.

### State Management
- **Redux** (`/store`, `/features/ui/`): UI state only — theme, auth user info, modals, profile drawer
- **TanStack Query**: All server/async data (staleTime: 2min, gcTime: 5min, no refetch on focus)
- **Local state**: Component-level with `useState`/`useReducer`

### Authentication
- Tokens stored encrypted via `helper/SecureStorage.ts` (AES via CryptoJS, key: `NEXT_PUBLIC_SECRET_KEY`)
- `utils/auth.ts` — `storeTokens`, `getTokens`, `clearTokens`, `getUserRole`, `getUserId`
- Roles: `ADMIN | CUSTOMER | SERVICE_PROVIDER | SUPPLIER | MANAGER | SUPPORT`
- `services/api.ts` auto-injects Bearer token + handles 401 with refresh token queue
- Firebase used for phone auth (OTP)
- `helper/RegistrationGuard.tsx` wraps routes needing registration

### Real-time (`/contexts/SocketContext.tsx`)
Socket.io connection — notifications only. Socket URL derived from `NEXT_PUBLIC_API_URL` by stripping `/api/v1`.

### UI Components (`/components`)
- `components/common/` — shared (Footer, BackButton, LoginModal)
- `components/auth/` — auth screens
- `components/pages/` — page-specific heavy components
- `components/supplier/` — supplier dashboard features

### SEO (`/lib/seo`)
- `buildMetadata.ts` — JSON-LD schema builders
- `sitePageSeo.ts` — page metadata with fallback
- `breadcrumbs.ts`, `blogSitemap.ts`, `publicProfile.ts`

`next.config.ts` redirects camelCase → kebab-case URLs for canonical SEO.

## Key Environment Variables

```
NEXT_PUBLIC_API_URL          # Backend API base (e.g. http://localhost:5800/api/v1)
NEXT_PUBLIC_SECRET_KEY       # AES encryption key for SecureStorage
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_FIREBASE_*       # Firebase phone auth config
```

## Path Alias

`@/*` resolves to repo root. Use `@/components/...`, `@/services/...`, etc.

## Form Validation

Forms use React Hook Form + **Yup** (not Zod, despite stack notes). Yup schemas defined inline or alongside form components.

## Tests

Tests live in `__tests__/`. Coverage focuses on SEO utilities, robots.ts, sitemap, and search page. Jest uses `ts-jest` with `node` test environment.
