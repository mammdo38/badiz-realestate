import { NextResponse } from 'next/server';
import { regions } from '@/data';

export async function GET() {
  const data = Object.values(regions).map(r => ({
    slug: r.slug,
    name_fa: r.name,
    emoji: r.emoji,
    description: r.description,
    active_listing_count: r.listingsCount,
    page_title: r.page_title || ''
  }));

  return NextResponse.json({ success: true, data });
}
