'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Navigation, Home, Search } from 'lucide-react';
import BreadcrumbBar from '@/components/BreadcrumbBar';
import ListingCard from '@/components/ListingCard';
import ContactForm from '@/components/ContactForm';
import { Listing, RegionInfo } from '@/types';
import { cn } from '@/utils';

interface Props {
  regionSlug: string;
  initialListings: Listing[];
  initialRegions: Record<string, RegionInfo>;
}

export default function RegionClient({ regionSlug, initialListings, initialRegions }: Props) {
  const [dealFilter, setDealFilter] = useState('all');
  
  const region = initialRegions[regionSlug];
  
  if (!region) return null;

  // Filter listings for this specific region
  const regionListings = initialListings.filter(l => l.region === regionSlug);
  
  // Apply deal type filter on top of region filter
  const filteredListings = dealFilter === 'all' 
    ? regionListings 
    : regionListings.filter(l => l.dealType === dealFilter);

  const breadcrumbs = [
    { label: 'مناطق کردان', href: '/#regions' },
    { label: region.name }
  ];

  // Other regions for the bottom link block
  const otherRegions = Object.values(initialRegions).filter(r => r.slug !== regionSlug);

  return (
    <div className="bg-[var(--color-bg)] pb-24">
      <BreadcrumbBar items={breadcrumbs} />

      {/* Hero Section */}
      <section className="bg-[var(--color-dark-2)] text-white py-16 px-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--color-orange)]/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[var(--color-green)]/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-4xl mb-6 backdrop-blur-md border border-white/20">
            {region.emoji}
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-6">{region.page_title || `آگهی‌های ${region.name}`}</h1>
          <p className="text-[var(--color-gray-light)] text-lg mb-10 max-w-2xl leading-relaxed">
            {region.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[140px] backdrop-blur-md">
              <p className="text-3xl font-bold mb-1 text-[var(--color-orange)]">{region.listingsCount}</p>
              <p className="text-xs text-[var(--color-gray-light)]">آگهی فعال منطقه</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[140px] backdrop-blur-md">
              <p className="text-xl font-bold mb-1 text-white">{region.avgPrice}</p>
              <p className="text-xs text-[var(--color-gray-light)]">میانگین قیمت</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[140px] backdrop-blur-md">
              <p className="text-xl font-bold mb-1 text-white">{region.popularProperty}</p>
              <p className="text-xs text-[var(--color-gray-light)]">محبوب‌ترین ملک</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-white border-b border-[var(--color-border)] sticky top-[var(--header-height,68px)] z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex overflow-x-auto hide-scrollbar gap-2">
          {[
            {id: 'all', label: `تمام فایل‌های ${region.name}`},
            {id: 'sell', label: 'خرید و فروش'},
            {id: 'annual_rent', label: 'رهن و اجاره'},
            {id: 'daily_rent', label: 'اجاره روزانه'}
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDealFilter(tab.id)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
                dealFilter === tab.id 
                  ? "bg-[var(--color-dark)] text-white shadow-md transform scale-[1.02]" 
                  : "bg-[var(--color-bg)] text-[var(--color-gray)] hover:bg-gray-200"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        {/* Listings Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-8 flex items-center gap-2">
            <Home className="text-[var(--color-orange)]" /> 
            لیست آگهی‌ها در {region.name}
          </h2>
          
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-[var(--color-border)] flex flex-col items-center">
              <Search className="text-[var(--color-gray-light)] w-16 h-16 mb-4" strokeWidth={1.5} />
              <p className="text-[var(--color-dark)] font-bold text-lg mb-2">موردی یافت نشد</p>
              <p className="text-[var(--color-gray)] text-sm mb-6">با این فیلتر ملک فعالی در {region.name} وجود ندارد.</p>
              <button onClick={() => setDealFilter('all')} className="text-[var(--color-orange)] font-bold text-sm">پاک کردن فیلترها</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Content Section & Other Regions Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-2/3 bg-white rounded-3xl p-8 md:p-10 border border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-dark)] mb-6 flex items-center gap-2">
               درباره {region.name}
            </h2>
            <div className="prose text-[var(--color-gray)] leading-8">
              <p className="text-lg mb-4">{region.description}</p>
              <p>این منطقه با توجه به زیرساخت‌های عالی و بافت جمعیتی مناسب، به عنوان یکی از امن‌ترین و بهترین گزینه‌ها برای سرمایه‌گذاری ملکی شناخته می‌شود. ارزش افزوده در این منطقه طی سال‌های گذشته همواره روندی صعودی داشته است که نشان‌دهنده ظرفیت بالای آن است.</p>
              <p>مشاورین دپارتمان املاک بادیز با شناخت وجب‌به‌وجب مناطق کردان، بهترین پلاک‌ها و ویلاها را متناسب با بودجه شما پیشنهاد خواهند داد.</p>
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h3 className="font-bold text-[var(--color-dark)] mb-2 flex items-center gap-2">
              <Navigation size={18} className="text-[var(--color-orange)]" /> مناطق دیگر را هم ببینید
            </h3>
            {otherRegions.map(r => (
              <Link key={r.slug} href={`/${r.slug}`} className="bg-white hover:bg-[var(--color-orange-pale)] flex items-center p-4 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-orange)] transition-all group">
                <div className="w-12 h-12 bg-[var(--color-bg)] rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:bg-white transition-colors">{r.emoji}</div>
                <div className="mr-4 flex-1">
                  <h4 className="font-bold text-[var(--color-dark)] flex items-center justify-between">
                    {r.name}
                    <ExternalLink size={16} className="text-[var(--color-gray-light)] group-hover:text-[var(--color-orange)] transition-colors" />
                  </h4>
                  <p className="text-xs text-[var(--color-gray)]">{r.listingsCount} آگهی فعال</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[var(--color-dark)] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute left-0 top-0 w-64 h-full bg-[linear-gradient(90deg,var(--color-orange),transparent)] opacity-20 pointer-events-none"></div>
           <div className="relative z-10 md:w-1/2">
             <h2 className="text-2xl md:text-3xl font-bold mb-4">آیا ملکی در {region.name} دارید؟</h2>
             <p className="text-[var(--color-gray-light)]">فایلینگ اختصاصی مجموعه بادیز، ملک شما را مستقیماً به خریداران واقعی معرفی می‌کند. برای کارشناسی رایگان با ما در ارتباط باشید.</p>
           </div>
           <div className="relative z-10 w-full md:w-1/3 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
             <h3 className="font-bold mb-4 text-center text-sm text-[var(--color-orange-light)]">شماره تماس خود را بگذارید</h3>
             <ContactForm inquiryType="consult" buttonText="سپردن ملک" className="text-right" />
           </div>
        </div>
      </div>
    </div>
  );
}
