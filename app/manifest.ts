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
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon', purpose: 'any' },
    ],
  };
}
