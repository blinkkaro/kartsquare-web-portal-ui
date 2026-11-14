import { MetadataRoute } from "next";

// One canonical origin for the sitemap link, the same as every canonical tag (the www host).
const BASE_URL = String(process.env.NEXT_PUBLIC_SITE_URL || "https://www.kartsquare.com").replace(/\/$/, "");

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
    '/search',
    '/admin',
    '/checkout',
    '/cart',
    '/orders',
  ] as const;

  return {
    rules: [
      {
        // Single wildcard rule — Googlebot (and all other crawlers) inherit from '*'.
        // A duplicate Googlebot block with identical rules wastes robots.txt space and
        // can confuse some parsers. Removed.
        userAgent: '*',
        // Google needs the built JS and CSS to render pages, so those stay crawlable even though
        // the rest of /_next/ is not. The longer Allow paths win over the Disallow.
        allow: ['/', '/_next/static/', '/_next/image'],
        disallow: [...privateDisallow],
      },
    ],
    // NOTE: 'host' is NOT a valid robots.txt directive (it was a Yandex-specific extension).
    // Next.js outputs "Host: ..." which some crawlers reject entirely. Removed.
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
