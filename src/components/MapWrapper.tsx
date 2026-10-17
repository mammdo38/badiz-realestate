'use client';

import dynamic from 'next/dynamic';

const RegionsMap = dynamic(() => import('./RegionsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center border border-slate-200">
      <span className="text-slate-400 font-medium">در حال بارگذاری نقشه تعاملی...</span>
    </div>
  ),
});

export default function MapWrapper() {
  return <RegionsMap />;
}
