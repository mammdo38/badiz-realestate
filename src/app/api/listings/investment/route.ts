import { NextResponse } from 'next/server';
import { listings } from '@/data';

export async function GET() {
  const investment = listings.filter(l => l.is_investment);
  const data = (investment.length > 0 ? investment : listings.slice(0, 4)).map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    deal_type: item.dealType,
    property_type: item.propertyType,
    region_slug: item.region,
    price: item.priceRaw,
    price_label: item.priceUnit,
    bedrooms: item.bedrooms,
    size_built: item.sizeBuilt,
    size_land: item.sizeLand,
    bathrooms: item.bathrooms,
    has_parking: item.parking,
    default_image: item.primaryImage,
    primary_image: item.primaryImage,
    agent_name: item.agentName,
    deposit_price: item.deposit_price,
    monthly_rent: item.monthly_rent,
    status: item.status,
  }));

  return NextResponse.json({ success: true, data });
}
