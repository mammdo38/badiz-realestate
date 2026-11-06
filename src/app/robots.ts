import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir';
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/og-image/'],
      disallow: ['/admin/', '/api/', '/search-results?*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
