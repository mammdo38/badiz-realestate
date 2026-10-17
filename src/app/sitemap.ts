import { MetadataRoute } from 'next';
import { listings as mockListings, regions, blogPosts as mockPosts } from '@/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir';

  // Fetch real dynamic data with fallbacks
  let dynamicListings = mockListings;
  let dynamicPosts = mockPosts;

  try {
    const [listingsRes, postsRes] = await Promise.all([
      fetch('http://localhost:5000/api/listings?limit=1000', { next: { revalidate: 3600 } }),
      fetch('http://localhost:5000/api/posts?limit=1000', { next: { revalidate: 3600 } })
    ]);

    if (listingsRes.ok) {
      const data = await listingsRes.json();
      if (data.success && Array.isArray(data.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dynamicListings = data.data.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          slug: item.slug || item.id.toString()
        }));
      }
    }

    if (postsRes.ok) {
      const data = await postsRes.json();
      if (data.success && Array.isArray(data.data)) {
        dynamicPosts = data.data;
      }
    }
  } catch (error) {
    console.error('Failed to fetch dynamic data for sitemap, using fallback static data.', error);
  }

  // Static routes
  const staticRoutes = [
    '',
    '/magazine',
    '/contact',
    '/search-results',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Region routes (regions are currently static categories)
  const regionRoutes = Object.keys(regions).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic Listing routes
  const listingRoutes = dynamicListings.map((l: any) => ({
    url: `${baseUrl}/listing/${encodeURIComponent(decodeURIComponent(l.slug))}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Dynamic Blog routes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blogRoutes = dynamicPosts.map((p: any) => ({
    url: `${baseUrl}/magazine/${encodeURIComponent(decodeURIComponent(p.slug))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...regionRoutes,
    ...listingRoutes,
    ...blogRoutes,
  ];
}
