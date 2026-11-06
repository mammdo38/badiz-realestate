import type { Metadata } from "next";
import { listings, blogPosts, defaultSettings, regions } from "@/data";
import HomeClient from "./HomeClient";
import { getDynamicRegions } from "@/utils";
import { BlogPost, Listing } from "@/types";

export const revalidate = 0; export const dynamic = "force-dynamic";

export default async function HomePage() {
  let fetchedListings: Listing[] = [...listings];
  let fetchedPosts: BlogPost[] = [...blogPosts];
  let investmentListings: Listing[] = [];
  let urgentListings: Listing[] = [];
  let settings: any = { ...defaultSettings };
  let totalListingsCount = listings.length;

  try {
    const [
      settingsRes,
      listingsRes,
      investmentRes,
      urgentRes,
      postsRes,
      dynamicRegions
    ] = await Promise.all([
      fetch('http://localhost:5000/api/settings', { next: { revalidate: 30 } }).catch(() => null),
      fetch('http://localhost:5000/api/listings?limit=12', { next: { revalidate: 30 } }).catch(() => null),
      fetch('http://localhost:5000/api/listings/investment', { next: { revalidate: 30 } }).catch(() => null),
      fetch('http://localhost:5000/api/listings/urgent', { next: { revalidate: 30 } }).catch(() => null),
      fetch('http://localhost:5000/api/posts?limit=5', { next: { revalidate: 30 } }).catch(() => null),
      getDynamicRegions().catch(() => ({})),
    ]);

    if (settingsRes && settingsRes.ok) {
      const data = await settingsRes.json();
      if (data.success) settings = data.data;
    }

    if (listingsRes && listingsRes.ok) {
      const data = await listingsRes.json();
      if (data.success && data.data) {
        totalListingsCount = data.pagination?.total || 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetchedListings = data.data.map((item: any) => ({
          id: item.id.toString(),
          slug: item.slug,
          title: item.title,
          dealType: item.deal_type,
          propertyType: item.property_type,
          region: item.region_slug || 'kordan-markazi',
          price: item.deal_type === 'daily_rent' 
            ? (item.price_per_night ? new Intl.NumberFormat('fa-IR').format(item.price_per_night) : 'توافقی')
            : (item.price ? new Intl.NumberFormat('fa-IR').format(item.price) : 'توافقی'),
          priceUnit: item.deal_type === 'daily_rent' ? 'تومان / هر شب' : (item.price_label || 'تومان'),
          bedrooms: item.bedrooms || 0,
          sizeBuilt: item.size_built || 0,
          sizeLand: item.size_land || 0,
          bathrooms: item.bathrooms || 0,
          parking: item.has_parking,
          imageEmoji: '🏡',
          bgGradient: 'from-gray-100 to-gray-200',
          status: item.status,
          deposit_price: item.deposit_price,
          monthly_rent: item.monthly_rent,
          primaryImage: item.default_image || item.primary_image,
          agentName: item.agent_name,
          agentPhoto: item.agent_photo,
          description: item.short_desc || '',
          features: [],
        }));
      }
    }

    if (investmentRes && investmentRes.ok) {
      const data = await investmentRes.json();
      if (data.success && data.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        investmentListings = data.data.map((item: any) => ({
          id: item.id.toString(),
          slug: item.slug,
          title: item.title,
          dealType: item.deal_type,
          propertyType: item.property_type,
          region: item.region_slug || 'kordan-markazi',
          price: item.deal_type === 'daily_rent' 
            ? (item.price_per_night ? new Intl.NumberFormat('fa-IR').format(item.price_per_night) : 'توافقی')
            : (item.price ? new Intl.NumberFormat('fa-IR').format(item.price) : 'توافقی'),
          priceUnit: item.deal_type === 'daily_rent' ? 'تومان / هر شب' : (item.price_label || 'تومان'),
          bedrooms: item.bedrooms || 0,
          sizeBuilt: item.size_built || 0,
          sizeLand: item.size_land || 0,
          bathrooms: item.bathrooms || 0,
          parking: item.has_parking,
          imageEmoji: '📈',
          bgGradient: 'from-green-100 to-green-200',
          status: item.status,
          deposit_price: item.deposit_price,
          monthly_rent: item.monthly_rent,
          primaryImage: item.default_image || item.primary_image,
          agentName: item.agent_name,
        }));
      }
    }

    if (urgentRes && urgentRes.ok) {
      const data = await urgentRes.json();
      if (data.success && data.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        urgentListings = data.data.map((item: any) => ({
          id: item.id.toString(),
          slug: item.slug,
          title: item.title,
          dealType: item.deal_type,
          propertyType: item.property_type,
          region: item.region_slug || 'kordan-markazi',
          price: item.deal_type === 'daily_rent' 
            ? (item.price_per_night ? new Intl.NumberFormat('fa-IR').format(item.price_per_night) : 'توافقی')
            : (item.price ? new Intl.NumberFormat('fa-IR').format(item.price) : 'توافقی'),
          priceUnit: item.deal_type === 'daily_rent' ? 'تومان / هر شب' : (item.price_label || 'تومان'),
          bedrooms: item.bedrooms || 0,
          sizeBuilt: item.size_built || 0,
          sizeLand: item.size_land || 0,
          bathrooms: item.bathrooms || 0,
          parking: item.has_parking,
          imageEmoji: '🔥',
          bgGradient: 'from-red-100 to-red-200',
          status: item.status,
          deposit_price: item.deposit_price,
          monthly_rent: item.monthly_rent,
          primaryImage: item.default_image || item.primary_image,
          agentName: item.agent_name,
        }));
      }
    }

    if (postsRes && postsRes.ok) {
      const data = await postsRes.json();
      if (data.success && data.data && data.data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetchedPosts = data.data.sort((a: any, b: any) => new Date(b.published_at || b.created_at || 0).getTime() - new Date(a.published_at || a.created_at || 0).getTime()).map((item: any): BlogPost => ({
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

    if (!fetchedListings || fetchedListings.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fetchedListings = listings as any;
      totalListingsCount = listings.length;
    }
    if (!investmentListings || investmentListings.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      investmentListings = (listings as any).filter((l: any) => l.is_investment);
      if (investmentListings.length === 0) investmentListings = listings.slice(0, 4) as any;
    }
    if (!urgentListings || urgentListings.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      urgentListings = (listings as any).filter((l: any) => l.is_urgent);
      if (urgentListings.length === 0) urgentListings = listings.slice(4, 8) as any;
    }
    if (!fetchedPosts || fetchedPosts.length === 0) {
      fetchedPosts = blogPosts;
    }
    if (!settings || Object.keys(settings).length === 0) {
      settings = defaultSettings;
    }

    const siteName = settings?.site_name || "بادیز";
    
    const realEstateSchema = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": `دپارتمان تخصصی املاک ${siteName}`,
      "image": "https://badizvilla.ir/og-image.jpg",
      "url": "https://badizvilla.ir",
      "telephone": settings?.site_phone ? `+98${settings.site_phone.replace(/^0/, '').replace(/\D/g, '')}` : "+989120000000",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "کردان",
        "addressRegion": "البرز",
        "addressCountry": "IR"
      },
      "description": "خرید و فروش ویلا، زمین و آپارتمان در کردان جنوبی، شمالی و مرکزی - دپارتمان تخصصی بادیز"
    };

    const websiteSchema = {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": `املاک ${siteName}`,
      "url": "https://badizvilla.ir",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://badizvilla.ir/search-results?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <HomeClient 
          initialListings={fetchedListings}
          investmentListings={investmentListings}
          urgentListings={urgentListings}
          initialRegions={dynamicRegions || regions}
          initialBlogPosts={fetchedPosts}
          settings={settings}
          totalListingsCount={totalListingsCount}
        />
      </>
    );
  } catch (e) {
    console.error("HomePage error:", e);
    return (
      <HomeClient 
        initialListings={listings as any}
        investmentListings={listings.filter((l: any) => l.is_investment) as any}
        urgentListings={listings.filter((l: any) => l.is_urgent) as any}
        initialRegions={regions}
        initialBlogPosts={blogPosts}
        settings={defaultSettings}
        totalListingsCount={listings.length}
      />
    );
  }
}
