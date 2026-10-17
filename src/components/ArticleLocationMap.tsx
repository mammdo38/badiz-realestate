'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapRegion } from '../data/locations';
import { Navigation, MapPin } from 'lucide-react';

// We dynamically import the actual map so it doesn't break SSR
const MapInternal = dynamic(() => import('./ArticleLocationMapInternal'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center border border-slate-200">
      <span className="text-slate-400 font-medium">در حال بارگذاری نقشه...</span>
    </div>
  ),
});

export default function ArticleLocationMap({ location }: { location: MapRegion }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const lat = (location as any).lat;
  const lng = (location as any).lng;

  const neshanUrl = `https://neshan.org/maps/routing?destLat=${lat}&destLng=${lng}`;
  const baladUrl = `https://balad.ir/route?dest=${lat},${lng}`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mt-12 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
          <MapPin className="w-5 h-5" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 m-0">
          موقعیت و مسیریابی به {location.name}
        </h3>
      </div>
      
      <p className="text-slate-600 mb-6 leading-relaxed">
        برای دسترسی آسان‌تر، می‌توانید موقعیت دقیق {location.name} را روی نقشه زیر مشاهده کنید و با استفاده از دکمه‌های مسیریاب، بهترین مسیر را از مبدا خود پیدا کنید.
      </p>

      {/* Map Component */}
      <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border-4 border-white shadow-lg shadow-slate-200/50 relative z-10 mb-8">
        <MapInternal coords={[lat, lng]} name={location.name} />
      </div>

      {/* Routing Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a 
          href={neshanUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#FDE8E8] text-[#E02424] hover:bg-[#FBD5D5] px-6 py-4 rounded-2xl font-bold text-base transition-colors"
        >
          <Navigation className="w-5 h-5" />
          مسیریابی با نشان
        </a>
        <a 
          href={baladUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#E1EFFE] text-[#1A56DB] hover:bg-[#C3DDFD] px-6 py-4 rounded-2xl font-bold text-base transition-colors"
        >
          <Navigation className="w-5 h-5" />
          مسیریابی با بلد
        </a>
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#E5EDFF] text-[#4285F4] hover:bg-[#D1E0FF] px-6 py-4 rounded-2xl font-bold text-base transition-colors"
        >
          <Navigation className="w-5 h-5" />
          Google Maps
        </a>
      </div>
    </div>
  );
}
