# 06 · Coding standards

Enforced by `eslint.config.mjs`, `.prettierrc`, `tsconfig.json` (`strict`), Husky + lint-staged and CI. A rule below is tagged **[lint]** when a tool enforces it, **[review]** when a reviewer must.

**Ratchet.** The code written before these standards has ~2,300 lint warnings (mostly `any` and unused variables). They are warnings repo-wide, but **lint-staged runs ESLint with `--max-warnings=0` on every file you commit**, so any file you touch must be clean. Nothing new gets in; the old count only falls. Do not mass-fix unrelated files in a feature PR.

## Files and folders

| Thing | Convention | Example |
| --- | --- | --- |
| React component file | PascalCase `.tsx`, one exported component per file, default export | `CategoryIcon.tsx` |
| Hook | `use` + camelCase, file name = hook name | `hooks/useDebounce.ts` |
| Service | `<domain>/<domain>Service.ts`, `apiEndPoints.ts`, `<domain>Interface.ts` | `services/booking/bookingService.ts` |
| Util / lib | camelCase `.ts` | `utils/serviceRoute.ts` |
| Constants | `constants/*.ts`; exported values `UPPER_SNAKE` | `COLORS`, `SEO_MIN_PROVIDERS_SITEMAP` |
| Route folder | **kebab-case** (new routes only; old camelCase routes redirect) | `app/about-us/page.tsx` |
| Test | next to its layer in `tests/`, `<subject>.test.ts(x)`; e2e `<flow>.spec.ts` | `tests/unit/hooks/useDebounce.test.tsx` |

Where things go:
- Used by **one page** → `components/pages/<page>/`. Used by **two or more** → `components/common/`. Supplier-only → `components/supplier/`.
- No component imports from another page's folder. Promote it to `common/` instead.
- `lib/` and `utils/` do not import React or MUI. Anything that renders belongs in `components/`.
- Do not create new top-level folders without updating `CLAUDE.md` and `02-architecture.md`.
- `@/*` resolves to the repo root. Always use `@/...` for cross-folder imports; use `./` only inside the same folder. Never `../../`. **[review]**

## Import order **[lint: `import/order`]**

One blank-line-free block, in this order:

1. `react`, `react-dom`
2. `next`, `next/*`
3. third-party packages (`@mui/*`, `@tanstack/*`, `axios`…)
4. local `@/...` imports
5. relative `./` imports
6. `import type` last

```tsx
"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { COLORS } from "@/constants/colors";
import { useCategories } from "@/hooks/useCategories";
import { Section } from "./shared";
```

## TypeScript

- `strict: true` stays on. **[tsc in CI]**
- **No `any`.** Use a real type, a generic, or `unknown` plus narrowing. **[lint: warn globally, error-equivalent on commit]**
- **`interface` for object shapes**, `type` for unions, intersections, mapped and utility types. **[lint]**
- **No non-null `!`** unless a comment states the invariant. Prefer `??`, optional chaining or an early return.
- `import type` for type-only imports. **[lint]**
- No `// @ts-ignore`. `// @ts-expect-error` needs a description. **[lint]**
- Backend field names are `snake_case`; keep them in service types. Convert to UI-friendly shapes in the hook's `select`, not in components.
- Use enums only where the backend sends the string (`UserRole`). Otherwise string-literal unions.
- Exported functions and hooks have explicit return types when it is not obvious.
- No unused variables or imports; prefix an intentionally unused argument with `_`. **[lint]**
- `===` / `!==` only. **[lint]**

## Components

- **Server by default.** Add `"use client"` only for state, effects, event handlers, browser APIs, or client-only libraries (MUI components that need it, Framer Motion, Swiper, Maps). Keep the boundary as low as possible: a server `page.tsx` renders a client view. **[review]**
- Props typed with an `interface <Name>Props`. Destructure in the signature.
- Components render; they do not fetch. Data comes from a hook in `hooks/`. **No Axios in components. [lint]**
- Do not call hooks conditionally or after an early `return`; run every hook first, then return early. **[lint: `rules-of-hooks`]**
- A function named `useX` must be a hook, and a hook must be named `useX`. **[lint]**
- Lists need a stable `key` (an id, never the array index when the list can reorder).
- Keep a component under ~250 lines. Split subcomponents into their own files once it grows past that.
- No business logic in JSX. Extract a function, add a test.
- Every page exports metadata: `seoPublic(...)`/builders for public, `seoPrivate(...)` for private. **[review]**

