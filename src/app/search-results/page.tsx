import { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';
import { getDynamicRegions } from '@/utils';
import type { Metadata } from 'next';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

import { translateDealType, translatePropertyType } from '@/utils';

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Object.keys(params).length > 0;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/search-results`;
  
  const regions = await getDynamicRegions();
  
  const dealStr = params.deal && typeof params.deal === 'string' ? translateDealType(params.deal) : 'خرید و فروش';
  const typeStr = params.type && typeof params.type === 'string' ? translatePropertyType(params.type) : 'املاک';
  const regionStr = params.region && typeof params.region === 'string' && regions[params.region] ? regions[params.region].name : 'کردان';
  
  const dynamicTitle = hasFilters ? `${dealStr} ${typeStr} در ${regionStr} | بادیز املاک` : 'نتایج جستجو | بادیز املاک کردان';

  return {
    title: dynamicTitle,
    description: `جستجو و فیلتر پیشرفته ${typeStr} در مناطق مختلف ${regionStr} - دپارتمان تخصصی بادیز`,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: dynamicTitle,
      description: `جستجو و فیلتر پیشرفته ${typeStr} در مناطق مختلف ${regionStr} - دپارتمان تخصصی بادیز`,
      url: url,
      type: "website",
      locale: "fa_IR",
    },
    robots: {
      index: !hasFilters,
      follow: true,
    }
  };
}

export default async function SearchResultsPage() {
  const dynamicRegions = await getDynamicRegions();

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-orange)]"></div>
      </div>
    }>
      <SearchResultsClient initialRegions={dynamicRegions} />
    </Suspense>
  );
}
