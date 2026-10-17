'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// Fix for default marker icons in Next.js
const initLeaflet = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

export default function RegionsMap() {
  const [mounted, setMounted] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    initLeaflet();
    setMounted(true);
    fetch('https://badizvilla.ir/api/map-locations')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRegions(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] md:h-[600px] bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center border border-slate-200">
        <span className="text-slate-400 font-medium">در حال بارگذاری نقشه...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-slate-200/50 relative z-10">
      <MapContainer 
        center={[35.8908, 50.8258]} // Center roughly between Shomali and Jonoubi
        zoom={11} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {regions.map((region) => (
          <Marker key={region.id} position={[region.lat, region.lng]}>
            <Popup className="font-sans">
              <div className="p-1 min-w-[200px]" dir="rtl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{region.type === 'poi' ? '📍' : region.type === 'shomali' ? '🏔️' : '🌿'}</span>
                  <h3 className="font-bold text-slate-900 m-0 text-base">{region.name}</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 mt-0">
                  {region.description}
                </p>
                <div className="flex flex-col gap-2">
                  {region.type !== 'poi' && (
                    <Link 
                      href={`/search-results?region=${region.slug}`}
                      className="block w-full text-center bg-slate-900 text-white py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
                    >
                      🏠 مشاهده آگهی‌ها
                    </Link>
                  )}
                  {region.article_slug && (
                    <Link 
                      href={`/magazine/${region.article_slug}`}
                      className="block w-full text-center bg-orange-50 text-orange-600 border border-orange-200 py-2 rounded-xl text-sm font-semibold hover:bg-orange-100 transition-colors"
                    >
                      📖 معرفی {region.type === 'poi' ? 'مکان' : 'منطقه'}
                    </Link>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
