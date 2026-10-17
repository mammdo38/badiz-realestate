import { NextRequest, NextResponse } from 'next/server';
import { listings } from '@/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  const item = listings.find(l => l.slug === slug || l.slug === decoded || l.id === slug || l.id === decoded);

  if (!item) {
    return NextResponse.json({ success: false, message: 'ملک یافت نشد' }, { status: 404 });
  }

  const data = {
    id: item.id,
    slug: item.slug,
    title: item.title,
    deal_type: item.dealType,
    property_type: item.propertyType,
    region_slug: item.region,
    price: item.priceRaw,
    price_label: item.priceUnit,
    price_per_night: item.dealType === 'daily_rent' ? item.priceRaw : null,
    bedrooms: item.bedrooms,
    size_built: item.sizeBuilt,
    size_land: item.sizeLand,
    bathrooms: item.bathrooms,
    has_parking: item.parking,
    default_image: item.primaryImage,
    primary_image: item.primaryImage,
    agent_name: item.agentName,
    agent_phone: item.agentPhone,
    agent_photo: item.agentPhoto,
    contact_name: item.contact_name,
    contact_phone: item.contact_phone,
    short_desc: item.description?.substring(0, 160) || '',
    description: item.description,
    features: item.features,
    images: (item.images || []).map((fn, idx) => ({ filename: fn, is_primary: fn === item.primaryImage, sort_order: idx })),
    deposit_price: item.deposit_price,
    monthly_rent: item.monthly_rent,
    status: item.status,
    views: item.views,
    meta_title: item.metaTitle,
    meta_description: item.metaDescription,
    focus_keyword: item.focusKeyword
  };

  return NextResponse.json({ success: true, data });
}
