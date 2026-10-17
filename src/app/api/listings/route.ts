import { NextRequest, NextResponse } from 'next/server';
import { listings } from '@/data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const deal = searchParams.get('deal');
  const type = searchParams.get('type');
  const region = searchParams.get('region');
  const search = searchParams.get('search')?.toLowerCase();
  const minPrice = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : null;
  const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : null;
  const minSize = searchParams.get('min_size') ? Number(searchParams.get('min_size')) : null;
  const bedrooms = searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : null;
  const hasPool = searchParams.get('has_pool') === 'true';
  const hasParking = searchParams.get('has_parking') === 'true';
  const sort = searchParams.get('sort') || 'newest';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 12));

  let filtered = [...listings];

  if (deal && deal !== 'all') {
    filtered = filtered.filter(item => item.dealType === deal);
  }

  if (type && type !== 'all') {
    filtered = filtered.filter(item => item.propertyType === type);
  }

  if (region && region !== 'all') {
    filtered = filtered.filter(item => item.region === region);
  }

  if (search) {
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(search) || 
      (item.description && item.description.toLowerCase().includes(search))
    );
  }

  if (minPrice !== null && !isNaN(minPrice)) {
    filtered = filtered.filter(item => (item.priceRaw || 0) >= minPrice);
  }

  if (maxPrice !== null && !isNaN(maxPrice)) {
    filtered = filtered.filter(item => (item.priceRaw || 0) <= maxPrice);
  }

  if (minSize !== null && !isNaN(minSize)) {
    filtered = filtered.filter(item => (item.sizeBuilt || item.sizeLand || 0) >= minSize);
  }

  if (bedrooms !== null && !isNaN(bedrooms)) {
    filtered = filtered.filter(item => item.bedrooms >= bedrooms);
  }

  if (hasPool) {
    filtered = filtered.filter(item => item.features.includes('استخر'));
  }

  if (hasParking) {
    filtered = filtered.filter(item => item.parking || item.features.includes('پارکینگ اختصاصی'));
  }

  // Sort
  if (sort === 'price_asc') {
    filtered.sort((a, b) => (a.priceRaw || 0) - (b.priceRaw || 0));
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => (b.priceRaw || 0) - (a.priceRaw || 0));
  } else {
    // Newest
    filtered.sort((a, b) => Number(b.id) - Number(a.id));
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  // Map to API response structure matching backend
  const data = paginated.map(item => ({
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
    short_desc: item.description?.substring(0, 160) || '',
    description: item.description,
    features: item.features,
    images: (item.images || []).map((fn, idx) => ({ filename: fn, is_primary: fn === item.primaryImage, sort_order: idx })),
    deposit_price: item.deposit_price,
    monthly_rent: item.monthly_rent,
    status: item.status,
    is_investment: item.is_investment,
    is_urgent: item.is_urgent
  }));

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  });
}
