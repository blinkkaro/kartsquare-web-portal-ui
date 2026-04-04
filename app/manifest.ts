import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kartsquare.com';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KartSquare – B2B Marketplace',
    short_name: 'KartSquare',
    description: 'Products and services from verified suppliers. Buy and book online.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1976d2',
    orientation: 'portrait-primary',
    categories: ['business', 'shopping'],
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
