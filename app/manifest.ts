import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kartsquare.com';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: "Kartsquare – Local Services in Jaipur",
    short_name: 'Kartsquare',
    description: 'Find local service providers in Jaipur, see their work and send a request: AC repair, electricians, plumbers, cleaning, beauty and more.',
    lang: 'en-IN',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    // Matches <meta name="theme-color"> in app/layout.tsx (was MUI's default blue).
    theme_color: '#ffffff',
    orientation: 'portrait-primary',
    categories: ['lifestyle', 'business'],
    shortcuts: [
      { name: 'Find a service', short_name: 'Services', url: '/cus/services-list' },
      { name: 'Reels', url: '/cus/reels' },
      { name: 'List your business', short_name: 'List business', url: '/business-listing' },
    ],
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png', purpose: 'any' },
      { src: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
