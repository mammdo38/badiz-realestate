'use client';

import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareButton({ listingId }: { listingId: string | number }) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/listing/${listingId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'آگهی املاک در بادیز',
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share error:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('لینک کوتاه آگهی کپی شد');
      } catch (err) {
        toast.error('خطا در کپی کردن لینک');
      }
    }
  };

  return (
    <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-gray)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors cursor-pointer">
      <Share2 size={16} /> اشتراک
    </button>
  );
}
