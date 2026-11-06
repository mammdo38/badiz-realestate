import Link from 'next/link';
import Image from 'next/image';
import { BedDouble, Ruler, Bath, Home, MapPin, User } from 'lucide-react';
import { regions } from '../data';
import { Listing } from '../types';
import { cn, translateDealType, translatePropertyType, getDealColor, getImageUrl } from '../utils';

interface Props {
  listing: Listing;
}

export default function ListingCard({ listing }: Props) {
  const region = regions[listing.region];

  const targetId = listing.id || listing.slug;

  return (
    <Link 
      href={`/listing/${targetId}`} 
      className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Image Container */}
      <div className={cn("relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br", !listing.primaryImage ? (listing.bgGradient || 'from-gray-100 to-gray-200') : '')}>
        {listing.primaryImage ? (
          <Image 
            src={getImageUrl(listing.primaryImage)} 
            alt={`${translatePropertyType(listing.propertyType)} ${listing.title} در ${region?.name || 'کردان'}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home size={48} className="text-[var(--color-gray-light)] group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 right-3 pointer-events-none">
          <span className={cn("px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm backdrop-blur-md", getDealColor(listing.dealType))}>
            {translateDealType(listing.dealType)}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <span className="bg-white/95 text-slate-800 backdrop-blur-md px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5">
            <MapPin size={12} className="text-slate-500" />
            {region?.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs font-bold text-slate-500 mb-1.5">
          {translatePropertyType(listing.propertyType)}
        </div>
        <h3 className="font-bold text-slate-800 text-[0.95rem] mb-3 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
          {listing.title}
        </h3>
        
        {/* Features */}
        <div className="flex items-center gap-4 text-[var(--color-gray)] text-sm mb-4 mt-auto">
          {listing.bedrooms > 0 && (
            <div className="flex items-center gap-1.5" title="اتاق خواب">
              <BedDouble size={16} className="text-[var(--color-gray-mid)]" />
              <span>{listing.bedrooms}</span>
            </div>
          )}
          {listing.sizeBuilt > 0 && (
            <div className="flex items-center gap-1.5" title="زیربنا (متر)">
              <Ruler size={16} className="text-[var(--color-gray-mid)]" />
              <span>{listing.sizeBuilt} متر</span>
            </div>
          )}
          {listing.bathrooms && listing.bathrooms > 0 && (
            <div className="flex items-center gap-1.5" title="سرویس بهداشتی">
              <Bath size={16} className="text-[var(--color-gray-mid)]" />
              <span>{listing.bathrooms}</span>
            </div>
          )}
        </div>

        {/* Agent Info */}
        {listing.agentName && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 shrink-0">
              {listing.agentPhoto ? (
                <Image src={getImageUrl(listing.agentPhoto)} className="w-full h-full object-cover" alt={listing.agentName} width={24} height={24} />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><User size={14} className="text-[var(--color-gray-mid)]" /></div>
              )}
            </div>
            <span className="text-xs text-[var(--color-gray-mid)] font-medium">مشاور: {listing.agentName}</span>
          </div>
        )}

        {/* Price */}
        <div className="pt-4 border-t border-[var(--color-border)]/50">
          {listing.dealType === 'annual_rent' && (listing.deposit_price !== undefined || listing.depositPrice !== undefined || listing.monthly_rent !== undefined || listing.monthlyRent !== undefined) ? (
            (() => {
              const depositRaw = listing.deposit_price ?? listing.depositPrice;
              const rentRaw = listing.monthly_rent ?? listing.monthlyRent;
              
              const depositNum = depositRaw !== null && depositRaw !== undefined ? Number(String(depositRaw).replace(/\D/g, '')) : null;
              const rentNum = rentRaw !== null && rentRaw !== undefined ? Number(String(rentRaw).replace(/\D/g, '')) : null;
              
              const formattedDeposit = depositNum ? depositNum.toLocaleString('fa-IR') : (listing.price || 'توافقی');
              const formattedRent = rentNum ? rentNum.toLocaleString('fa-IR') : null;
              const hasRent = rentNum && rentNum > 0;

              if (hasRent) {
                return (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500 font-medium">ودیعه:</span>
                      <span className="font-bold text-slate-900 text-sm">{formattedDeposit} <span className="text-[10px] font-normal text-slate-500">تومان</span></span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-500 font-medium">اجاره ماهانه:</span>
                      <span className="font-bold text-[var(--color-orange)] text-sm">{formattedRent} <span className="text-[10px] font-normal text-slate-500">تومان</span></span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200/60">رهن کامل</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-extrabold text-[var(--color-orange)]">{formattedDeposit}</span>
                      <span className="text-xs text-slate-500">تومان</span>
                    </div>
                  </div>
                );
              }
            })()
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[var(--color-orange)]">{listing.price}</span>
              <span className="text-xs text-[var(--color-gray)] font-medium">{listing.priceUnit}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
