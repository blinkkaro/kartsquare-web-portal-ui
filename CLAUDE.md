# CLAUDE.md

Kartsquare web portal: a Jaipur-first local-services marketplace (customers find and request providers; providers and suppliers manage listings, bookings and products). Public SEO site + customer app + provider/supplier dashboards. Backend is a separate repo (`Blinkkaro_backend`).

## Always read docs/ before making changes

Read the file(s) for your task **before** editing. They are the standards, and they describe the code as it is today.

| Task touches | Read |
| --- | --- |
| Product, roles, copy, business rules | [docs/01-project-overview.md](docs/01-project-overview.md) |
| Routing, rendering, state, data flow | [docs/02-architecture.md](docs/02-architecture.md) |
| Any UI: colours, fonts, spacing, motion | [docs/03-design-system.md](docs/03-design-system.md) |
| Backend calls, auth, errors | [docs/04-api-contracts.md](docs/04-api-contracts.md) |
| URLs, metadata, sitemap, redirects | [docs/05-seo-url-architecture.md](docs/05-seo-url-architecture.md) (full spec: [docs/seo-url-architecture.md](docs/seo-url-architecture.md)) |
| **Service URLs, SEO, sitemap, indexing: current state and open items (read first)** | [docs/10-url-seo-index-state.md](docs/10-url-seo-index-state.md) |
| Writing any code | [docs/06-coding-standards.md](docs/06-coding-standards.md) |
| Tests | [docs/07-testing-strategy.md](docs/07-testing-strategy.md) |

If code and a doc disagree, say so and fix whichever is wrong in the same PR.

## Stack (as installed, not as planned)

Next.js **16** App Router · React **19** · TypeScript strict · **MUI v7** (no Tailwind, no shadcn) · Redux Toolkit (UI state only) · TanStack Query v5 (all server state) · Axios · React Hook Form + **Yup** (not Zod) · Framer Motion · Socket.io · Jest + Testing Library + Playwright.

## Commands

```bash
npm run dev               # dev server (localhost:3000)
npm run build             # production build
npm run lint              # ESLint (0 errors required; warnings are legacy debt)
npm run typecheck         # tsc --noEmit (app) + tsconfig.tests.json (tests, e2e)
npm test                  # Jest (unit + integration + legacy __tests__)
npm run test:coverage     # with thresholds
npm run test:e2e          # Playwright (build first)
npm run format            # Prettier (whole repo; normally lint-staged does this)
npx jest tests/unit/lib/toSlug.test.ts   # one test file
```

Before a PR: `npm run lint && npm run typecheck && npm test`. Never use `sudo` with npm/next, and never `--no-verify`.

## Folder structure

```
app/          routes (server page.tsx by default; kebab-case for new routes)
components/   common/ (shared) · pages/<page>/ (page-specific) · auth/ · supplier/
services/     <domain>/{<x>Service.ts, apiEndPoints.ts, <x>Interface.ts}  ← only place that talks to Axios
hooks/        TanStack Query hooks (useX) consumed by components
store/ features/ui/   Redux (UI flags, auth user, modals)
lib/ utils/   framework-free helpers (lib/seo/ = metadata, JSON-LD, sitemap)
constants/    colors.ts (COLORS) and static config
tests/        unit/ · integration/ · e2e/      (+ legacy __tests__/)
docs/         standards: read on demand
```

## Key conventions

- **Layering:** component → `hooks/useX` → `services/*Service` → `services/api.ts`. No Axios in components or hooks.
- **Server by default.** `"use client"` only when needed, as low in the tree as possible. Every page exports metadata (`seoPublic` / `seoPrivate`).
- **Naming:** components PascalCase `.tsx`; hooks `useX.ts`; utils camelCase; new routes kebab-case; tests `<subject>.test.ts(x)`.
- **Imports:** `@/*` = repo root; never `../../`. Order: React → Next → third-party → `@/` → relative → types.
- **TypeScript:** no `any`, `interface` over `type` for object shapes, `import type`, no `!` without a reason, no `@ts-ignore`.
- **Styling:** MUI `sx` + `COLORS`/theme tokens. No hex in components, no Tailwind, no inline `style`. 8 px spacing scale. Light theme only.
- **Images:** `next/image`; Cloudinary via `lib/cloudinaryLoader`; new remote hosts go in `next.config.ts`.
- **Category icons** only via `components/common/CategoryIcon` (bundled Phosphor data, never fetched).
- **Forms:** React Hook Form + Yup. **Auth/tokens:** only through `utils/auth.ts`.
- **Commits:** imperative, specific, ≤ 72 chars. Branches `feature|fix|chore|docs/<kebab>` off `development`.
- **Lint ratchet:** ESLint warns repo-wide but lint-staged requires 0 warnings in every file you commit. Leave each touched file cleaner than you found it.

## Business rules (never violate in copy, metadata or data)

No fake claims (invented ratings, counts, "trusted by"). No "verified" label without an explicit backend status. Outreach is opt-in only. No placeholder data presented as real. Details: docs/01.

## Environment

```
NEXT_PUBLIC_API_URL            backend base, e.g. https://api.kartsquare.com/api/v1 or http://localhost:5900/api/v1
NEXT_PUBLIC_SECRET_KEY         AES key for SecureStorage (visible to browsers: not a real secret)
NEXT_PUBLIC_SITE_URL           canonical site origin for SEO
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, NEXT_PUBLIC_FIREBASE_*   maps, phone-OTP auth
```

**Local dev:** run the backend on `:5900`; `next.config.ts` proxies `/api/*` to it in dev. Put `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1` in `.env.local`. The deployed API rejects `localhost` origins (CORS), so do not point local pages straight at it (docs/01).
