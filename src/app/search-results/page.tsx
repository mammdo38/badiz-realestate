import { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';
import { getDynamicRegions } from '@/utils';
import type { Metadata } from 'next';

const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir'}/search-results`;

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'نتایج جستجو | بادیز املاک کردان',
  description: 'جستجو و فیلتر پیشرفته املاک در مناطق مختلف کردان - دپارتمان تخصصی بادیز',
  alternates: {
    canonical: url,
  },
  openGraph: {
    title: 'نتایج جستجو | بادیز املاک کردان',
    description: 'جستجو و فیلتر پیشرفته املاک در مناطق مختلف کردان - دپارتمان تخصصی بادیز',
    url: url,
    type: 'website',
    locale: 'fa_IR',
  },
  robots: {
    index: true,
    follow: true,
  }
};

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
