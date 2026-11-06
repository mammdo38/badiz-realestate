import type { Metadata } from "next";
import Link from 'next/link';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { Share2, MapPin, ShieldCheck, UserCircle, Star, MessageCircle, PhoneCall, BedDouble, Maximize, Bath, CalendarDays, CheckCircle2, XCircle, ChevronRight, LandPlot, Ruler } from 'lucide-react';
import BreadcrumbBar from '@/components/BreadcrumbBar';
import ContactForm from '@/components/ContactForm';
import ContactButtons from '@/components/ContactButtons';
import ListingCard from '@/components/ListingCard';
import ListingGallery from '@/components/ListingGallery';
import RentConverter from '@/components/RentConverter';
import ShareButton from '@/components/ShareButton';
import PrintButton from '@/components/PrintButton';
import { listings } from '@/data';
import { translateDealType, translatePropertyType, getImageUrl, getAbsoluteImageUrl, cn, getDynamicRegions } from '@/utils';

export async function generateStaticParams() {
  const byId = listings.map((l) => ({ id: l.id.toString() }));
  const bySlug = listings.filter(l => l.slug && l.slug !== l.id.toString()).map((l) => ({ id: l.slug }));
  return [...byId, ...bySlug];
}

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const regions = await getDynamicRegions();

  let listing: any = null;
  try {
    const decodedId = decodeURIComponent(id);
    let res = await fetch(`http://localhost:5000/api/listings/by-slug/${encodeURIComponent(decodedId)}`, { next: { revalidate: 60 } });
    if (res.ok) {
      let data = await res.json();
      if (data.redirect) {
        // Fetch target listing for metadata preview instead of throwing redirect error
        const targetRes = await fetch(`http://localhost:5000/api/listings/by-slug/${encodeURIComponent(data.redirect)}`, { next: { revalidate: 60 } });
        if (targetRes.ok) {
          data = await targetRes.json();
        }
      }
      
      if (data.success && data.data) {
        const item = data.data;
        const primaryImg = item.images?.find((img: any) => img.is_primary)?.filename || item.images?.[0]?.filename || item.default_image || item.primary_image || '';
        listing = {
          id: item.id.toString(),
          slug: item.slug,
          title: item.title,
          dealType: item.deal_type,
          propertyType: item.property_type,
          region: item.region_slug || 'kordan-markazi',
          price: item.price ? new Intl.NumberFormat('fa-IR').format(item.price) : 'توافقی',
          priceUnit: item.price_label || 'تومان',
          bedrooms: item.bedrooms || 0,
          sizeBuilt: item.size_built || 0,
          sizeLand: item.size_land || 0,
          primaryImage: primaryImg,
          shortDesc: item.short_desc || '',
          metaTitle: item.meta_title,
          metaDescription: item.meta_description,
        };
      }
    }
  } catch (e) {
    console.error("Error fetching listing for metadata", e);
  }

  if (!listing) {
    listing = listings.find(l => l.id === id || l.slug === id);
  }

  if (!listing) return { title: 'ملک یافت نشد' };

  const region = regions[listing.region];
  const regionName = region ? region.name : 'کردان';
  const propertyType = translatePropertyType(listing.propertyType);
  const keyFeature = listing.propertyType === 'land' ? `${listing.sizeLand || ''} متر` : `${listing.bedrooms || 0} خوابه`;
  const defaultTitle = `${propertyType} ${keyFeature} در ${regionName} | ${listing.price}`;
  const defaultDesc = `خرید ${propertyType} در ${regionName} با امکانات کامل. یک سرمایه‌گذاری عالی با قیمت ${listing.price}. برای مشاوره رایگان با بادیز املاک تماس بگیرید.`;

  const title = (listing.metaTitle || defaultTitle).substring(0, 70);
  const description = (listing.metaDescription || listing.shortDesc || defaultDesc).substring(0, 160);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/listing/${encodeURIComponent(id)}`;

  const ogImage = listing.primaryImage 
    ? `https://badizvilla.ir/api/og-image/${listing.primaryImage}`
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

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const regions = await getDynamicRegions();
  
  let redirectUrl = null;
  let listing = null;
  try {
    const decodedId = decodeURIComponent(id);
    const res = await fetch(`http://localhost:5000/api/listings/by-slug/${encodeURIComponent(decodedId)}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.redirect) {
        redirectUrl = data.redirect;
      } else if (data.success) {
        const item = data.data;
        listing = {
          id: item.id.toString(),
          slug: item.slug,
          title: item.title,
          dealType: item.deal_type,
          propertyType: item.property_type,
          region: item.region_slug || 'kordan-markazi',
          price: item.deal_type === 'daily_rent' 
            ? (item.price_per_night ? new Intl.NumberFormat('fa-IR').format(item.price_per_night) : 'توافقی')
            : (item.price ? new Intl.NumberFormat('fa-IR').format(item.price) : 'توافقی'),
          priceRaw: item.deal_type === 'daily_rent' ? item.price_per_night : item.price,
          priceUnit: item.deal_type === 'daily_rent' ? 'تومان / هر شب' : (item.price_label || 'تومان'),
          bedrooms: item.bedrooms || 0,
          sizeBuilt: item.size_built || 0,
          sizeLand: item.size_land || 0,
          bathrooms: item.bathrooms || 0,
          parking: item.has_parking,
          imageEmoji: '🏡',
          bgGradient: 'from-gray-100 to-gray-200',
          status: item.status,
          primaryImage: item.images?.find((img: any) => img.is_primary)?.filename || item.images?.[0]?.filename || '',
          images: item.images?.map((img: any) => img.filename) || [],
          description: item.description || item.short_desc || '',
          deposit_price: item.deposit_price,
          monthly_rent: item.monthly_rent,
          depositPrice: item.deposit_price,
          monthlyRent: item.monthly_rent,
          features: [
            item.deal_type !== 'daily_rent' && item.has_water && 'آب',
            item.deal_type !== 'daily_rent' && item.has_electricity && 'برق',
            item.deal_type !== 'daily_rent' && item.has_gas && 'گاز شهری',
            item.deal_type !== 'daily_rent' && item.three_phase_power && 'برق سه فاز',
            item.deal_type !== 'daily_rent' && item.has_master_deed && 'سند تک‌برگ',
            item.has_pool && 'استخر',
            item.has_garden && 'باغچه',
            item.has_parking && 'پارکینگ اختصاصی',
            item.has_elevator && 'آسانسور',
            item.has_storage && 'انباری',
            item.has_security && 'نگهبانی',
            item.has_cctv && 'دوربین مداربسته',
            item.has_gazebo && 'آلاچیق',
            item.has_bbq && 'باربیکیو',
            item.has_antenna && 'آنتن‌دهی مناسب',
            item.truck_access && 'دسترسی تریلی'
          ].filter(Boolean),
          agentName: item.agent_name || 'املاک بادیز',
          agentPhone: item.agent_phone || '',
          agent_photo: item.agent_photo || '',
          agent_name: item.agent_name || '',
          agent_bio: item.agent_bio || '',
          contact_name: item.contact_name || '',
          contact_phone: item.contact_phone || '',
          contact_phone_2: item.contact_phone_2 || '',
          contact_phone_3: item.contact_phone_3 || '',
          views: item.views || 0,
          documentType: item.document_type || (item.has_master_deed ? 'سند تک‌برگ' : 'سند اصلاحات ارضی / مادر'),
          propertyDirection: item.property_direction || 'جنوبی',
          inBaft: item.in_baft !== undefined ? item.in_baft : true,
        };
      }
    }
  } catch (e) {
    console.error("Error fetching listing:", e);
  }

  // Fallback to static data if backend fails or listing not found (e.g. for old static slugs)
  if (!listing) {
    listing = listings.find(l => l.slug === id || l.id === id);
  }
  
  if (redirectUrl) {
    permanentRedirect(`/listing/${encodeURIComponent(redirectUrl)}`);
  }

  if (!listing) {
    notFound();
  }

  const region = regions[listing.region];

  const breadcrumbs = [
    { label: 'آگهی‌ها', href: '/search-results' },
    { label: region?.name || 'مناطق', href: region ? `/${region.slug}` : '#' },
    { label: listing.title }
  ];

  let relatedListings: any[] = [];
  try {
    const relRes = await fetch(`http://localhost:5000/api/listings?limit=8`, { next: { revalidate: 60 } });
    if (relRes.ok) {
      const relData = await relRes.json();
      if (relData.success && relData.data) {
        relatedListings = relData.data
          .filter((item: any) => item.id.toString() !== listing.id.toString())
          .map((item: any) => ({
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
            depositPrice: item.deposit_price,
            monthlyRent: item.monthly_rent,
            bedrooms: item.bedrooms || 0,
            sizeBuilt: item.size_built || 0,
            primaryImage: item.default_image || item.primary_image || item.images?.[0]?.filename,
            agentName: item.agent_name,
          }));
      }
    }
  } catch (e) {
    console.error("Error fetching related listings:", e);
  }

  if (relatedListings.length === 0) {
    relatedListings = listings.filter(l => l.id !== listing.id && (l.region === listing.region || l.propertyType === listing.propertyType)).slice(0, 6);
  }

  const utilityFeatures = ['آب', 'برق', 'گاز شهری', 'برق سه فاز'];
  const amenityFeatures = ['سند تک‌برگ', 'استخر', 'باغچه', 'پارکینگ اختصاصی', 'آسانسور', 'انباری', 'نگهبانی', 'دوربین مداربسته', 'آلاچیق', 'باربیکیو', 'دسترسی تریلی'];

  // Schema.org structured data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": listing.title,
    "description": `ویلا و ملک استثنایی در ${region?.name || ''} مناسب برای ${translateDealType(listing.dealType)}`,
    "datePosted": "2024-05-01",
    "image": listing.primaryImage ? [getImageUrl(listing.primaryImage)] : [],
    "offers": {
      "@type": "Offer",
      "price": listing.priceRaw ? String(listing.priceRaw) + '0' : '0',
      "priceCurrency": "IRR",
      "availability": "https://schema.org/InStock"
    },
    "about": {
      "@type": "SingleFamilyResidence",
      "name": listing.title,
      "numberOfRooms": listing.bedrooms || 0,
      "numberOfBedrooms": listing.bedrooms || 0,
      "numberOfBathroomsTotal": listing.bathrooms || 0,
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": listing.sizeBuilt || 0,
        "unitCode": "MTK"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": region?.name || '',
        "addressRegion": "البرز",
        "addressCountry": "IR"
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
        "name": "آگهی‌ها",
        "item": "https://badizvilla.ir/search-results"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": region?.name || 'مناطق',
        "item": `https://badizvilla.ir/${region?.slug || ''}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": listing.title
      }
    ]
  };

  return (
    <div className="bg-[var(--color-bg)] pb-24">
      {/* JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <BreadcrumbBar items={breadcrumbs} />
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content (70%) */}
          <div className="w-full lg:w-[68%] space-y-8">
            
            {/* Gallery */}
            <ListingGallery
              images={listing.images ? listing.images.map((img: any) => img.filename || img) : (listing.primaryImage ? [listing.primaryImage] : [])}
              title={listing.title}
              dealTypeLabel={translateDealType(listing.dealType)}
              imageEmoji={listing.imageEmoji}
              bgGradient={listing.bgGradient}
            />

            {/* Header & Price Bar */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.02)]">
              <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-[var(--color-gray-mid)]">
                <MapPin size={16} className="text-[var(--color-orange)]" />
                <span>{region?.name || ''}</span>
                <span className="mx-2 text-slate-200">|</span>
                <span>{translatePropertyType(listing.propertyType)}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-[800] text-[var(--color-dark)] mb-6 leading-tight">
                {listing.title}
              </h1>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100/80">
                {listing.dealType === 'annual_rent' ? (
                  (() => {
                    const depositNum = listing.deposit_price !== null && listing.deposit_price !== undefined ? Number(String(listing.deposit_price).replace(/\D/g, '')) : null;
                    const rentNum = listing.monthly_rent !== null && listing.monthly_rent !== undefined ? Number(String(listing.monthly_rent).replace(/\D/g, '')) : null;
                    const formattedDeposit = depositNum ? depositNum.toLocaleString('fa-IR') : (listing.price || 'توافقی');
                    const formattedRent = rentNum ? rentNum.toLocaleString('fa-IR') : null;
                    const hasRent = rentNum && rentNum > 0;

                    return (
                      <div className="flex flex-wrap items-center gap-6">
                        <div>
                          <p className="text-[var(--color-gray-mid)] text-xs font-medium mb-1">مبلغ ودیعه (پول پیش)</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl md:text-3xl font-black text-slate-900">{formattedDeposit}</span>
                            <span className="text-[var(--color-gray)] font-semibold text-xs">تومان</span>
                          </div>
                        </div>
                        <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                        <div>
                          <p className="text-[var(--color-gray-mid)] text-xs font-medium mb-1">اجاره ماهانه</p>
                          <div className="flex items-baseline gap-1.5">
                            {hasRent ? (
                              <>
                                <span className="text-2xl md:text-3xl font-black text-[var(--color-orange)]">{formattedRent}</span>
                                <span className="text-[var(--color-gray)] font-semibold text-xs">تومان / ماه</span>
                              </>
                            ) : (
                              <span className="text-base font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-lg border border-emerald-200">رهن کامل</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div>
                    <p className="text-[var(--color-gray-mid)] text-sm mb-1">{listing.dealType === 'daily_rent' ? 'قیمت هر شب' : 'قیمت کل'}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[var(--color-orange)]">{listing.price}</span>
                      <span className="text-[var(--color-gray)] font-semibold text-sm">{listing.priceUnit}</span>
                    </div>
                  </div>
                )}
                {listing.dealType === 'sell' && (
                  <div className="md:text-left">
                    <p className="text-[var(--color-gray-mid)] text-sm mb-1">قیمت هر متر مربع</p>
                    <p className="text-lg font-bold text-[var(--color-dark)]">
                      {(listing.sizeLand || listing.sizeBuilt) && listing.priceRaw ? Math.round((listing.priceRaw / 1000000) / (listing.sizeLand || listing.sizeBuilt)).toLocaleString('fa-IR') : '--'} <span className="text-sm font-normal">میلیون تومان</span>
                    </p>
                  </div>
                )}
                <div className="shrink-0 md:text-left">
                  {listing.dealType === 'daily_rent' ? (
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">اجاره روزانه</span>
                  ) : listing.dealType === 'annual_rent' ? (
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100">اجاره سالیانه</span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">قیمت کارشناسی شده</span>
                  )}
                </div>
              </div>

              {/* Rent Conversion Slider (Like Divar) */}
              {listing.dealType === 'annual_rent' && (
                <RentConverter
                  baseDeposit={Number(String(listing.deposit_price || listing.priceRaw || 0).replace(/\D/g, ''))}
                  baseRent={Number(String(listing.monthly_rent || 0).replace(/\D/g, ''))}
                />
              )}
            </div>

            {/* Stats Cards - Cohesive Container */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.02)] p-6 grid grid-cols-2 md:grid-cols-4 gap-6 relative overflow-hidden">
              <div className="flex flex-col items-center justify-center text-center p-2">
                <div className="w-12 h-12 rounded-xl bg-orange-50/70 flex items-center justify-center mb-3">
                  <LandPlot className="text-[var(--color-orange)]" size={22} strokeWidth={1.5} />
                </div>
                <span className="text-xs text-[var(--color-gray-mid)] mb-1">متراژ زمین</span>
                <span className="font-bold text-[var(--color-dark)] text-sm md:text-base">{listing.sizeLand ? `${listing.sizeLand} متر` : '--'}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-orange-50/70 flex items-center justify-center mb-3">
                  <Ruler className="text-[var(--color-orange)]" size={22} strokeWidth={1.5} />
                </div>
                <span className="text-xs text-[var(--color-gray-mid)] mb-1">متراژ بنا</span>
                <span className="font-bold text-[var(--color-dark)] text-sm md:text-base">{listing.sizeBuilt ? `${listing.sizeBuilt} متر` : '--'}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-orange-50/70 flex items-center justify-center mb-3">
                  <BedDouble className="text-[var(--color-orange)]" size={22} strokeWidth={1.5} />
                </div>
                <span className="text-xs text-[var(--color-gray-mid)] mb-1">تعداد خواب</span>
                <span className="font-bold text-[var(--color-dark)] text-sm md:text-base">{listing.bedrooms > 0 ? `${listing.bedrooms} خوابه` : 'بدون اتاق'}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 border-r border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-orange-50/70 flex items-center justify-center mb-3">
                  <CalendarDays className="text-[var(--color-orange)]" size={22} strokeWidth={1.5} />
                </div>
                <span className="text-xs text-[var(--color-gray-mid)] mb-1">سال ساخت</span>
                <span className="font-bold text-[var(--color-dark)] text-sm md:text-base">--</span>
              </div>
            </div>

            {/* Action Bar & Mobile Contact */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-[var(--color-border)]">
              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <ShareButton listingId={listing.id} />
              </div>

              {/* Mobile Contact Buttons (Visible only on lg:hidden) */}
              <div className="flex flex-col gap-4 w-full lg:hidden">
                 {(() => {
                   const phones = ((listing.agentPhone) ? [listing.agentPhone] : [
                     listing.contact_phone,
                     listing.contact_phone_2,
                     listing.contact_phone_3
                   ].filter(Boolean));
                   
                   if (phones.length === 0) return null;
                   
                   return phones.map((phone, idx) => (
                     <ContactButtons 
                       key={idx} 
                       phone={phone as string} 
                       title={listing.title} 
                       label={listing.agentPhone ? 'تماس تلفنی' : `تماس ${idx + 1}`} 
                       buttonSize="md" 
                     />
                   ));
                 })()}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.02)]">
              <h2 className="text-xl font-bold text-[var(--color-dark)] mb-4">توضیحات ملک</h2>
              <div className="prose max-w-none text-[var(--color-gray)] text-[0.95rem] leading-[2]">
                {listing.description ? (
                  <div dangerouslySetInnerHTML={{ __html: listing.description.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p className="italic text-gray-400">توضیحاتی برای این آگهی ثبت نشده است.</p>
                )}
              </div>
            </div>

            {/* Features Base */}
            {(() => {
              const activeUtilities = utilityFeatures.filter(feat => listing.features.includes(feat));
              const activeAmenities = amenityFeatures.filter(feat => listing.features.includes(feat));
              
              if (activeUtilities.length === 0 && activeAmenities.length === 0) return null;

              return (
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.02)]">
                  {activeUtilities.length > 0 && (
                    <>
                      <h2 className="text-xl font-bold text-[var(--color-dark)] mb-6">انشعابات و زیرساخت</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8">
                        {activeUtilities.map((feat, idx) => (
                          <div key={idx} className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0 md:last:border-b md:[&:nth-last-child(-n+2)]:border-0">
                            <span className="text-sm font-medium text-[var(--color-dark)]">{feat}</span>
                            <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={16} /></span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeAmenities.length > 0 && (
                    <>
                      <h2 className="text-xl font-bold text-[var(--color-dark)] mb-6 mt-8">امکانات رفاهی و امنیتی</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        {activeAmenities.map((feat, idx) => (
                          <div key={idx} className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0 md:last:border-b md:[&:nth-last-child(-n+2)]:border-0">
                            <span className="text-sm font-medium text-[var(--color-dark)]">{feat}</span>
                            <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={16} /></span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* E-E-A-T Transparency Section */}
                  {listing.dealType !== 'daily_rent' && (
                    <>
                      <h2 className="text-xl font-bold text-[var(--color-dark)] mb-6 mt-8">اطلاعات حقوقی و معماری (اعتمادساز)</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex items-center justify-between py-3.5 border-b border-slate-100 md:border-b-0">
                          <span className="text-sm font-medium text-[var(--color-gray)]">نوع سند</span>
                          <span className="text-sm font-bold text-[var(--color-dark)]">{(listing as any).documentType || 'سند تک‌برگ'}</span>
                        </div>
                        <div className="flex items-center justify-between py-3.5 border-b border-slate-100 md:border-b-0">
                          <span className="text-sm font-medium text-[var(--color-gray)]">جهت معماری ملک</span>
                          <span className="text-sm font-bold text-[var(--color-dark)]">{(listing as any).propertyDirection || 'شمالی'}</span>
                        </div>
                        <div className="flex items-center justify-between py-3.5 border-b border-slate-100 border-0">
                          <span className="text-sm font-medium text-[var(--color-gray)]">وضعیت بافت</span>
                          <span className="text-sm font-bold text-[var(--color-dark)]">{(listing as any).inBaft ? 'داخل بافت (دارای جواز)' : 'خارج بافت'}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* Similar Listings */}
            {relatedListings.length > 0 && (
              <div className="pt-6 w-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100/80 mb-1.5 inline-block">پیشنهاد بادیز</span>
                    <h2 className="text-xl md:text-2xl font-black text-[var(--color-dark)]">آگهی‌های مشابه و پیشنهادی</h2>
                  </div>
                  {region && (
                    <Link href={`/${region.slug}`} className="text-xs md:text-sm font-bold text-[var(--color-orange)] flex items-center gap-1 hover:underline">
                      مشاهده همه موارد <ChevronRight size={16} className="rotate-180" />
                    </Link>
                  )}
                </div>

                {/* Mobile horizontal scroll / Desktop & Tablet Grid */}
                <div className="flex overflow-x-auto gap-5 pb-6 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
                  {relatedListings.map(l => (
                    <div key={l.id} className="min-w-[280px] sm:min-w-[300px] md:min-w-0 shrink-0 md:shrink">
                      <ListingCard listing={l} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sticky Sidebar (32%) */}
          <div className="w-full lg:w-[32%] shrink-0 lg:sticky lg:top-[var(--header-height,100px)] space-y-6 self-start">
            
            {/* Contact Agent Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.02)]">
                <h3 className="text-base font-bold text-[var(--color-dark)] mb-4 pb-3 border-b border-slate-100">
                  درخواست بازدید این ملک
                </h3>
                
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                    {listing.agent_photo ? (
                      <img src={getImageUrl(listing.agent_photo)} alt={listing.agent_name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle size={32} className="text-[var(--color-gray-light)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[var(--color-dark)] text-md flex items-center gap-1">
                      {listing.agent_name || listing.contact_name || 'بادیز املاک'}
                      {!listing.agent_name && <CheckCircle2 size={14} className="text-blue-500 fill-blue-50" />}
                    </h4>
                    <p className="text-[10px] text-[var(--color-gray-mid)] mt-0.5">{listing.agent_name ? 'مشاور اختصاصی' : 'آژانس املاک معتبر'}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {((listing.agentPhone) ? [listing.agentPhone] : [
                    listing.contact_phone,
                    listing.contact_phone_2,
                    listing.contact_phone_3
                  ].filter(Boolean)).length > 0 ? (
                    ((listing.agentPhone) ? [listing.agentPhone] : [
                      listing.contact_phone,
                      listing.contact_phone_2,
                      listing.contact_phone_3
                    ].filter(Boolean)).map((phone: string, idx: number) => (
                      <ContactButtons key={idx} phone={phone} title={listing.title} label={listing.agentPhone ? 'تماس تلفنی' : `تماس ${idx + 1}`} buttonSize="lg" />
                    ))
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-500 font-bold py-3.5 rounded-xl flex items-center justify-center">
                      شماره تماس ثبت نشده
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-5 border-t border-[var(--color-border)] grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center text-center">
                    <ShieldCheck size={22} className="text-[var(--color-primary)] mb-1.5" strokeWidth={1.5} />
                    <span className="text-[0.65rem] text-[var(--color-gray-mid)]">آگهی تأیید شده</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Star size={22} className="text-[var(--color-primary)] mb-1.5" strokeWidth={1.5} />
                    <span className="text-[0.65rem] text-[var(--color-gray-mid)]">پاسخ زیر ۲ ساعت</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <CheckCircle2 size={22} className="text-[var(--color-primary)] mb-1.5" strokeWidth={1.5} />
                    <span className="text-[0.65rem] text-[var(--color-gray-mid)]">اطلاعات محفوظ</span>
                  </div>
                </div>
            </div>

            {/* Sidebar Recommended Properties */}
            {relatedListings.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_8px_30px_rgb(15,23,42,0.02)] hidden lg:block">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-orange)] inline-block animate-pulse" />
                    ویلاهای پیشنهادی هم‌رده
                  </h3>
                  {region && (
                    <Link href={`/${region.slug}`} className="text-xs text-[var(--color-orange)] font-bold hover:underline">
                      مشاهده همه
                    </Link>
                  )}
                </div>
                <div className="space-y-3">
                  {relatedListings.slice(0, 3).map(rel => (
                    <Link key={rel.id} href={`/listing/${rel.slug}`} className="group flex gap-3 items-center p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                        {rel.primaryImage ? (
                          <img src={getImageUrl(rel.primaryImage)} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-[10px]">🏡</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[var(--color-orange)] transition-colors">
                          {rel.title}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                          <span>{translatePropertyType(rel.propertyType)}</span>
                          <span>•</span>
                          <span>{rel.sizeBuilt ? `${rel.sizeBuilt} متر` : `${rel.bedrooms} خواب`}</span>
                        </div>
                        <p className="text-xs font-extrabold text-[var(--color-orange)] mt-1">
                          {rel.price} <span className="text-[10px] font-normal text-slate-500">{rel.priceUnit}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
