# 04 · API contracts

Backend: `Blinkkaro_backend` (Express + TypeScript). Base URL = `NEXT_PUBLIC_API_URL` (prod `https://api.kartsquare.com/api/v1`). Every path below is relative to it.

**Source of truth for paths:** each domain's `services/<domain>/apiEndPoints.ts`. This page is a map; when it disagrees with those files, they win. Request/response types are in the sibling `*Interface.ts` files.

## Envelope

Every JSON response has this shape (`ApiResponse<T>` in `services/api.ts`):

```json
{ "status": "success", "message": "Categories retrieved successfully", "data": <T> }
```

The Axios response interceptor already unwraps the HTTP layer, so a service call returns that body, and services return `response.data` (the `<T>`). Errors from the backend look like `{ "status": "error", "message": "Something went wrong" }`.

## Auth pattern

| Step | What happens |
| --- | --- |
| Login | `POST /auth/login` (email) or Firebase OTP then `/auth/register` / guest login. Returns `tokens.access_token` + `tokens.refresh_token`, `user`. |
| Store | `storeTokens()` in `utils/auth.ts` writes both, AES-encrypted by `helper/SecureStorage.ts`. |
| Send | Request interceptor adds `Authorization: Bearer <access token>` on every call **unless** the service passes `requiresAuth = false`. |
| Public endpoints | Pass `false` as the last argument: `GET(url, {}, false)`. Categories, listings, locations, top providers, SEO pages, and public profiles are public. |
| Expire | On `401`, if a refresh token exists the interceptor calls `POST /auth/refresh-token` once, queues other 401s behind it, then replays them. |
| Fail | No token: opens the login modal. Refresh fails: `logout()` (Redux) and tokens cleared. |

Roles from the token payload: `ADMIN | CUSTOMER | SERVICE_PROVIDER | SUPPLIER | MANAGER | SUPPORT`.

## Error handling pattern

1. **Services** `try/catch`, `console.error("Error fetching X:", error)`, then **re-throw**. They never return fake data.
2. **A 401 does not throw.** With no token or a failed refresh the interceptor *resolves* with `{ data: null, success: false, status: "failed", message: "Authentication required" }` so the UI can react (login modal) instead of crashing. Services must treat `data === null` as "not signed in".
3. **Other 4xx/5xx reject** with an `AxiosError`; read `error.response?.status` and `error.response?.data?.message`.
4. **TanStack Query** owns retry and error state: one retry, only for network errors and 5xx, never for 4xx (`app/providers.tsx`). Components render `isError` as an error state with a retry action, not an empty list.
5. **Mutations** show `toast.error(message)` from the backend `message` when present, a generic line otherwise. Never show raw `AxiosError` text.
6. Timeout is 10 s. Uploads use `FormData` (the wrapper switches to `multipart/form-data`).

## Rate limits and CORS

The backend rate-limits per IP (100 requests per window outside dev; a `429` is not retried). CORS is an **allowlist** of the kartsquare hosts; `http://localhost:3000` is added only when the backend's `NODE_ENV` is not `production`. An origin outside the list gets `500` with no CORS headers (see `01-project-overview.md`).

## Endpoints used by this app

Paths with `:x` take a parameter. "Auth" = needs a bearer token. **Pub** = public (`requiresAuth: false`). Where a row lists several verbs, the exact verb per function is in that domain's service file; the client sends `PUT` for updates and never `PATCH`.

### Catalogue and search

| Method | Path | Auth | Domain file | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/categories` | Pub | `serviceList` | Categories: `id, name, slug, description, icon` (`ph:*-duotone`), `color` (`#rrggbb`), `image` (Cloudinary URL), `is_deleted` |
| GET | `/categories/:id` | Pub | `serviceList` | One category |
| GET | `/services` | Pub | `serviceList` | Service search/list (filters in query) |
| GET | `/services/:idOrSlug` | Pub | `serviceList` | Service detail; accepts UUID or slug |
| GET | `/services/serviceProvider` | Auth | `serviceList` | The provider's own services |
| POST | `/services` | Auth | `serviceList` | Create a service |
| POST | `/services/:id/increasePhoneNumberViewCount` | Pub | `serviceList` | Count a phone reveal |
| GET | `/locations?kind=city&active=true` | Pub | `location` | Active cities |
| GET | `/locations/resolve?q=` | Pub | `location` | Resolve text/coords to a place |
| GET | `/locations/:city/categories` | Pub | `location` | Categories available in a city |
| GET | `/locations/:...segments/listing` | Pub | `location` | City/area/category/sub-category listing + `canonical_path` |
| GET | `/locations/sitemap` | Pub | `location` | URLs for the sitemap |
| GET | `/homepage/top-providers?limit&latitude&longitude` | Pub | `topSuppliers` | Home: nearby providers |
| GET | `/homepage/top-services?limit&latitude&longitude` | Pub | `topSuppliers` | Home: nearby services |
| GET | `/seo/pages/:pageKey` | Pub | `lib/seo/sitePageSeo.ts` | DB-backed meta title/description |
| POST | `/agentic-search` | Pub | `ai` | AI search |
| POST | `/agentic-search/aibot` | Pub | `ai` | Kart AI chat |

