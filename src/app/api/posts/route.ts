import { NextResponse } from 'next/server';
import { blogPosts } from '@/data';

export async function GET() {
  const data = blogPosts.map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    published_at: item.date,
    created_at: item.date,
    excerpt: item.excerpt,
    views: item.views,
    author_name: item.author,
    content: item.content,
    cover_image: item.coverImage,
    meta_title: item.metaTitle,
    meta_description: item.metaDescription,
    focus_keyword: item.focusKeyword,
    is_published: true,
    is_featured: true
  }));

  return NextResponse.json({ success: true, data });
}
