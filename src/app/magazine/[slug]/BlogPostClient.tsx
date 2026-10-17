'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Share2, Tags, CheckCircle2 } from 'lucide-react';
import BreadcrumbBar from '@/components/BreadcrumbBar';
import ContactForm from '@/components/ContactForm';
import BlogCard from '@/components/BlogCard';
import ListingCard from '@/components/ListingCard';
import ArticleLocationMap from '@/components/ArticleLocationMap';
import { BlogPost, RegionInfo, Listing } from '@/types';
import { cn, getImageUrl, formatMarkdownToHtml } from '@/utils';

interface Props {
  post: BlogPost;
  initialBlogPosts: BlogPost[];
  initialRegions: Record<string, RegionInfo>;
  initialListings?: any[];
}

const catNames: Record<string, string> = {
  guide: 'راهنمای خرید',
  price: 'قیمت‌ها',
  investment: 'سرمایه‌گذاری',
  region: 'مناطق',
  legal: 'حقوقی',
};

export default function BlogPostClient({ post, initialBlogPosts, initialRegions, initialListings }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
      setScrollProgress(scroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://badizvilla.ir';
    const shareUrl = post.id ? `${origin}/magazine/${post.id}` : decodeURI(window.location.href);
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt || post.title,
        url: shareUrl
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const breadcrumbs = [
    { label: 'مقالات', href: '/magazine' },
    { label: catNames[post.category] || 'راهنما', href: `/magazine?cat=${post.category}` },
    { label: post.title }
  ];

  const related = initialBlogPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  const matchedLocation = (post as any).map_location;

  return (
    <div className="bg-[var(--color-bg)] pt-[90px] md:pt-[100px] pb-24 relative">
      {/* Progress Bar */}
      <div 
        className="fixed top-[84px] left-0 h-1 bg-[var(--color-orange)] z-40 transition-all duration-100 ease-out" 
        style={{ width: `${Math.min(Math.max(scrollProgress * 100, 0), 100)}%` }}
      ></div>

      <BreadcrumbBar items={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 mt-6 md:mt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content */}
          <div className="w-full lg:w-[68%] min-w-0">
            
            {/* Cover Image Block */}
            {post.coverImage ? (
              <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-t-3xl overflow-hidden relative shadow-sm">
                <img 
                  src={getImageUrl(post.coverImage)} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={cn("w-full aspect-[16/9] sm:aspect-[21/9] rounded-t-3xl flex items-center justify-center bg-gradient-to-br relative overflow-hidden", post.bgGradient)}>
                <span className="text-7xl md:text-9xl filter drop-shadow-xl transform -rotate-6">{post.imageEmoji}</span>
              </div>
            )}

            {/* Article Header Card */}
            <div className="bg-white rounded-b-3xl p-5 md:p-10 shadow-sm border border-t-0 border-[var(--color-border)] mb-8">
              <div className="inline-block px-3 py-1 bg-[var(--color-orange-pale)] text-[var(--color-orange-light)] text-xs md:text-sm font-bold rounded-lg mb-4">
                {catNames[post.category] || 'راهنمای خرید'}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--color-dark)] mb-6 leading-snug md:leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[var(--color-gray-mid)] border-t border-[var(--color-border)] pt-5">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-[var(--color-orange)]"/> 
                  <span>{post.author || 'تیم تحریریه'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16}/> 
                  <span>{post.date}</span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="bg-white rounded-3xl p-5 md:p-10 shadow-sm border border-[var(--color-border)] space-y-8">
              
              {/* Highlight Box */}
              {post.excerpt && (
                <div className="bg-[var(--color-bg)] border-r-4 border-[var(--color-orange)] p-5 md:p-6 rounded-l-2xl">
                  <p className="font-bold text-[var(--color-dark)] text-base md:text-lg leading-relaxed">{post.excerpt}</p>
                </div>
              )}

              {/* Prose Content */}
              <div 
                className="prose article-content text-slate-900 max-w-none text-base md:text-lg leading-relaxed space-y-6 break-words prose-headings:font-black prose-h2:text-xl md:prose-h2:text-2xl prose-h2:text-slate-950 prose-h3:text-lg prose-h3:font-bold prose-h3:text-slate-900 prose-p:text-slate-900 prose-p:leading-9 prose-li:text-slate-900 prose-strong:text-slate-950 prose-img:rounded-2xl prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(post.content || '<p>محتوایی یافت نشد.</p>') }}
              />

              {/* Tags & Action row */}
              <div className="pt-8 mt-12 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Tags size={18} className="text-[var(--color-gray-mid)]" />
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-[var(--color-gray)] text-xs font-bold px-3 py-1 rounded-md">خرید ویلا در کردان</span>
                    <span className="bg-gray-100 text-[var(--color-gray)] text-xs font-bold px-3 py-1 rounded-md">استعلام سند</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm font-bold text-[var(--color-orange)] hover:text-white hover:bg-[var(--color-orange)] px-4 py-2.5 rounded-xl transition-colors border border-[var(--color-orange-light)] w-full sm:w-auto justify-center"
                >
                  <Share2 size={16} /> {copied ? '✓ لینک کپی شد' : 'اشتراک‌گذاری مقاله'}
                </button>
              </div>

            </div>

            {/* Location Map if applicable */}
            {matchedLocation && (
              <ArticleLocationMap location={matchedLocation} />
            )}

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl md:text-2xl font-bold text-[var(--color-dark)] mb-6">مقالات مرتبط</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map(r => (
                    <BlogCard key={r.slug} post={r} />
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Listings Bottom Block */}
            {initialListings && initialListings.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100/80 mb-1 inline-block">پیشنهاد ملکی</span>
                    <h3 className="text-xl md:text-2xl font-black text-[var(--color-dark)]">ویلاهای فروشی پیشنهادی در کردان</h3>
                  </div>
                  <Link href="/search-results" className="text-xs md:text-sm font-bold text-[var(--color-orange)] hover:underline">
                    مشاهده همه
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {initialListings.slice(0, 4).map(l => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[32%] shrink-0 lg:sticky lg:top-[100px] space-y-6 self-start">
            
            {/* Consultation Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)]">
              <h3 className="font-bold text-lg mb-2 text-[var(--color-dark)] text-center">مشاوره تخصصی خرید ملک</h3>
              <p className="text-xs text-[var(--color-gray-mid)] mb-5 text-center">پس از مطالعه مقاله سوالی دارید؟ به صورت رایگان از کارشناس کمک بگیرید.</p>
              <ContactForm inquiryType="general" buttonText="مشاوره رایگان می‌خواهم" isDark={false} />
            </div>

            {/* Sidebar Featured Listings */}
            {initialListings && initialListings.length > 0 ? (
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-orange)] inline-block animate-pulse" />
                    آگهی‌های فروشی پیشنهادی
                  </h3>
                  <Link href="/search-results" className="text-xs text-[var(--color-orange)] font-bold hover:underline">
                    مشاهده همه
                  </Link>
                </div>
                <div className="space-y-3">
                  {initialListings.slice(0, 4).map((rel: any) => (
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
                          <span>{rel.propertyType === 'land' ? 'زمین' : 'ویلا'}</span>
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
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)]">
                <h3 className="font-bold text-[var(--color-dark)] text-lg mb-4">مناطق و ویلاهای پیشنهادی</h3>
                <div className="flex flex-col gap-3">
                  {Object.values(initialRegions).map(r => (
                    <Link key={r.slug} href={`/${r.slug}`} className="bg-[var(--color-bg)] hover:bg-white p-3 rounded-xl flex items-center justify-between group transition-colors">
                      <span className="font-bold text-[var(--color-dark)] flex items-center gap-2 text-sm"><span className="opacity-50">{r.emoji}</span> ویلا در {r.name}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/search-results" className="block w-full text-center bg-[var(--color-bg)] py-3 rounded-xl text-sm font-bold text-[var(--color-dark)] hover:bg-[var(--color-border)] transition-colors mt-4">
                  رفتن به آگهی‌ها
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
