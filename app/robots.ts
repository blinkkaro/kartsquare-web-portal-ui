import { MetadataRoute } from 'next';

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kartsquare.com"
).replace(/\/$/, "");

/**
 * Robots.txt tuned for marketplace SEO:
 * - Allow all public content (store, services, blogs, legal, search)
 * - Disallow auth, dashboards, and low-value URLs to preserve crawl budget
 * - Single sitemap reference for fast discovery
 */
export default function robots(): MetadataRoute.Robots {
  /** Paths that should never be indexed — shared across all user agents */
  const privateDisallow = [
    '/api/',
    '/_next/',
    // ── Auth & onboarding flows ──────────────────────────────────────────
    '/login',
    '/signUp',
    '/resetPassword',
    '/forgotPassword',
    '/emailVerification',
    '/verifyDocuments',
    '/selectRole',
    '/preferences',
    '/businessInfo',
    '/unsubscribe',
    // ── Customer private areas ───────────────────────────────────────────
    '/dashboard',
    '/schedule',
    '/chat',
    '/myAccount/',
    '/cus/bookings',
    '/cus/notifications',
    // ── Service booking checkout (transactional, not for indexing) ────────
    '/services/*/book',
    // ── Service provider private dashboard ──────────────────────────────
    '/spr/',
    // ── Supplier (customer-alias) private area ────────────────────────────
    '/sup/',
    // ── Supplier portal — full prefix (auth pages + dashboard) ────────────
    '/supplier/',
  ] as const;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...privateDisallow],
      },
      {
        // Googlebot gets the same rules — explicit declaration lets Search Console show them clearly
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [...privateDisallow],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
