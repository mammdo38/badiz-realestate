import { Suspense } from 'react';
import type { Metadata } from 'next';
import { blogPosts } from '@/data';
import MagazineClient from './MagazineClient';
import { BlogPost } from '@/types';

const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/magazine`;

export const metadata: Metadata = {
  title: "مجله تخصصی ملکی بادیز | راهنمای خرید ملک در کردان",
  description: "مقالات، راهنمای خرید ویلا و زمین، استعلامات قانونی و بررسی قیمت‌های روز املاک در کردان",
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: "مجله تخصصی ملکی بادیز | راهنمای خرید ملک در کردان",
    description: "مقالات، راهنمای خرید ویلا و زمین، استعلامات قانونی و بررسی قیمت‌های روز املاک در کردان",
    url,
    type: "website",
    locale: "fa_IR",
  },
  twitter: {
    card: "summary",
  }
};

export const revalidate = 60; 

export default async function BlogPage() {
  let fetchedPosts = [...blogPosts];
  let postsFetchedSuccessfully = false;
  try {
    const res = await fetch('http://localhost:5000/api/posts?limit=100', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        postsFetchedSuccessfully = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetchedPosts = data.data.sort((a: any, b: any) => {
          const aFeatured = a.is_featured ? 1 : 0;
          const bFeatured = b.is_featured ? 1 : 0;
          if (bFeatured !== aFeatured) return bFeatured - aFeatured;
          const aTime = new Date(a.published_at || a.created_at || 0).getTime();
          const bTime = new Date(b.published_at || b.created_at || 0).getTime();
          return bTime - aTime;
        }).map((item: any): BlogPost => ({
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
  } catch (e) {
    console.error("Error fetching magazine posts", e);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "مجله تخصصی ملکی بادیز",
    "description": "مقالات، راهنمای خرید ویلا و زمین، استعلامات قانونی",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/magazine`,
    "hasPart": fetchedPosts.map((post) => ({
      "@type": "Article",
      "headline": post.title,
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/magazine/${post.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-orange)]"></div>
        </div>
      }>
        <MagazineClient initialBlogPosts={fetchedPosts} />
      </Suspense>
    </>
  );
}
