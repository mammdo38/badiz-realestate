import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listings } from "@/data";
import RegionClient from "./RegionClient";
import { getDynamicRegions } from "@/utils";

export async function generateStaticParams() {
  const regions = await getDynamicRegions();
  return Object.keys(regions).map((regionSlug) => ({
    region: regionSlug,
  }));
}

export const revalidate = 3600;

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const regions = await getDynamicRegions();
  const region = regions[regionSlug];
  if (!region) {
    return {
      title: "منطقه یافت نشد",
    };
  }
  const title = region.page_title || `آگهی‌های املاک در ${region.name} | بادیز`;
  const description = `${region.description.substring(0, 160)} - خرید و فروش ویلا و زمین در ${region.name}`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/${regionSlug}`;

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
      type: "website",
      locale: "fa_IR",
    },
    twitter: {
      card: "summary",
    }
  };
}

export default async function RegionPage({ params }: Props) {
  const { region: regionSlug } = await params;
  
  const regions = await getDynamicRegions();
  const region = regions[regionSlug];

  if (!region) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": region.name,
    "description": region.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": region.name,
      "addressRegion": "البرز",
      "addressCountry": "IR"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "خانه",
        "item": "https://badizvilla.ir/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": region.name
      }
    ]
  };

  let regionListings: any[] = [];
  try {
    const res = await fetch(`http://localhost:5000/api/listings?region=${regionSlug}&limit=100`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        regionListings = data.data.map((item: any) => ({
          id: item.id.toString(),
          slug: item.slug,
          title: item.title,
          dealType: item.deal_type,
          propertyType: item.property_type,
          region: item.region_slug || regionSlug,
          price: item.deal_type === 'daily_rent' 
            ? (item.price_per_night ? new Intl.NumberFormat('fa-IR').format(item.price_per_night) : 'توافقی')
            : (item.price ? new Intl.NumberFormat('fa-IR').format(item.price) : 'توافقی'),
          priceUnit: item.deal_type === 'daily_rent' ? 'تومان / هر شب' : (item.price_label || 'تومان'),
          deposit_price: item.deposit_price,
          monthly_rent: item.monthly_rent,
          depositPrice: item.deposit_price,
          monthlyRent: item.monthly_rent,
          bedrooms: item.bedrooms || 0,
          sizeBuilt: item.size_built || 0,
          sizeLand: item.size_land || 0,
          bathrooms: item.bathrooms || 0,
          parking: item.has_parking,
          imageEmoji: '🏡',
          bgGradient: 'from-gray-100 to-gray-200',
          status: item.status,
          primaryImage: item.default_image || item.primary_image,
          agentName: item.agent_name,
          agentPhoto: item.agent_photo,
          description: item.short_desc || '',
          features: [],
        }));
      }
    }
  } catch (e) {
    console.error("Error fetching region listings", e);
  }

  if (regionListings.length === 0) {
    regionListings = listings.filter((l) => l.region === regionSlug);
  }

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
      <RegionClient 
        regionSlug={regionSlug} 
        initialListings={regionListings} 
        initialRegions={regions} 
      />
    </>
  );
}
