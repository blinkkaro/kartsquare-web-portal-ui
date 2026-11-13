# 07 · Testing strategy

Three layers, one folder each, each with a runnable example to copy.

```
tests/
├── unit/                 Jest. One function / hook / component, no network.
│   ├── components/       CategoryIcon.test.tsx         (jsdom + Testing Library)
│   ├── hooks/            useDebounce.test.tsx          (jsdom + renderHook + fake timers)
│   ├── utils/            serviceRoute.test.ts          (node, pure function)
│   └── lib/              toSlug.test.ts                (node, pure function)
├── integration/          Jest. Several real modules together; only the network is mocked.
│   ├── api/              serviceListService.test.ts    (service + mocked HTTP boundary)
│   └── flows/            categoriesFlow.test.tsx       (hook + QueryClient + service mock)
└── e2e/                  Playwright. Real browser, real build.
    ├── customer/         home.spec.ts
    └── provider/         auth-gate.spec.ts
__tests__/                Older Jest suites (SEO, feed, services). Still run; move them into tests/ when you next touch them.
```

## Commands

```bash
npm test                      # all Jest tests (unit + integration + legacy)
npm run test:unit             # tests/unit only
npm run test:integration      # tests/integration only
npm run test:coverage         # with coverage and the thresholds below
npx jest tests/unit/lib/toSlug.test.ts   # one file
npx jest -t "restarts the timer"          # one test by name
npm run test:e2e              # Playwright (needs `npm run build` first; see below)
```

## Layer 1: unit tests (Jest + React Testing Library)

**What:** one unit in isolation. Pure functions in `lib/`, `utils/`, `services/**` helpers; hooks in `hooks/`; presentational and small interactive components in `components/common/`.

**How:**
- Default environment is `node`. A test that renders React starts with `/** @jest-environment jsdom */` as the first comment in the file, and imports `@testing-library/jest-dom` for matchers like `toBeInTheDocument`.
- Query by what the user perceives: `getByRole`, `getByLabelText`, `getByText`. Use `data-testid` only as a last resort. Never assert on MUI class names (`.MuiButton-root`), which change between versions.
- Hooks: `renderHook`, wrap anything that moves time or state in `act`, use `jest.useFakeTimers()` and restore real timers in `afterEach`.
- Interaction: `@testing-library/user-event` (`await user.click(...)`), not `fireEvent`.
- No network, no timers left running, no shared state between tests.

## Layer 2: integration tests (API mocking)

**What:** the real service function or hook, with only the HTTP boundary replaced. Proves the endpoint, the auth flag, the response mapping and the error behaviour.

**How:**
- Mock the Axios wrapper: `jest.mock("@/services/api", () => ({ GET: jest.fn(), POST: jest.fn(), PUT: jest.fn(), DELETE: jest.fn() }))`, then `mockResolvedValue({ status: "success", data })` / `mockRejectedValue(new Error(...))`. Assert the **endpoint constant** and the `requiresAuth` argument, not a hard-coded string copy.
- Flows with TanStack Query: a **fresh `QueryClient` per test** with `retry: false`, wrapped in `QueryClientProvider`; mock the service module; `await waitFor(...)`.
- Cover the failure path of every service you test: backend error, network error, and the `401` shape (`{ data: null, success: false }`, see `04-api-contracts.md`).
- Never call the real API from Jest. (`__tests__/setup.ts` points `NEXT_PUBLIC_API_URL` at a dummy dev URL, and nothing should reach it.)

## Layer 3: end-to-end tests (Playwright)

**What:** the journeys that earn money or trust. Runs in Chromium at desktop and phone size (`playwright.config.ts`).

**Start with:** home loads and every image decodes; search returns results; a city/category page renders its listing; a service request reaches the confirmation; sign-in works; the provider dashboard loads; private pages are `noindex`; a provider profile page renders its metadata.

**How:**
- Locate with `getByRole` / `getByLabel` / `getByText`; assert with web-first matchers (`await expect(locator).toBeVisible()`), never `waitForTimeout`.
- E2E needs a reachable API. In CI set repository variables `E2E_API_URL` and `E2E_SECRET_KEY`. The API's CORS allowlist **must accept the origin the test runs from** (`http://localhost:3000`), or every data-driven page falls back to empty states. See `01-project-overview.md`.
- Credentials: a test account from the dev API's seed data, passed through environment variables. Never put a password, token or real user's data in a spec.
- Run locally: `npm run build && npm run test:e2e`, or against a running dev server: `E2E_BASE_URL=http://localhost:3000 npm run test:e2e`.
- Keep specs independent and parallel-safe; each creates what it needs.
- A failing spec keeps its trace and screenshot (`playwright-report/`, uploaded by CI).

## What to test, by area

| Area | Layer | Examples |
| --- | --- | --- |
| `lib/seo/*` | unit | metadata, canonicals, JSON-LD, robots, sitemap (already covered in `__tests__/seo/`) |
| `utils/*`, `lib/*`, helpers | unit | slugging, route params, icon lookup, image loader |
| `hooks/*` | unit + integration | debounce, `useCategories` filters deleted |
| `services/*` | integration | endpoint, auth flag, error rethrow |
| `components/common/*` | unit | `CategoryIcon`: accessibility and fallback |
| Big MUI views (`components/pages/*`) | e2e, not unit | don't snapshot-test them |
| Pages, routing, redirects | e2e + `curl -I` | redirect is one hop; private pages `noindex` |
| Business rules | unit/e2e | no "verified" text; no fake rating in JSON-LD |

**Don't test:** MUI/React internals, one-line pass-throughs, CSS values, or implementation details such as state shape or internal function calls. **Don't snapshot** whole pages; snapshots of large trees get blindly updated.

## Naming

```ts
describe("toSlug", () => {                                  // the subject, exactly as exported
  it("strips accents instead of dropping the letter", () => {   // outcome in plain words
    ...
  });
});
```

- File: `<subject>.test.ts(x)`; e2e: `<flow>.spec.ts`.
- `it` states the **behaviour**: `"hides deleted categories from the UI"`, not `"works"` or `"calls filter"`.
- `it.each` for the same assertion over many inputs.
- A bug fix starts with a test that fails for the bug.

## Coverage targets

- **Target: 80 % statements and lines** for `lib/`, `utils/`, `hooks/` and `services/`.
- Enforced per folder in `jest.config.js → coverageThreshold` as each folder reaches 80 %, so CI never fails on code nobody touched. Today only `lib/seo/` is gated. **Raise the list; never lower it.**
- Coverage is measured on logic only (`collectCoverageFrom`). Pages and MUI views are excluded and covered by e2e instead.
- Coverage is a floor, not a goal: a test that executes lines without asserting behaviour does not count in review.

## CI

`.github/workflows/ci.yml` on every PR and on pushes to `main`/`development`:

1. `check`: `npm ci` → `npm run lint` → `npm run typecheck` → `npm run test:coverage`
2. `e2e` (after `check`): installs Chromium, `npm run build`, `npm run test:e2e`, uploads the Playwright report on failure.

Locally, Husky runs lint-staged on commit (Prettier + ESLint on staged files, zero warnings) and `typecheck` on push.
