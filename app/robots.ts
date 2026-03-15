import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kartsquare.com';

/**
 * Robots.txt tuned for marketplace SEO:
 * - Allow all public content (store, services, blogs, legal, search)
 * - Disallow auth, dashboards, and low-value URLs to preserve crawl budget
 * - Single sitemap reference for fast discovery
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/dashboard',
          '/dashboard/',
          '/myAccount',
          '/myAccount/',
          '/login',
          '/signUp',
          '/resetPassword',
          '/forgotPassword',
          '/emailVerfication',
          '/verifyDocuments',
          '/selectRole',
          '/preferences',
          '/supplier/onboarding',
          '/supplier/register',
          '/supplier/login',
          '/supplier/verify-otp',
          '/sup/',
          '/cus/',
          '/spr/',
          '/chat',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/dashboard',
          '/dashboard/',
          '/myAccount',
          '/myAccount/',
          '/login',
          '/signUp',
          '/resetPassword',
          '/forgotPassword',
          '/emailVerfication',
          '/verifyDocuments',
          '/selectRole',
          '/preferences',
          '/supplier/',
          '/sup/',
          '/cus/',
          '/spr/',
          '/chat',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
