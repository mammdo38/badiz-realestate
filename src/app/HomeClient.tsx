'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShieldCheck, Map, Calculator, ArrowLeft, Phone, Home, Calendar, Award, Flame, TrendingUp, MapPin, Mountain, Building2, Trees, Newspaper } from 'lucide-react';
import { Listing, RegionInfo, BlogPost } from '@/types';
import ListingCard from '@/components/ListingCard';
import ContactForm from '@/components/ContactForm';
import { cn, getImageUrl } from '@/utils';

interface Props {
  initialListings: Listing[];
  investmentListings?: Listing[];
  urgentListings?: Listing[];
  initialRegions: Record<string, RegionInfo>;
  initialBlogPosts: BlogPost[];
  settings?: any;
  totalListingsCount?: number;
}

export default function HomeClient({ initialListings, investmentListings = [], urgentListings = [], initialRegions, initialBlogPosts, settings = {}, totalListingsCount = 0 }: Props) {
  const router = useRouter();
  const [dealFilter, setDealFilter] = useState('all');
  const [selectedDealType, setSelectedDealType] = useState('all');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [dealFilter]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    if (formData.get('deal') !== 'all') params.set('deal', formData.get('deal') as string);
    if (formData.get('type') !== 'all') params.set('type', formData.get('type') as string);
    if (formData.get('region') !== 'all') params.set('region', formData.get('region') as string);
    
    router.push(`/search-results?${params.toString()}`);
  };

  const filteredListings = dealFilter === 'all' 
    ? initialListings.slice(0, 12) 
    : initialListings.filter(l => l.dealType === dealFilter).slice(0, 12);

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative pt-[120px] pb-20 md:pt-[160px] md:pb-40 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
        <Image src={getImageUrl('hero-bg.jpg')} alt="خرید ویلا در کردان" fill priority className="object-cover object-center z-0" sizes="100vw" quality={70} />
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-orange)]/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-blue)]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50"></div>
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwIEg0MCBWNDAgSDAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] [mask-image:linear-gradient(to_bottom,white_20%,transparent_80%)] opacity-20 pointer-events-none"></div>

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.7)_0%,rgba(10,10,10,0.4)_50%,rgba(10,10,10,0.95)_100%)] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 w-full text-center flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white text-sm font-medium animate-[fade-in-up_0.8s_ease-out]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-orange)] shadow-[0_0_8px_var(--color-orange)] animate-pulse"></span>
            <MapPin size={14} className="text-[var(--color-orange)]" />
            کردان، البرز
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 md:mb-6 animate-[fade-in-up_1s_ease-out]">
            <span className="relative flex h-2 md:h-3 w-2 md:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-orange)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 md:h-3 w-2 md:w-3 bg-[var(--color-orange)]"></span>
            </span>
            <span className="text-white text-[10px] md:text-sm font-medium tracking-wide">
              {settings?.site_name ? `دپارتمان تخصصی ${settings.site_name}` : 'دپارتمان تخصصی بادیز'}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.2] mb-4 md:mb-6 drop-shadow-2xl animate-[fade-in-up_1s_ease-out_0.2s_both]">
            خرید و فروش ویلای رویایی در <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-orange-light)] to-[var(--color-orange)]">منطقه سرسبز کردان</span>
          </h1>
          <p className="text-[var(--color-gray-light)] text-lg md:text-xl font-medium mb-12 max-w-2xl leading-relaxed animate-[fade-in-up_1s_ease-out_0.2s_both]">
            گروه مشاورین املاک بادیز، مرجع تخصصی خرید، فروش و سرمایه‌گذاری ملکی در مناطق لوکس و ییلاقی کردان.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-4xl bg-white/10 p-2 rounded-2xl md:rounded-full backdrop-blur-xl border border-white/20 shadow-2xl animate-[fade-in-up_1s_ease-out_0.3s_both]">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center bg-black/40 backdrop-blur-md p-1.5 md:p-3 rounded-xl md:rounded-full w-full border border-white/10 shadow-inner">
              
              <div className="flex w-full md:w-2/3 border-b md:border-b-0 border-white/20 md:border-transparent">
                <div className="w-1/2 border-l border-white/20 px-2 md:px-4 py-1.5 md:py-2">
                  <label htmlFor="deal" className="block text-[10px] md:text-xs font-bold text-[var(--color-orange-light)] mb-0.5 md:mb-1 uppercase tracking-wider">نوع معامله</label>
                  <select 
                    id="deal" 
                    name="deal" 
                    className="w-full bg-transparent text-white text-xs md:text-sm font-semibold focus:outline-none cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white" 
                    aria-label="نوع معامله"
                    value={selectedDealType}
                    onChange={(e) => setSelectedDealType(e.target.value)}
                  >
                    <option value="all">همه موارد</option>
                    <option value="sell">خرید و فروش</option>
                    <option value="annual_rent">اجاره سالیانه</option>
                    <option value="daily_rent">اجاره روزانه</option>
                    <option value="commercial_rent">اجاره تجاری</option>
                  </select>
                </div>

                <div className="w-1/2 md:border-l border-white/20 px-2 md:px-4 py-1.5 md:py-2">
                  <label htmlFor="type" className="block text-[10px] md:text-xs font-bold text-[var(--color-orange-light)] mb-0.5 md:mb-1 uppercase tracking-wider">نوع ملک</label>
                  <select id="type" name="type" className="w-full bg-transparent text-white text-xs md:text-sm font-semibold focus:outline-none cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white" aria-label="نوع ملک">
                    <option value="all">همه انواع ملک</option>
                    <option value="villa">ویلا</option>
                    <option value="garden">باغ</option>
                    {selectedDealType !== 'daily_rent' && <option value="land">زمین</option>}
                    <option value="apartment">آپارتمان</option>
                  </select>
                </div>
              </div>

              <div className="w-full md:w-1/3 px-3 md:px-4 py-1.5 md:py-2 mb-2 md:mb-0">
                <label htmlFor="region" className="block text-[10px] md:text-xs font-bold text-[var(--color-orange-light)] mb-0.5 md:mb-1 uppercase tracking-wider">منطقه</label>
                <select id="region" name="region" className="w-full bg-transparent text-white text-xs md:text-sm font-semibold focus:outline-none cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white" aria-label="منطقه">
                  <option value="all">تمام مناطق</option>
                  {Object.values(initialRegions).map(r => (
                    <option key={r.slug} value={r.slug}>{r.name}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="w-full md:w-auto md:min-w-[140px] bg-[var(--color-orange)] hover:bg-[var(--color-orange-light)] text-white h-[44px] md:h-[52px] rounded-lg md:rounded-full font-bold transition-all flex items-center justify-center gap-2 px-6 shrink-0 shadow-lg hover:shadow-[0_0_25px_rgba(232,97,26,0.6)]">
                <Search size={18} />
                جستجو
              </button>
            </form>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-center gap-2 md:gap-8 mt-8 md:mt-16 w-full max-w-3xl animate-[fade-in-up_1s_ease-out_0.5s_both]">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 flex flex-col items-center justify-center shadow-xl w-36 md:w-44">
              <Home className="text-[var(--color-orange)] mb-1 md:mb-2 w-5 h-5 md:w-6 md:h-6" />
              <p className="text-sm sm:text-base md:text-2xl font-black text-white mb-0.5 md:mb-1">{totalListingsCount > 0 ? totalListingsCount : 'به‌زودی'}</p>
              <p className="text-[0.55rem] md:text-xs font-medium text-[var(--color-gray-light)] uppercase tracking-wider">{totalListingsCount > 0 ? 'آگهی فعال' : 'آگهی‌های جدید'}</p>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-4 flex flex-col items-center justify-center shadow-xl w-36 md:w-44">
              <Calendar className="text-[var(--color-orange)] mb-1 md:mb-2 w-5 h-5 md:w-6 md:h-6" />
              <p className="text-sm sm:text-base md:text-2xl font-black text-white mb-0.5 md:mb-1">۱۱</p>
              <p className="text-[0.55rem] md:text-xs font-medium text-[var(--color-gray-light)] uppercase tracking-wider">سال سابقه</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LISTINGS PREVIEW */}
      <section id="listings" className="py-24 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal">
            <div>
              <p className="text-[var(--color-orange)] font-bold text-xs uppercase tracking-wider mb-2">جدیدترین فرصت‌ها</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-dark)]">ملک‌های منتخب بادیز</h2>
            </div>
            {/* Filter Tabs */}
            <div className="flex overflow-x-auto pb-2 -mx-4 px-4 md:px-0 md:mx-0 md:pb-0 hide-scrollbar gap-2">
              {[
                {id: 'all', label: 'همه'},
                {id: 'sell', label: 'خرید و فروش'},
                {id: 'annual_rent', label: 'اجاره سالیانه'},
                {id: 'daily_rent', label: 'اجاره روزانه'}
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDealFilter(tab.id)}
                  aria-pressed={dealFilter === tab.id}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-300 cursor-pointer",
                    dealFilter === tab.id 
                      ? "bg-[var(--color-dark)] text-white shadow-md" 
                      : "bg-[var(--color-bg)] text-[var(--color-gray)] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-orange)]"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredListings.length === 0 ? (
            <div className="col-span-full py-16 px-6 bg-white rounded-3xl border border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-orange-50 text-[var(--color-orange)] rounded-2xl flex items-center justify-center mb-4">
                <Home size={32} />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-dark)] mb-2">به‌زودی آگهی‌های جدید ثبت می‌شوند</h3>
              <p className="text-sm text-[var(--color-gray-mid)] max-w-md mb-6 leading-relaxed">
                در حال حاضر آگهی با این مشخصات در دیتابیس ثبت نشده است. اگر قصد فروش یا اجاره ملک خود در کردان را دارید، همین حالا ملک خود را ثبت کنید.
              </p>
              <a href="#entrust" className="inline-flex items-center gap-2 bg-[var(--color-orange)] text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-[var(--color-orange-light)] transition">
                سپردن ملک در کردان
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredListings.map(listing => (
                <div key={listing.id}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12 md:mt-16 reveal opacity-0 translate-y-8 transition-all duration-700">
            <Link href="/search-results" className="inline-flex items-center gap-2 bg-white text-[var(--color-dark)] hover:text-[var(--color-orange)] border-2 border-[var(--color-dark)] hover:border-[var(--color-orange)] px-6 md:px-8 py-3 md:py-4 rounded-full font-bold transition-all shadow-sm hover:shadow-md">
              مشاهده تمامی آگهی‌ها
              <ArrowLeft size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3.1 URGENT SALES SECTION */}
      {urgentListings.length > 0 && (
        <section className="py-20 md:py-32 bg-gradient-to-b from-red-50 to-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-[80px] pointer-events-none opacity-60"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6 reveal opacity-0 translate-y-8 transition-all duration-700">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-4">
                  <Flame size={16} className="animate-pulse" /> شکار بازار
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-[var(--color-dark)] mb-4 leading-tight">
                  فروش <span className="text-transparent bg-clip-text bg-gradient-to-l from-red-500 to-orange-500">فوری</span> و زیر قیمت
                </h2>
                <p className="text-[var(--color-gray)] text-lg">
                  املاکی که به دلیل نیاز مالی مالک یا شرایط ویژه، بسیار پایین‌تر از قیمت واقعی منطقه برای مدت محدود عرضه شده‌اند.
                </p>
              </div>
              <Link href="/search-results?urgent=true" className="shrink-0 flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all">
                همه موارد فوری <ArrowLeft size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {urgentListings.slice(0, 4).map((listing) => (
                <div key={listing.id}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3.2 INVESTMENT OPPORTUNITIES SECTION */}
      {investmentListings.length > 0 && (
        <section id="investment" className="py-20 md:py-32 bg-[var(--color-dark)] text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-900/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6 reveal opacity-0 translate-y-8 transition-all duration-700">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-bold mb-4">
                  <TrendingUp size={16} /> فرصت طلایی
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                  بهترین گزینه‌های <span className="text-transparent bg-clip-text bg-gradient-to-l from-green-400 to-emerald-200">سرمایه‌گذاری</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  املاکی که در مناطق رو به رشد کردان واقع شده‌اند و پتانسیل بالایی برای افزایش قیمت در کوتاه‌مدت و میان‌مدت دارند.
                </p>
              </div>
              <Link href="/search-results?investment=true" className="shrink-0 flex items-center gap-2 text-green-400 font-bold hover:gap-3 transition-all">
                مشاهده همه <ArrowLeft size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {investmentListings.slice(0, 4).map((listing) => (
                <div key={listing.id}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. REGIONS SECTION */}
      <section id="regions" className="py-24 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 reveal">
            <p className="text-[var(--color-orange)] font-bold text-xs uppercase tracking-wider mb-2">دسته‌بندی جغرافیا</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-dark)]">منطقه مورد نظر را انتخاب کنید</h2>
          </div>

          <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 pb-12 pt-4 hide-scrollbar snap-x -mx-4 px-4 md:mx-0 md:px-0">
            {Object.values(initialRegions).map((region, i) => (
              <Link 
                key={region.slug}
                href={`/${region.slug}`}
                className="group reveal min-w-[280px] sm:min-w-[320px] lg:min-w-0 w-full flex-shrink-0 snap-center bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center border border-black/5"
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <div className="w-24 h-24 bg-[var(--color-bg)] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--color-orange-pale)] transition-all duration-300">
                  {region.icon === 'mountain' && <Mountain size={36} className="text-[var(--color-gray-mid)] group-hover:text-[var(--color-orange)]" />}
                  {region.icon === 'building' && <Building2 size={36} className="text-[var(--color-gray-mid)] group-hover:text-[var(--color-orange)]" />}
                  {region.icon === 'trees' && <Trees size={36} className="text-[var(--color-gray-mid)] group-hover:text-[var(--color-orange)]" />}
                  {!region.icon && <MapPin size={36} className="text-[var(--color-gray-mid)] group-hover:text-[var(--color-orange)]" />}
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-3">{region.name}</h3>
                <p className="text-[var(--color-gray)] text-sm mb-8 leading-relaxed max-w-[250px]">
                  {region.shortDescription}
                </p>
                <div className="mt-auto px-4 py-2 bg-[var(--color-bg)] rounded-full text-xs font-bold text-[var(--color-dark)] group-hover:bg-[var(--color-dark)] group-hover:text-white transition-colors">
                  {region.listingsCount} آگهی فعال
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ENTRUST SECTION */}
      <section id="entrust" className="relative py-28 bg-[var(--color-dark-2)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom_right,var(--color-dark-2),var(--color-charcoal))]"></div>
        <div className="absolute -right-64 -top-64 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
        <div className="absolute -left-32 -bottom-32 w-[400px] h-[400px] border border-[var(--color-orange)]/10 rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-center lg:text-right reveal">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              ملک خود را به <span className="text-[var(--color-orange)] relative inline-block">بادیز<span className="absolute bottom-1 left-0 w-full h-2 bg-[var(--color-orange)]/30 rounded-full -z-10"></span></span> بسپارید
            </h2>
            <p className="text-[var(--color-gray-light)] text-lg mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              با تکیه بر سال‌ها تجربه و پایگاه داده وسیع مشتریان، ملک شما را در سریع‌ترین زمان و با بهترین قیمت ارزش‌گذاری و معامله می‌کنیم.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/contact?tab=entrust" className="w-full sm:w-auto px-8 py-4 bg-[var(--color-orange)] hover:bg-[var(--color-orange-light)] text-white rounded-xl font-bold transition-colors shadow-lg hover:shadow-[0_4px_20px_rgba(232,97,26,0.4)] whitespace-nowrap text-center">
                سپردن و ثبت آنلاین ملک
              </Link>
              <a href={`tel:${(settings?.site_phone || '02100000000').replace(/\D/g, '')}`} className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white hover:bg-white/5 text-white rounded-xl font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2">
                <Phone size={20} />
                تماس مستقیم: <span dir="ltr" className="font-mono mr-1">{settings?.site_phone || '۰۲۱ - ۰۰۰۰۰۰۰۰'}</span>
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl reveal">
              <Calculator size={32} className="text-[var(--color-orange)] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">ارزیابی رایگان</h3>
              <p className="text-[var(--color-gray-mid)] text-sm">کارشناسی دقیق قیمت ملک شما با توجه به شرایط روز بازار.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl reveal">
              <Map size={32} className="text-[var(--color-orange)] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">بازاریابی هدفمند</h3>
              <p className="text-[var(--color-gray-mid)] text-sm">ارائه ملک به خریداران واقعی از طریق شبکه گسترده ارتباطی.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl reveal sm:col-span-2">
              <ShieldCheck size={32} className="text-[var(--color-orange)] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">معامله مطمئن و حقوقی</h3>
              <p className="text-[var(--color-gray-mid)] text-sm max-w-md">انعقاد قرارداد تحت نظارت کارشناسان حقوقی و ثبتی، تضمین امنیت سرمایه شما در تمامی مراحل.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BUYING GUIDE PREVIEW */}
      <section id="guide" className="py-24 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 reveal">
            <p className="text-[var(--color-orange)] font-bold text-xs uppercase tracking-wider mb-2">محتوای آموزشی</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-dark)] mb-2">راهنمای خرید ملک در کردان</h2>
            <p className="text-[var(--color-gray)]">هر آنچه پیش از معامله باید بدانید</p>
          </div>

          {initialBlogPosts && initialBlogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6">
              {(() => {
                const post = initialBlogPosts[0];
                return (
                  <Link href={`/magazine/${post.slug}`} className="group rounded-[20px] overflow-hidden min-h-[320px] md:min-h-[420px] flex flex-col justify-end p-8 relative reveal transition-transform duration-200 hover:scale-[1.01] hover:shadow-[0_24px_50px_rgba(0,0,0,0.25)]">
                    {post.coverImage ? (
                      <div className="absolute inset-0 z-0">
                        <img src={getImageUrl(post.coverImage)} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={cn("absolute inset-0 z-0 before:absolute before:inset-0 bg-gradient-to-br", post.bgGradient || 'from-[#d4b896] to-[#a07850]', "before:bg-gradient-to-br before:from-black/20 before:to-transparent")}></div>
                    )}
                    <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(10,10,10,0.9)_0%,rgba(10,10,10,0.2)_60%,transparent_100%)]"></div>
                    
                    <div className="relative z-20">
                      <span className="inline-block bg-[var(--color-orange)]/90 text-white rounded-full px-3 py-1 text-[0.72rem] font-bold mb-[0.8rem]">{post.category}</span>
                      <h3 className="text-white text-[1.35rem] font-[800] leading-[1.3] mb-[0.6rem]">{post.title}</h3>
                      <p className="text-[rgba(255,255,255,0.75)] text-[0.85rem] leading-[1.65] line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-3 text-[rgba(255,255,255,0.55)] text-[0.75rem] mt-[0.8rem]">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 bg-[rgba(255,255,255,0.55)] rounded-full"></span>
                        <span>{post.readTime}</span>
                      </div>
                      <span className="inline-flex bg-[var(--color-orange)] text-white rounded-lg px-4 py-[0.45rem] text-[0.82rem] font-bold mt-[0.9rem] transition-all duration-200">
                        ادامه مطلب ←
                      </span>
                    </div>
                  </Link>
                );
              })()}

              <div className="flex flex-col gap-4">
                {initialBlogPosts.slice(1, 4).map(post => (
                  <Link key={post.slug} href={`/magazine/${post.slug}`} className="flex gap-4 bg-white rounded-[14px] border border-[var(--color-border)] p-4 cursor-pointer transition-all duration-200 hover:border-[var(--color-orange)] hover:-translate-x-[3px] text-inherit no-underline">
                    {post.coverImage ? (
                      <div className="w-[80px] h-[80px] shrink-0 rounded-[10px] overflow-hidden">
                        <img src={getImageUrl(post.coverImage)} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={cn("w-[80px] h-[80px] shrink-0 rounded-[10px] flex items-center justify-center bg-gradient-to-br", post.bgGradient || 'from-gray-100 to-gray-200')}><Newspaper size={28} className="text-[var(--color-gray-mid)]" /></div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="inline-block self-start bg-[var(--color-orange)] text-white rounded-full px-2 py-0.5 text-[0.65rem] font-bold mb-1">{post.category}</span>
                      <h3 className="text-[0.88rem] font-bold text-[var(--color-dark)] leading-[1.4] line-clamp-2">{post.title}</h3>
                      <p className="text-[0.73rem] text-[var(--color-gray-mid)] mt-[0.3rem]">{post.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-12 px-6 text-center flex flex-col items-center justify-center">
              <p className="text-[var(--color-dark)] font-bold text-base mb-1">به‌زودی مقالات جدید مجله بادیز منتشر خواهند شد</p>
              <p className="text-xs text-[var(--color-gray-mid)]">تحلیل‌های بازار مسکن و راهنماهای خرید ملک در کردان در حال آماده‌سازی است.</p>
            </div>
          )}

          <Link href="/magazine" className="block mx-auto mt-8 w-fit border-[1.5px] border-[var(--color-dark)] text-[var(--color-dark)] bg-transparent rounded-[10px] px-8 py-[0.7rem] font-[600] text-[0.9rem] transition-all duration-200 hover:bg-[var(--color-dark)] hover:text-white no-underline text-center">
            مشاهده همه مقالات
          </Link>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[var(--color-border)] flex flex-col lg:flex-row reveal relative z-10">
            {/* Left/Top Content */}
            <div className="lg:w-2/5 bg-[var(--color-dark)] p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center">
              {/* Pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:24px_24px]"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">آیا نیاز به مشاوره دارید؟</h2>
                <p className="text-[var(--color-gray-light)] mb-10 leading-relaxed text-sm">
                  فرم را تکمیل کنید تا کارشناسان بادیز املاک در اسرع وقت با شما تماس بگیرند و به سوالات شما پاسخ دهند.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <Phone className="text-[var(--color-orange)]" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-gray-mid)] mb-1">پاسخگویی ۸ صبح تا ۱۰ شب</p>
                      <p className="font-mono font-bold text-lg" dir="ltr">۰۲۱ - ۰۰۰۰۰۰۰۰</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <Map className="text-[var(--color-orange)]" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-gray-mid)] mb-1">مراجعه حضوری</p>
                      <p className="font-bold text-sm leading-snug">بلوار اصلی کردان، دفتر املاک بادیز</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right/Bottom Form */}
            <div className="lg:w-3/5 p-8 md:p-12">
              <h3 className="text-xl font-bold text-[var(--color-dark)] mb-6">فرم ثبت درخواست</h3>
              <ContactForm inquiryType="general" settings={settings} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
