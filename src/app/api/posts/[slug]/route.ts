import { NextRequest, NextResponse } from 'next/server';
import { blogPosts } from '@/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  const item = blogPosts.find(p => p.slug === slug || p.slug === decoded || p.id === slug || p.id === decoded);

  if (!item) {
    return NextResponse.json({ success: false, message: 'مقاله یافت نشد' }, { status: 404 });
  }

  const data = {
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
  };

  return NextResponse.json({ success: true, data });
}