## Styling

- **MUI `sx` and theme tokens only.** No Tailwind, no new CSS-in-JS library, no new global CSS (add CSS variables to `app/globals.css` only when the theme cannot express it).
- **No inline `style={{}}`** except for values that are genuinely dynamic and cannot be an `sx` value. **[review]**
- **No hex/rgb literals in components.** Use `COLORS` or `theme.palette`. **[review]**
- Spacing from the 8 px scale (`sx={{ p: 2 }}`); radii and breakpoints from the theme. See `03-design-system.md`.
- Mobile first: write the base style for phones, then `sm`, `md` overrides.
- Images with `next/image`, never raw `<img>` (a `no-img-element` warning). **[lint]**

## State and data

- Server data → TanStack Query hook. UI-wide flag → Redux slice in `features/ui/`. Everything else → local state. See `02-architecture.md`.
- Query keys are arrays starting with the domain: `["categories"]`, `["services", filters]`. Mutations invalidate the keys they affect.
- Forms: React Hook Form + **Yup** (not Zod). Schema next to the form.
- Never read or write `localStorage` for tokens directly. Use `utils/auth.ts`. **[review]**
- No `console.log` (`warn`/`error` allowed). **[lint]**

## Errors, copy and content

- Every query shows loading, error and empty states. No spinner-forever, no blank panel. **[review]**
- Never show fabricated data as real (see the business rules in `01-project-overview.md`). No "verified", no invented counts or ratings. **[review]**
- User-facing strings are plain, specific sentences. Escape quotes in JSX text (`&apos;`).
- Accessibility: labelled form controls, `alt` on images (`""` if decorative), buttons are `<button>`, links are `<a>`/`Link`, focus visible, touch targets ≥ 44 px.

## Formatting **[Prettier]**

`.prettierrc`: 100 columns, 2 spaces, double quotes, semicolons, trailing commas everywhere, LF. lint-staged formats every staged file, so do not hand-format. Run `npm run format` for the whole repo only in a dedicated formatting PR.

## Testing

Full rules in `07-testing-strategy.md`. Minimum for a PR: new logic in `lib/`, `utils/`, `hooks/` or `services/` has a unit/integration test; a bug fix has a test that fails without the fix.

- Files: `<subject>.test.ts(x)` under `tests/unit|integration/...`.
- `describe("<Subject>")` then `it("<outcome in plain words>")`. Not `it("works")`, not `it("test 1")`.
- One behaviour per `it`; arrange / act / assert with no logic in the test.

## Git

- Branches: `feature/<short-kebab>`, `fix/<short-kebab>`, `chore/<short-kebab>`, `docs/<short-kebab>`. Work branches off `development`; `development` merges to `main` by PR.
- Commits: imperative, specific, ≤ 72 chars on the first line, no trailing period. Say what changed for the user or the codebase, not the file.
  - Good: `Feed on phones: no gap under the header`, `Bundle category icon drawings instead of fetching them`
  - Bad: `fix`, `changes`, `update files`, `wip`
- Optional Conventional-Commit prefix (`feat:`, `fix:`, `docs:`, `chore:`, `test:`) is welcome but not required; be consistent within a PR.
- One logical change per commit; do not mix a refactor with a behaviour change.
- PRs: describe what and why, list how you tested it, add a screenshot for any visual change, link the issue. Squash or merge as the team prefers, but CI must be green.
- Never commit `.env*`, secrets, `.next/`, `coverage/`, or `*.tsbuildinfo`. Never `--no-verify` to get past the hooks; fix the cause.
- Never run `npm`/`next` with `sudo`: it leaves root-owned files in `.next/` and `node_modules/` that break the next normal run.

## Before you open a PR

```bash
npm run lint && npm run typecheck && npm test
```

Husky runs lint-staged on commit and `typecheck` on push; CI runs lint, typecheck, tests with coverage, and Playwright.
