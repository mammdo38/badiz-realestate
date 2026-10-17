import React from 'react';

export default function ListingSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/3] bg-slate-200 relative">
        <div className="absolute top-3 right-3 w-16 h-6 bg-slate-300 rounded-lg"></div>
        <div className="absolute bottom-3 right-3 w-24 h-6 bg-slate-300 rounded-lg"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-1">
        <div className="w-20 h-3 bg-slate-200 rounded mb-2"></div>
        <div className="w-full h-4 bg-slate-200 rounded mb-2"></div>
        <div className="w-3/4 h-4 bg-slate-200 rounded mb-4"></div>

        {/* Features Skeleton */}
        <div className="flex items-center gap-4 mb-4 mt-auto">
          <div className="w-12 h-4 bg-slate-200 rounded"></div>
          <div className="w-16 h-4 bg-slate-200 rounded"></div>
          <div className="w-12 h-4 bg-slate-200 rounded"></div>
        </div>

        {/* Agent Info Skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-slate-200"></div>
          <div className="w-24 h-3 bg-slate-200 rounded"></div>
        </div>

        {/* Price Skeleton */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="w-28 h-6 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
