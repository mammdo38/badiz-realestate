'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Filter, X, Search, SlidersHorizontal, Loader2, ChevronDown, ChevronUp, Check } from 'lucide-react';
import BreadcrumbBar from '@/components/BreadcrumbBar';
import ListingCard from '@/components/ListingCard';
import ListingSkeleton from '@/components/ListingSkeleton';
import { translateDealType, translatePropertyType, formatPrice, numberToPersianWords } from '@/utils';
import { Listing, RegionInfo } from '@/types';
import { listings as staticListings } from '@/data';

interface Props {
  initialRegions: Record<string, RegionInfo>;
}

export default function SearchResultsClient({ initialRegions }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Actual applied filters from URL
  const dealType = searchParams.get('deal') || 'all';
  const propType = searchParams.get('type') || 'all';
  const regionType = searchParams.get('region') || 'all';
  const sortType = searchParams.get('sort') || 'newest';
  const keyword = searchParams.get('search') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const minSize = searchParams.get('min_size') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const hasPool = searchParams.get('has_pool') === 'true';
  const hasParking = searchParams.get('has_parking') === 'true';

  // Local states for the filter UI (not yet applied)
  const [localDealType, setLocalDealType] = useState(dealType);
  const [localPropType, setLocalPropType] = useState(propType);
  const [localRegionType, setLocalRegionType] = useState(regionType);
  const [localBedrooms, setLocalBedrooms] = useState(bedrooms);
  const [localHasPool, setLocalHasPool] = useState(hasPool);
  const [localHasParking, setLocalHasParking] = useState(hasParking);
  
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice ? parseInt(minPrice).toLocaleString('en-US') : '');
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice ? parseInt(maxPrice).toLocaleString('en-US') : '');
  const [localMinSize, setLocalMinSize] = useState(minSize);

  // Sync local state when URL changes (e.g. going back/forward, or clearing filters)
  useEffect(() => {
    setLocalDealType(dealType);
    setLocalPropType(propType);
    setLocalRegionType(regionType);
    setLocalBedrooms(bedrooms);
    setLocalHasPool(hasPool);
    setLocalHasParking(hasParking);
    
    setLocalKeyword(keyword);
    setLocalMinPrice(minPrice ? parseInt(minPrice).toLocaleString('en-US') : '');
    setLocalMaxPrice(maxPrice ? parseInt(maxPrice).toLocaleString('en-US') : '');
    setLocalMinSize(minSize);
  }, [dealType, propType, regionType, bedrooms, hasPool, hasParking, keyword, minPrice, maxPrice, minSize]);

  const [results, setResults] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchListings = async (pageNum: number, isNewSearch = false) => {
    setLoading(true);

    try {
      const q = new URLSearchParams();
      q.set('limit', '10');
      q.set('page', pageNum.toString());
      if (dealType !== 'all') q.set('deal', dealType);
      if (propType !== 'all') q.set('type', propType);
      if (regionType !== 'all') q.set('region', regionType);
      if (keyword) q.set('search', keyword);
      if (minPrice) q.set('min_price', minPrice);
      if (maxPrice) q.set('max_price', maxPrice);
      if (minSize) q.set('min_size', minSize);
      if (bedrooms) q.set('bedrooms', bedrooms);
      if (hasPool) q.set('has_pool', 'true');
      if (hasParking) q.set('has_parking', 'true');
      q.set('sort', sortType);

      const res = await fetch(`/api/listings?${q.toString()}`);
      const data = await res.json();

      if (data.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedData: Listing[] = data.data.map((item: any) => ({
          id: item.id.toString(),
          slug: item.slug,
          title: item.title,
          dealType: item.deal_type,
          propertyType: item.property_type,
          region: item.region_slug || 'kordan-markazi',
          price: item.deal_type === 'daily_rent' 
            ? (item.price_per_night ? formatPrice(item.price_per_night) : 'توافقی')
            : formatPrice(item.price),
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
          features: [],
          primaryImage: item.default_image || item.primary_image,
          agentName: item.agent_name,
          agentPhoto: item.agent_photo
        }));

        if (isNewSearch) {
          setResults(mappedData);
        } else {
          setResults(prev => [...prev, ...mappedData]);
        }
        setTotalCount(data.pagination.total);
        setHasMore(data.pagination.page < data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Fallback for static export / GitHub Pages: filter static listings directly
      let filtered = [...staticListings];
      if (dealType !== 'all') filtered = filtered.filter(item => item.dealType === dealType);
      if (propType !== 'all') filtered = filtered.filter(item => item.propertyType === propType);
      if (regionType !== 'all') filtered = filtered.filter(item => item.region === regionType);
      if (keyword) {
        const lower = keyword.toLowerCase();
        filtered = filtered.filter(item => item.title.toLowerCase().includes(lower) || (item.description && item.description.toLowerCase().includes(lower)));
      }
      if (minPrice) filtered = filtered.filter(item => (item.priceRaw || 0) >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter(item => (item.priceRaw || 0) <= Number(maxPrice));
      if (minSize) filtered = filtered.filter(item => (item.sizeBuilt || 0) >= Number(minSize) || (item.sizeLand || 0) >= Number(minSize));
      if (bedrooms) filtered = filtered.filter(item => item.bedrooms >= Number(bedrooms));
      if (hasPool) filtered = filtered.filter(item => item.features?.includes('استخر'));
      if (hasParking) filtered = filtered.filter(item => item.parking);

      setResults(filtered);
      setTotalCount(filtered.length);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMore(true);
    fetchListings(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealType, propType, regionType, sortType, keyword, minPrice, maxPrice, minSize, bedrooms, hasPool, hasParking]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage(p => {
        const nextPage = p + 1;
        fetchListings(nextPage, false);
        return nextPage;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, dealType, propType, regionType, sortType, keyword, minPrice, maxPrice, minSize, bedrooms, hasPool, hasParking]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    });
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => observer.disconnect();
  }, [handleObserver]);

  const breadcrumbs = [
    { label: 'نتایج جستجو' }
  ];

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key === 'deal' && value === 'daily_rent' && propType === 'land') {
      params.delete('type');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const removeFilter = (key: string) => {
    updateSearchParams(key, 'all');
  };

  const clearAll = () => {
    router.push(pathname);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setter(raw ? parseInt(raw).toLocaleString('en-US') : '');
  };

  const applyAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (localDealType === 'all') params.delete('deal'); else params.set('deal', localDealType);
    if (localPropType === 'all') params.delete('type'); else params.set('type', localPropType);
    if (localRegionType === 'all') params.delete('region'); else params.set('region', localRegionType);
    
    if (localDealType === 'daily_rent' && localPropType === 'land') {
      params.delete('type');
      setLocalPropType('all');
    }

    if (localBedrooms) params.set('bedrooms', localBedrooms); else params.delete('bedrooms');
    if (localHasPool) params.set('has_pool', 'true'); else params.delete('has_pool');
    if (localHasParking) params.set('has_parking', 'true'); else params.delete('has_parking');

    if (localKeyword) params.set('search', localKeyword); else params.delete('search');
    
    const rawMin = localMinPrice.replace(/\D/g, '');
    if (rawMin) params.set('min_price', rawMin); else params.delete('min_price');
    
    const rawMax = localMaxPrice.replace(/\D/g, '');
    if (rawMax) params.set('max_price', rawMax); else params.delete('max_price');

    if (localMinSize) params.set('min_size', localMinSize); else params.delete('min_size');
    
    router.push(`${pathname}?${params.toString()}`);
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="bg-[var(--color-bg)] pt-[100px] pb-24">
      <BreadcrumbBar items={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Active Filters Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[var(--color-gray)] text-sm font-bold flex items-center gap-1.5 ml-2">
              <SlidersHorizontal size={16} /> فیلترهای فعال:
            </span>
            
            {dealType !== 'all' && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-orange)]">
                {translateDealType(dealType)}
                <button onClick={() => removeFilter('deal')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {propType !== 'all' && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-dark)]">
                {translatePropertyType(propType)}
                <button onClick={() => removeFilter('type')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {regionType !== 'all' && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-dark)]">
                {initialRegions[regionType]?.name || regionType}
                <button onClick={() => removeFilter('region')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {keyword && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-dark)]">
                "{keyword}"
                <button onClick={() => removeFilter('search')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {minPrice && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-dark)]">
                از {parseInt(minPrice).toLocaleString('fa-IR')} تومان
                <button onClick={() => removeFilter('min_price')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {maxPrice && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-dark)]">
                تا {parseInt(maxPrice).toLocaleString('fa-IR')} تومان
                <button onClick={() => removeFilter('max_price')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {minSize && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-dark)]">
                بالای {parseInt(minSize).toLocaleString('fa-IR')} متر
                <button onClick={() => removeFilter('min_size')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {hasPool && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-dark)]">
                استخردار
                <button onClick={() => removeFilter('has_pool')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {hasParking && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-dark)]">
                پارکینگ
                <button onClick={() => removeFilter('has_parking')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {bedrooms && (
              <span className="flex items-center gap-1.5 bg-white border border-[var(--color-border)] px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-dark)]">
                {bedrooms === '4' ? '۴+ خواب' : `${parseInt(bedrooms).toLocaleString('fa-IR')} خواب`}
                <button onClick={() => removeFilter('bedrooms')} className="hover:text-red-500 transition-colors"><X size={14}/></button>
              </span>
            )}
            {(dealType === 'all' && propType === 'all' && regionType === 'all' && !keyword && !minPrice && !maxPrice && !minSize && !bedrooms && !hasPool && !hasParking) && (
              <span className="text-xs text-[var(--color-gray-light)] font-medium">همه آگهی‌ها</span>
            )}
          </div>
          
          <button onClick={clearAll} className="text-xs font-bold text-[var(--color-gray-mid)] hover:text-[var(--color-dark)] transition-colors self-start sm:self-auto">
            پاک کردن همه
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <div className="w-full lg:w-[25%] lg:sticky lg:top-[100px]">
            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden w-full bg-white border border-[var(--color-border)] rounded-2xl p-4 flex items-center justify-between mb-4 font-bold text-[var(--color-dark)] shadow-sm"
            >
              <span className="flex items-center gap-2"><Filter size={18} className="text-[var(--color-orange)]" /> فیلتر پیشرفته</span>
              {isMobileFilterOpen ? <ChevronUp size={20} className="text-[var(--color-gray)]" /> : <ChevronDown size={20} className="text-[var(--color-gray)]" />}
            </button>

            {/* Filter Content */}
            <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block bg-white rounded-3xl p-6 border border-[var(--color-border)]`}>
              <h3 className="hidden lg:flex font-bold text-[var(--color-dark)] text-lg mb-6 items-center gap-2">
                <Filter size={18} className="text-[var(--color-orange)]" /> فیلتر پیشرفته
              </h3>

              <div className="space-y-6">
                
                <div>
                  <p className="font-bold text-sm text-[var(--color-dark)] mb-3">نوع معامله</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['all', 'sell', 'annual_rent', 'daily_rent'].map(val => (
                      <button 
                        key={val}
                        onClick={() => setLocalDealType(val)}
                        className={`w-full px-2 py-2 rounded-xl text-xs font-bold transition-all ${localDealType === val ? 'bg-[var(--color-orange)] text-white shadow-md' : 'bg-gray-100 text-[var(--color-gray)] hover:bg-gray-200'}`}
                      >
                        {val === 'all' ? 'همه موارد' : translateDealType(val)}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-[var(--color-border)]" />

                <div>
                  <p className="font-bold text-sm text-[var(--color-dark)] mb-3">نوع ملک</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(localDealType === 'daily_rent' ? ['all', 'villa', 'garden', 'apartment'] : ['all', 'villa', 'garden', 'land', 'apartment']).map(val => (
                      <button 
                        key={val}
                        onClick={() => setLocalPropType(val)}
                        className={`w-full px-2 py-2 rounded-xl text-xs font-bold transition-all ${val === 'all' ? 'col-span-2' : ''} ${localPropType === val ? 'bg-[var(--color-orange)] text-white shadow-md' : 'bg-gray-100 text-[var(--color-gray)] hover:bg-gray-200'}`}
                      >
                        {val === 'all' ? 'همه انواع' : translatePropertyType(val)}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-[var(--color-border)]" />

                <div>
                  <p className="font-bold text-sm text-[var(--color-dark)] mb-3">منطقه</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      key="all"
                      onClick={() => setLocalRegionType('all')}
                      className={`w-full px-2 py-2 rounded-xl text-xs font-bold transition-all ${localRegionType === 'all' ? 'bg-[var(--color-orange)] text-white shadow-md' : 'bg-gray-100 text-[var(--color-gray)] hover:bg-gray-200'}`}
                    >
                      تمام مناطق
                    </button>
                    {Object.values(initialRegions).map(r => (
                      <button 
                        key={r.slug}
                        onClick={() => setLocalRegionType(r.slug)}
                        className={`w-full px-2 py-2 rounded-xl text-xs font-bold transition-all ${localRegionType === r.slug ? 'bg-[var(--color-orange)] text-white shadow-md' : 'bg-gray-100 text-[var(--color-gray)] hover:bg-gray-200'}`}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-[var(--color-border)]" />

                <div>
                  <p className="font-bold text-sm text-[var(--color-dark)] mb-3">محدوده قیمت (تومان)</p>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="حداقل قیمت" 
                        dir="ltr"
                        value={localMinPrice}
                        onChange={(e) => handlePriceChange(e, setLocalMinPrice)}
                        onKeyDown={(e) => e.key === 'Enter' && applyAllFilters()}
                        className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 text-xs font-bold text-left focus:ring-2 focus:ring-[var(--color-orange)] focus:bg-white transition-all shadow-inner"
                      />
                      <span className="absolute right-4 top-3 text-xs text-[var(--color-gray-light)] font-bold">از</span>
                    </div>
                    {localMinPrice && (
                      <div className="text-[10px] text-[var(--color-gray)] text-center mt-[-6px] px-2" dir="rtl">
                        {numberToPersianWords(localMinPrice)} تومان
                      </div>
                    )}
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="حداکثر قیمت" 
                        dir="ltr"
                        value={localMaxPrice}
                        onChange={(e) => handlePriceChange(e, setLocalMaxPrice)}
                        onKeyDown={(e) => e.key === 'Enter' && applyAllFilters()}
                        className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 text-xs font-bold text-left focus:ring-2 focus:ring-[var(--color-orange)] focus:bg-white transition-all shadow-inner"
                      />
                      <span className="absolute right-4 top-3 text-xs text-[var(--color-gray-light)] font-bold">تا</span>
                    </div>
                    {localMaxPrice && (
                      <div className="text-[10px] text-[var(--color-gray)] text-center mt-[-6px] px-2" dir="rtl">
                        {numberToPersianWords(localMaxPrice)} تومان
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-[var(--color-border)]" />

                <div>
                  <p className="font-bold text-sm text-[var(--color-dark)] mb-3">حداقل متراژ (متر)</p>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="مثلا: ۵۰۰" 
                      dir="ltr"
                      value={localMinSize}
                      onChange={(e) => setLocalMinSize(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && applyAllFilters()}
                      className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 text-xs font-bold text-left focus:ring-2 focus:ring-[var(--color-orange)] focus:bg-white transition-all shadow-inner"
                    />
                    <span className="absolute right-4 top-3 text-xs text-[var(--color-gray-light)] font-bold">متراژ بالای</span>
                  </div>
                </div>

                <hr className="border-[var(--color-border)]" />

                <div>
                  <p className="font-bold text-sm text-[var(--color-dark)] mb-3">امکانات ویژه</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setLocalHasPool(!localHasPool)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${localHasPool ? 'bg-[var(--color-orange)] text-white shadow-md' : 'bg-gray-100 text-[var(--color-gray)] hover:bg-gray-200'}`}
                    >
                      استخردار
                    </button>
                    <button 
                      onClick={() => setLocalHasParking(!localHasParking)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${localHasParking ? 'bg-[var(--color-orange)] text-white shadow-md' : 'bg-gray-100 text-[var(--color-gray)] hover:bg-gray-200'}`}
                    >
                      پارکینگ
                    </button>
                  </div>
                </div>

                <hr className="border-[var(--color-border)]" />

                <div>
                  <p className="font-bold text-sm text-[var(--color-dark)] mb-3">تعداد اتاق خواب</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(val => (
                      <button 
                        key={val}
                        onClick={() => setLocalBedrooms(localBedrooms === val.toString() ? '' : val.toString())}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${localBedrooms === val.toString() ? 'bg-[var(--color-orange)] text-white shadow-md' : 'bg-gray-100 text-[var(--color-gray)] hover:bg-gray-200'}`}
                      >
                        {val === 4 ? '+۴' : val.toLocaleString('fa-IR')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <button 
                  onClick={applyAllFilters}
                  className="w-full bg-[var(--color-orange)] text-white py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-[var(--color-orange-light)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Check size={18} />
                  اعمال فیلترها
                </button>

              </div>
            </div>
          </div>

          {/* Main Results Container */}
          <div className="w-full lg:w-[75%]">
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--color-dark)]">
                {totalCount} <span className="text-[var(--color-gray)] text-base font-medium">آگهی یافت شد</span>
              </h2>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-gray-mid)] hidden sm:inline">مرتب‌سازی:</span>
                <select 
                  value={sortType}
                  onChange={(e) => updateSearchParams('sort', e.target.value)}
                  className="bg-white border border-[var(--color-border)] rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[var(--color-orange)] cursor-pointer"
                >
                  <option value="newest">جدیدترین</option>
                  <option value="oldest">قدیمی‌ترین</option>
                  <option value="price_asc">ارزان‌ترین</option>
                  <option value="price_desc">گران‌ترین</option>
                </select>
              </div>
            </div>

            {loading && results.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ListingSkeleton key={index} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-16 text-center border border-[var(--color-border)] flex flex-col items-center">
                <Search size={64} className="text-[var(--color-gray-light)] mb-6 opacity-50" />
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-dark)] mb-2">موردی برای نمایش وجود ندارد!</h3>
                <p className="text-sm sm:text-base text-[var(--color-gray)] mb-8 max-w-md">با تغییر فیلترها شانس خود را برای یافتن ملک مورد نظر افزایش دهید.</p>
                <button onClick={clearAll} className="bg-[var(--color-orange)] text-white px-6 sm:px-8 py-3 rounded-xl text-sm font-bold hover:bg-[var(--color-orange-light)] transition-colors shadow-md">
                  پاک کردن همه فیلترها
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
            
            {/* Loading / Infinite Scroll Observer */}
            <div ref={observerTarget} className="flex justify-center items-center py-8">
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-400 animate-bounce"></div>
                </div>
              )}
              {!hasMore && results.length > 0 && (
                <p className="text-sm text-[var(--color-gray)] font-medium">پایان نتایج.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
