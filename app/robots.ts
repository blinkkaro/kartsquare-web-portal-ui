import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kartsquare.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/myAccount/', '/login', '/signUp', '/resetPassword'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
