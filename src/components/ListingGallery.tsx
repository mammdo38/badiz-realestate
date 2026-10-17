'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, Home } from 'lucide-react';
import { cn, getImageUrl } from '@/utils';

interface ListingGalleryProps {
  images: string[];
  title: string;
  dealTypeLabel: string;
  imageEmoji?: string;
  bgGradient?: string;
}

export default function ListingGallery({ images, title, dealTypeLabel, imageEmoji = '🏡', bgGradient = 'from-gray-100 to-gray-200' }: ListingGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // For lightbox
  const [mainIndex, setMainIndex] = useState(0); // For inline gallery

  const hasImages = images.length > 0;
  const mainImage = hasImages ? images[mainIndex] : null;
  // For desktop thumbnails, just show the first 2 images that are NOT the main image
  const thumbImages = hasImages ? images.map((url, index) => ({ url, index })).filter(img => img.index !== mainIndex).slice(0, 2) : [];
  const remainingCount = Math.max(0, images.length - 3);

  const openLightbox = useCallback((index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // Inline Gallery Navigation
  const goNextMain = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMainIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const goPrevMain = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMainIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Lightbox Navigation
  const goNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Touch handlers for swiping (RTL-aware)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEndMain = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 35;
    // In RTL (Persian):
    // Swiping finger from Left to Right (distance < -35) -> Next image (Left direction)
    // Swiping finger from Right to Left (distance > 35) -> Previous image (Right direction)
    if (distance < -minSwipeDistance) {
      goNextMain();
    } else if (distance > minSwipeDistance) {
      goPrevMain();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const onTouchEndLightbox = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 35;
    if (distance < -minSwipeDistance) {
      goNext();
    } else if (distance > minSwipeDistance) {
      goPrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };


  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.key === 'ArrowRight') goPrev();
        else goNext();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightboxOpen, closeLightbox, goNext, goPrev]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 h-[280px] sm:h-[350px] md:h-[460px]">
        {/* Main Image */}
        <div
          className={cn(
            "relative rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br flex items-center justify-center border border-[var(--color-border)] group md:col-span-2 md:row-span-1 cursor-pointer",
            !mainImage ? bgGradient : ''
          )}
          onClick={() => hasImages && openLightbox(mainIndex)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndMain}
        >
          {mainImage ? (
            <>
              <Image
                key={mainImage} // Force re-render on change for crossfade if implemented
                src={getImageUrl(mainImage)}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Inline Navigation Arrows (Visible on hover on desktop, or always on mobile if wanted, but swipe handles mobile) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goPrevMain}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 md:flex hidden"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    onClick={goNextMain}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 md:flex hidden"
                  >
                    <ChevronLeft size={20} />
                  </button>
                </>
              )}
            </>
          ) : (
            <Home size={64} className="text-[var(--color-gray-light)] transition-transform duration-500 group-hover:scale-110" />
          )}

          {/* Deal Type Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[var(--color-primary)] text-xs font-bold rounded-lg border border-[var(--color-primary)]">
              {dealTypeLabel}
            </span>
          </div>

          {/* Image Count/Indicator Badge */}
          {hasImages && (
            <div className="absolute bottom-4 left-4 z-10">
              <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                <ZoomIn size={14} className="hidden md:block" />
                {images.length === 1 ? '۱ عکس' : `${mainIndex + 1} از ${images.length}`}
              </span>
            </div>
          )}
          
          {/* Mobile swipe indicator dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 md:hidden bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={cn("w-1.5 h-1.5 rounded-full transition-all", idx === mainIndex ? "bg-white scale-125" : "bg-white/50")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Images (Desktop Only) */}
        <div className="hidden md:flex flex-col gap-2 md:gap-3 h-full md:col-span-1">
          {thumbImages.length > 0 ? (
            <>
              <div
                className="relative flex-1 rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br flex items-center justify-center border border-[var(--color-border)] opacity-90 hover:opacity-100 transition-opacity cursor-pointer group"
                onClick={() => {
                  openLightbox(thumbImages[0].index);
                }}
              >
                <Image
                  src={getImageUrl(thumbImages[0].url)}
                  alt={`${title} - عکس فرعی`}
                  fill
                  sizes="25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {thumbImages.length > 1 ? (
                <div
                  className="relative flex-1 rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br flex items-center justify-center border border-[var(--color-border)] opacity-90 hover:opacity-100 transition-opacity cursor-pointer group"
                  onClick={() => {
                    openLightbox(thumbImages[1].index);
                  }}
                >
                  <Image
                    src={getImageUrl(thumbImages[1].url)}
                    alt={`${title} - عکس فرعی ۲`}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {remainingCount > 0 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-xl md:rounded-2xl flex items-center justify-center z-10 hover:bg-black/40 transition-colors">
                      <span className="text-white font-bold text-lg md:text-xl">+{remainingCount} عکس دیگر</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={cn("relative flex-1 rounded-xl overflow-hidden bg-gradient-to-br flex items-center justify-center border border-[var(--color-border)]", bgGradient)}>
                  <Home size={32} className="text-[var(--color-gray-light)] opacity-40" />
                </div>
              )}
            </>
          ) : (
            <>
              <div className={cn("relative flex-1 rounded-xl overflow-hidden bg-gradient-to-br flex items-center justify-center border border-[var(--color-border)]", bgGradient)}>
                <Home size={32} className="text-[var(--color-gray-light)] opacity-40" />
              </div>
              <div className={cn("relative flex-1 rounded-xl overflow-hidden bg-gradient-to-br flex items-center justify-center border border-[var(--color-border)]", bgGradient)}>
                <Home size={32} className="text-[var(--color-gray-light)] opacity-40" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && hasImages && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <X size={28} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-8 md:p-16" 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndLightbox}
          >
            <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
              <Image
                src={getImageUrl(images[activeIndex])}
                alt={`${title} - عکس ${activeIndex + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
              >
                <ChevronRight size={32} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
              >
                <ChevronLeft size={32} />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm rounded-xl p-2 max-w-[90vw] overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={cn(
                    "relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all border-2",
                    i === activeIndex ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-50 hover:opacity-80'
                  )}
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`عکس ${i + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