### Auth and account

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/guest-login` | Sign in/up/out |
| POST | `/auth/refresh-token` | Token refresh |
| POST | `/auth/forgot-password`, `/auth/reset-password` | Password reset |
| POST | `/otp/email_verify`, `/otp/resend` | Email OTP |
| GET | `/auth/registration-details` | Registration progress |
| GET/POST | `/auth/preferences`, `/auth/get-user-preferences`, `/auth/update-preferences` | Role and interests |
| GET/POST | `/auth/get-business-info`, `/auth/add-business-info`, `/auth/update-business-info` | Provider business info |
| POST | `/auth/upload-doc`, `/upload/documents`, `/auth/upload-acc-details` | Documents / account details |
| GET/POST | `/auth/freeLead/getNumber/:id`, `/auth/freeLead/verify-otp/:id`, `/auth/freeLead/apply` | Free listing + phone OTP |
| GET | `/profile/me` | Current user |
| PUT | `/profile` | Update profile |
| DELETE | `/profile/delete-account` | Delete account |
| POST | `/profile/change-password` | Change password |
| GET | `/profile/provider/:username` | **Public** provider profile by handle (`/in/{username}`) |
| GET | `/profile/:id`, `/profile/:id/posts`, `/profile/:id/services`, `/profile/:id/reels`, `/profile/supplier/:id` | Profile sections (paged: `page`, `limit`) |
| PUT | `/profile/show-number` | Opt in/out of showing the phone number |
| POST | `/account-deletion-requests` | Public deletion request |
| GET/POST/PUT/DELETE | `/user/addresses/getUserAddresses`, `createAddress`, `updateAddress/:id`, `deleteAddress/:id` | Saved addresses |

### Booking, leads, schedule

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/leads` | Create a service request (lead) |
| POST | `/service-bookings/create` | Create a booking |
| GET | `/service-bookings/user/bookings`, `/service-bookings/user/details` | Customer bookings |
| GET | `/service-bookings/provider/details` | Provider booking detail |
| PUT | `/service-bookings/:id/status` | Accept/reject/complete |
| GET | `/service_appointment/appointments/slots` | Free slots |
| GET/POST/DELETE | `/sp_schedule/providers/working-hours`, `/working-hours/bulk`, `/sp_schedule/working-hours` | Provider hours |
| GET | `/provider-dashboard`, `/provider-dashboard/chart` | Provider analytics |

### Social, reviews, notifications, ads

| Method | Path | Purpose |
| --- | --- | --- |
| GET/POST | `/social_posts/posts_feed`, `/social_posts/`, `/social_posts/reels` | Feed, create, reels |
| GET/POST | `/social_posts/:id/comments`, `/social_posts/:id/like` | Comments, likes |
| POST/DELETE/GET | `/follow/:id`, `/follow/:id/followers`, `/follow/:id/following` | Follow graph |
| GET/POST/PUT/DELETE | `/stories`, `/stories/:id`, `/stories/:id/view` | Stories |
| GET/POST | `/reviews`, `/reviews/submit` | Reviews |
| GET | `/notifications` | Notification list (live pushes arrive over Socket.io) |
| GET/POST/PUT/DELETE | `/advertise/*` | Provider ads; `GET /advertise/active` is public |
| GET | `/appConfig/getAppTermsAndConditions`, `/getAppPrivacyPolicy`, `/getAIServiceConfig` | App config |
| POST | `/waitlist/join` | Contact-us form |

### Supplier / B2B

| Method | Path | Purpose |
| --- | --- | --- |
| GET/POST | `/supplier/profile`, `/supplier/kyc`, `/supplier/store` | Supplier profile, KYC, store |
| GET/POST/PUT | `/supplier/products`, `/supplier/products/:id`, `/products`, `/products/:id`, `/products/status/:id`, `/products/supplier` | Products |
| GET | `/product-categories`, `/product-sub-categories/:id`, `/product-brands`, `/product-brands/:subId`, `/product-specifications/:subId` | Product taxonomy |
| GET/PUT | `/supplier/enquiries`, `/supplier/enquiries/:id/status` | Enquiries |
| GET/PUT | `/supplier-quotations`, `/supplier-quotations/:id/viewed` | Quotations |
| GET | `/supplier/dashboard`, `/supplier-dashboard`, `/supplier-dashboard/chart` | Metrics |
| GET/POST | `/email-marketing/smtp-settings`, `/campaigns`, `/campaigns/:id`, `/campaigns/:id/send`, `/unsubscribe` | Email campaigns (opt-in only) |

### Realtime

Socket.io on the API host with `/api/v1` stripped (`contexts/SocketContext.tsx`). Carries notifications only; do not add other event types without updating this page.

## Adding or changing an endpoint

1. Add the path to `services/<domain>/apiEndPoints.ts` (a string, or a function for params).
2. Add request/response types to `*Interface.ts`. Mirror the backend field names exactly (they are `snake_case`); convert in the hook's `select`, not in the service.
3. Add the service function; pass `requiresAuth = false` for public endpoints.
4. Add a hook in `hooks/` with a stable `queryKey`. Invalidate related keys in mutations.
5. Add an integration test in `tests/integration/api/` (see `07-testing-strategy.md`).
6. Update this page.
