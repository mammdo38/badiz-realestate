import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export { numberToPersianWords } from './utils/numberToWords';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function translateDealType(dealType: string) {
  const map: Record<string, string> = {
    sell: 'خرید و فروش',
    annual_rent: 'اجاره سالیانه',
    daily_rent: 'اجاره روزانه',
    commercial_rent: 'اجاره تجاری',
  };
  return map[dealType] || dealType;
}

export function translatePropertyType(propType: string) {
  const map: Record<string, string> = {
    villa: 'ویلا',
    garden: 'باغ',
    land: 'زمین',
    apartment: 'آپارتمان',
    warehouse: 'سوله',
    shop: 'مغازه',
    workshop: 'کارگاه',
  };
  return map[propType] || propType;
}

export function getDealColor(dealType: string) {
  const map: Record<string, string> = {
    sell: 'text-orange-600 bg-orange-100',
    annual_rent: 'text-blue-600 bg-blue-100',
    daily_rent: 'text-green-600 bg-green-100',
    commercial_rent: 'text-purple-600 bg-purple-100',
  };
  return map[dealType] || 'text-gray-600 bg-gray-100';
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return 'توافقی';
  return new Intl.NumberFormat('fa-IR').format(price);
}

export function getImageUrl(filename: string | null | undefined): string {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
  const cleanFilename = filename.replace(/^\/?uploads\//, '').replace(/^\//, '');
  return `/uploads/${cleanFilename}`;
}

export function getAbsoluteImageUrl(filename: string | null | undefined): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://badizvilla.ir';
  if (!filename) return `${baseUrl}/og-image.jpg`;
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
  const cleanFilename = filename.replace(/^\/?uploads\//, '').replace(/^\//, '');
  return `${baseUrl}/uploads/${cleanFilename}`;
}

export function formatMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';
  const trimmed = markdown.trim();
  if (trimmed.startsWith('<p>') || trimmed.startsWith('<div>') || trimmed.startsWith('<article>')) {
    return markdown;
  }

  let html = markdown;

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
    return `<img src="${getImageUrl(src)}" alt="${alt}" class="w-full rounded-2xl my-6 shadow-md border border-slate-200" />`;
  });

  // Raw HTML <img> tags with inline styles
  html = html.replace(/<img\s+([^>]*)\/>/gi, (_match, p1) => {
    let srcAttr = p1.match(/src=["']([^"']+)["']/i);
    let altAttr = p1.match(/alt=["']([^"']+)["']/i);
    const src = srcAttr ? getImageUrl(srcAttr[1]) : '';
    const alt = altAttr ? altAttr[1] : '';
    return `<img src="${src}" alt="${alt}" class="w-full rounded-2xl my-6 shadow-md border border-slate-200" />`;
  });

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-extrabold text-slate-900 mt-8 mb-4 border-r-4 border-[var(--color-orange)] pr-3 flex items-center gap-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-black text-slate-950 mt-10 mb-5 pb-3 border-b border-slate-200 flex items-center gap-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-slate-950 mt-6 mb-6">$1</h1>');

  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr class="my-8 border-slate-200" />');

  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-950">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Lists (Both unordered * / - and ordered 1. 2. 3.)
  const lines = html.split('\n');
  let currentListType: 'ul' | 'ol' | null = null;
  const resultLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const ulMatch = line.match(/^[\*\-] (.*$)/);
    const olMatch = line.match(/^\d+[\.\-\)]\s+(.*$)/);

    if (ulMatch) {
      if (currentListType === 'ol') {
        resultLines.push('</ol>');
        currentListType = null;
      }
      if (!currentListType) {
        currentListType = 'ul';
        resultLines.push('<ul class="list-disc list-outside space-y-2.5 my-4 pr-6 text-slate-800 font-medium">');
      }
      resultLines.push(`<li class="leading-relaxed text-slate-800">${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (currentListType === 'ul') {
        resultLines.push('</ul>');
        currentListType = null;
      }
      if (!currentListType) {
        currentListType = 'ol';
        resultLines.push('<ol class="list-decimal list-outside space-y-2.5 my-4 pr-6 text-slate-800 font-medium">');
      }
      resultLines.push(`<li class="leading-relaxed text-slate-800">${olMatch[1]}</li>`);
    } else {
      if (currentListType === 'ul') {
        resultLines.push('</ul>');
        currentListType = null;
      } else if (currentListType === 'ol') {
        resultLines.push('</ol>');
        currentListType = null;
      }
      resultLines.push(line);
    }
  }
  if (currentListType === 'ul') {
    resultLines.push('</ul>');
  } else if (currentListType === 'ol') {
    resultLines.push('</ol>');
  }

  html = resultLines.join('\n');

  // Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks.map(block => {
    const b = block.trim();
    if (!b) return '';
    if (b.startsWith('<h') || b.startsWith('<ul') || b.startsWith('<ol') || b.startsWith('<img') || b.startsWith('<hr') || b.startsWith('<div') || b.startsWith('<blockquote')) {
      return b;
    }
    return `<p class="text-slate-800 text-base md:text-lg leading-8 md:leading-9 my-4">${b}</p>`;
  }).join('\n');

  return html;
}

export async function getDynamicRegions() {
  try {
    const res = await fetch('http://localhost:5000/api/regions', { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const regionsMap: Record<string, any> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.data.forEach((r: any) => {
          regionsMap[r.slug] = {
            slug: r.slug,
            name: r.name_fa,
            emoji: r.emoji || '',
            description: r.description || '',
            listingsCount: parseInt(r.active_listing_count) || 0,
            shortDescription: r.description ? r.description.substring(0, 50) + '...' : '',
            page_title: r.page_title || '',
          };
        });
        return regionsMap;
      }
    }
  } catch (e) {
    console.error('Error fetching regions:', e);
  }
  // Fallback to static
  const { regions } = await import('@/data');
  return regions;
}
