'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
import BreadcrumbBar from '@/components/BreadcrumbBar';
import BlogCard from '@/components/BlogCard';
import ContactForm from '@/components/ContactForm';
import { BlogPost } from '@/types';
import { cn } from '@/utils';

interface Props {
  initialBlogPosts: BlogPost[];
}

const POSTS_PER_PAGE = 6;

export default function MagazineClient({ initialBlogPosts }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const catQuery = searchParams.get('cat') || 'all';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [activeTab, setActiveTab] = useState(catQuery);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setActiveTab(catQuery);
    const p = parseInt(searchParams.get('page') || '1', 10);
    setPage(isNaN(p) || p < 1 ? 1 : p);
  }, [catQuery, searchParams]);

  const breadcrumbs = [
    { label: 'مقالات املاک بادیز' }
  ];

  const filteredPosts = initialBlogPosts.filter(p => {
    const matchesCat = activeTab === 'all' || p.category === activeTab;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      (p.title && p.title.toLowerCase().includes(q)) || 
      (p.excerpt && p.excerpt.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const featuredPost = safePage === 1 && !searchQuery && activeTab === 'all' ? filteredPosts[0] : null;
  const regularPosts = featuredPost
    ? filteredPosts.slice(1, POSTS_PER_PAGE)
    : filteredPosts.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  const categories = [
    { id: 'all', label: 'همه مقالات' },
    { id: 'guide', label: 'راهنمای خرید' },
    { id: 'price', label: 'قیمت‌ها' },
    { id: 'investment', label: 'سرمایه‌گذاری' },
    { id: 'region', label: 'مناطق' },
    { id: 'legal', label: 'حقوقی' }
  ];

  const categoryCount = (catId: string): number =>
    catId === 'all' ? initialBlogPosts.length : initialBlogPosts.filter(p => p.category === catId).length;

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === safePage) return;
    setPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (safePage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (safePage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages);
    }
    return pages;
  };

  const changeTab = (cat: string) => {
    setActiveTab(cat);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', cat);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-[var(--color-bg)] pb-24">
      {/* Dark Hero Band */}
      <section className="bg-[var(--color-dark-2)] pt-[120px] pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwIEg0MCBWNDAgSDAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)] opacity-30 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <p className="text-[var(--color-orange)] font-bold mb-3 uppercase tracking-wider text-sm">مجله تخصصی ملکی</p>
          <h1 className="text-white font-black text-3xl md:text-5xl mb-8 leading-tight">راهنمای جامع ملک در کردان</h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            <span className="bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">مقالات و راهنمای خرید</span>
            <span className="bg-[var(--color-orange)]/20 text-[var(--color-orange-light)] px-4 py-2 rounded-full border border-[var(--color-orange)]/30 backdrop-blur-md">نکات و استعلامات حقوقی</span>
            <span className="bg-white/10 text-white px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">بررسی جامع مناطق کردان</span>
          </div>
        </div>
      </section>

      <BreadcrumbBar items={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="w-full lg:w-[68%]">
            
            {/* Filter Tabs */}
            <div className="flex overflow-x-auto pb-2 mb-8 hide-scrollbar gap-2">
              {categories.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => changeTab(tab.id)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
                    activeTab === tab.id 
                      ? "bg-[var(--color-dark)] text-white shadow-md" 
                      : "bg-white border border-[var(--color-border)] text-[var(--color-gray)] hover:bg-gray-50 hover:border-gray-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200 flex flex-col items-center justify-center">
                <span className="text-5xl max-w-lg mx-auto block mb-4 filter grayscale opacity-40">📰</span>
                <h3 className="text-xl font-bold text-[var(--color-dark)] mb-2">مقاله‌ای یافت نشد</h3>
                <p className="text-sm text-[var(--color-gray)] max-w-md mb-4">
                  {searchQuery 
                    ? `هیچ مقاله‌ای با عبارت «${searchQuery}» پیدا نشد.` 
                    : 'در حال حاضر در این دسته‌بندی مقاله‌ای منتشر نشده است.'}
                </p>
                {(activeTab !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      changeTab('all');
                      setSearchQuery('');
                    }}
                    className="px-5 py-2.5 bg-[var(--color-orange)] text-white text-xs font-bold rounded-xl hover:bg-[var(--color-orange-light)] transition cursor-pointer"
                  >
                    مشاهده همه مقالات
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured Post */}
                {featuredPost && (
                  <BlogCard post={featuredPost} featured />
                )}

                {/* Grid of regular posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularPosts.map(post => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>

                {/* Dynamic Pagination with Previous and Next */}
                {totalPages > 1 && (
                  <nav aria-label="صفحات مقالات" className="pt-10 flex items-center justify-center gap-1.5 sm:gap-2">
                    {/* Previous button (قبلی - در راست‌چین فلش رو به راست است) */}
                    <button
                      type="button"
                      onClick={() => goToPage(safePage - 1)}
                      disabled={safePage === 1}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200",
                        safePage === 1
                          ? "opacity-35 cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-white border border-[var(--color-border)] text-[var(--color-dark)] hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-sm"
                      )}
                      aria-label="صفحه قبلی"
                    >
                      <ChevronRight size={16} />
                      <span className="hidden sm:inline">قبلی</span>
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((p, idx) => {
                      if (typeof p === 'string') {
                        return (
                          <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm font-bold select-none">
                            …
                          </span>
                        );
                      }
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => goToPage(p)}
                          className={cn(
                            "w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all duration-200 cursor-pointer",
                            safePage === p
                              ? "bg-[var(--color-dark)] text-white shadow-md scale-105"
                              : "bg-white border border-[var(--color-border)] text-[var(--color-gray-mid)] hover:bg-gray-50 hover:text-[var(--color-dark)] shadow-sm"
                          )}
                          aria-current={safePage === p ? 'page' : undefined}
                        >
                          {new Intl.NumberFormat('fa-IR').format(p)}
                        </button>
                      );
                    })}

                    {/* Next button (بعدی - در راست‌چین فلش رو به چپ است) */}
                    <button
                      type="button"
                      onClick={() => goToPage(safePage + 1)}
                      disabled={safePage === totalPages}
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200",
                        safePage === totalPages
                          ? "opacity-35 cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-white border border-[var(--color-border)] text-[var(--color-dark)] hover:bg-gray-50 hover:border-gray-300 cursor-pointer shadow-sm"
                      )}
                      aria-label="صفحه بعدی"
                    >
                      <span className="hidden sm:inline">بعدی</span>
                      <ChevronLeft size={16} />
                    </button>
                  </nav>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[32%] space-y-8">
            
            {/* Search */}
            <div className="bg-white rounded-3xl p-6 border border-[var(--color-border)]">
              <h3 className="font-bold text-[var(--color-dark)] mb-4 flex items-center gap-2">
                <Search size={18} className="text-[var(--color-orange)]" /> جستجو در مقالات
              </h3>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="جستجو در عنوان یا متن مقالات..." 
                  className="w-full px-4 py-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-orange)] focus:ring-1 focus:ring-[var(--color-orange)] transition-all text-sm pl-9"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setPage(1);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
                    title="پاک کردن جستجو"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Categories Menu */}
            <div className="bg-white rounded-3xl p-6 border border-[var(--color-border)]">
              <h3 className="font-bold text-lg text-[var(--color-dark)] mb-4">دسته‌بندی‌ها</h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => changeTab(cat.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-bg)] text-sm font-medium transition-colors group cursor-pointer"
                    >
                      <span className={cn("transition-colors", activeTab === cat.id ? "text-[var(--color-orange)] font-bold" : "text-[var(--color-gray)] group-hover:text-[var(--color-dark)]")}>{cat.label}</span>
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full block">{categoryCount(cat.id)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-3xl p-6 border border-[var(--color-border)]">
              <h3 className="font-bold text-lg text-[var(--color-dark)] mb-4">مقالات پربازدید</h3>
              <div className="space-y-4">
                {[...initialBlogPosts].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 4).map((p, idx) => (
                  <Link key={p.slug} href={`/magazine/${p.slug}`} className="flex gap-4 group">
                    <span className="text-3xl font-black text-gray-200 mt-1">{idx+1}</span>
                    <div>
                      <p className="font-bold text-[var(--color-dark)] text-sm line-clamp-2 leading-tight group-hover:text-[var(--color-orange)] transition-colors mb-1">{p.title}</p>
                      <p className="text-xs text-[var(--color-gray-light)]">بازدید: {new Intl.NumberFormat('fa-IR').format(p.views || 0)}</p>
                    </div>
                  </Link>
                ))}
                <button 
                  onClick={() => {
                    changeTab('all');
                    setSearchQuery('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-center text-[var(--color-orange)] text-xs font-bold pt-2 border-t border-[var(--color-border)] mt-2 hover:text-[var(--color-orange-light)] transition cursor-pointer"
                >
                  مشاهده همه
                </button>
              </div>
            </div>

            {/* Dark CTA */}
            <div className="bg-[var(--color-dark-2)] rounded-3xl p-6 text-white text-center shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-orange)]/20 rounded-full blur-[40px] pointer-events-none"></div>
               <h3 className="font-bold text-lg mb-3 relative z-10">نیاز به راهنمایی حقوقی دارید؟</h3>
               <p className="text-sm text-[var(--color-gray-mid)] mb-6 relative z-10">کارشناسان حقوقی بادیز املاک آماده ارائه مشاوره به شما هستند.</p>
               <ContactForm inquiryType="consult" buttonText="تماس با کارشناس حقوقی" className="relative z-10" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
