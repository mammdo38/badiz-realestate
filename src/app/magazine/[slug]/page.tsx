import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { blogPosts, listings } from '@/data';
import BlogPostClient from './BlogPostClient';
import { getDynamicRegions, getAbsoluteImageUrl } from '@/utils';
import { BlogPost } from '@/types';

// We disable generateStaticParams because the slugs are dynamic now
// export async function generateStaticParams() {
//   return blogPosts.map((p) => ({
//     slug: p.slug,
//   }));
// }

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPostData(slug: string): Promise<(BlogPost & { id?: string }) | undefined> {
  try {
    const cleanSlug = encodeURIComponent(decodeURIComponent(slug));
    const res = await fetch(`http://localhost:5000/api/posts/${cleanSlug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const item = data.data;
      if (item) {
        return {
          id: item.id ? item.id.toString() : '',
          slug: item.slug,
          title: item.title,
          category: item.category,
          date: item.published_at ? new Date(item.published_at).toLocaleDateString('fa-IR') : 'جدید',
          readTime: '۵ دقیقه',
          excerpt: item.excerpt || '',
          imageEmoji: '📰',
          bgGradient: 'from-orange-100 to-orange-200',
          views: item.views || 0,
          author: item.author_name || 'تیم تحریریه',
          content: item.content,
          coverImage: item.cover_image,
          metaTitle: item.meta_title,
          metaDescription: item.meta_description,
          focusKeyword: item.focus_keyword,
        };
      }
    }
  } catch (e) {
    console.error("Error fetching single post", e);
  }
  const decoded = decodeURIComponent(slug);
  const local = blogPosts.find(p => p.slug === decoded || p.slug === slug);
  if (local) return local;
  return undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData(slug);
  
  if (!post) {
    return {
      title: "مقاله یافت نشد",
    };
  }
  const defaultTitle = `${post.title} | مجله املاک بادیز`;
  const title = (post.metaTitle || defaultTitle).substring(0, 70);
  const description = (post.metaDescription || post.excerpt || '').substring(0, 160);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/magazine/${encodeURIComponent(post.slug || slug)}`;
  
  const ogImage = post.coverImage 
    ? `https://badizvilla.ir/api/og-image/${post.coverImage}`
    : `https://badizvilla.ir/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "املاک بادیز کردان",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: title,
        }
      ],
      type: "article",
      locale: "fa_IR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const isNumeric = /^\d+$/.test(slug);
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  if (isNumeric && post.slug) {
    permanentRedirect(`/magazine/${encodeURIComponent(post.slug)}`);
  }

  let fetchedPosts: BlogPost[] = [];
  let postsFetchedSuccessfully = false;
  try {
    const relatedRes = await fetch(`http://localhost:5000/api/posts?limit=3`, { cache: 'no-store' });
    if (relatedRes.ok) {
      const data = await relatedRes.json();
      if (data.success && data.data) {
        postsFetchedSuccessfully = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetchedPosts = data.data.map((item: any): BlogPost => ({
          slug: item.slug,
          title: item.title,
          category: item.category,
          date: item.published_at ? new Date(item.published_at).toLocaleDateString('fa-IR') : 'جدید',
          readTime: '۵ دقیقه',
          excerpt: item.excerpt || '',
          imageEmoji: '📰',
          bgGradient: 'from-orange-100 to-orange-200',
          views: item.views || 0,
          author: item.author_name || 'تیم تحریریه',
          content: item.content,
          coverImage: item.cover_image
        }));
      }
    }
  } catch (e) {}

  // Schema.org structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/og-default.jpg`,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "بادیز املاک",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/logo.png`
      }
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "مجله بادیز",
        "item": "https://badizvilla.ir/magazine"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": post.title
      }
    ]
  };

  let initialListings: any[] = [];
  try {
    const listRes = await fetch(`http://localhost:5000/api/listings?limit=4`, { cache: 'no-store' });
    if (listRes.ok) {
      const data = await listRes.json();
      if (data.success && data.data) {
        initialListings = data.data.map((item: any) => ({
          id: item.id.toString(),
          slug: item.slug,
          title: item.title,
          dealType: item.deal_type,
          propertyType: item.property_type,
          region: item.region_slug || 'kordan-markazi',
          price: item.price ? new Intl.NumberFormat('fa-IR').format(item.price) : 'توافقی',
          priceUnit: item.price_label || 'تومان',
          deposit_price: item.deposit_price,
          monthly_rent: item.monthly_rent,
          bedrooms: item.bedrooms || 0,
          sizeBuilt: item.size_built || 0,
          primaryImage: item.default_image || item.primary_image || item.images?.[0]?.filename,
          agentName: item.agent_name,
        }));
      }
    }
  } catch (e) {}

  const relatedPosts = (postsFetchedSuccessfully && fetchedPosts.length > 0)
    ? fetchedPosts
    : blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const fallbackListings = initialListings.length > 0
    ? initialListings
    : listings.slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPostClient 
        post={post} 
        initialBlogPosts={relatedPosts} 
        initialRegions={await getDynamicRegions()} 
        initialListings={fallbackListings}
      />
    </>
  );
}
