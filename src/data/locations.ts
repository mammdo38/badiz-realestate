export interface MapRegion {
  id: string;
  name: string;
  parentSlug: string;
  coords: [number, number];
  description: string;
  type: 'shomali' | 'jonoubi';
  articleSlug: string;
}

export const regionsData: MapRegion[] = [
  {
    id: 'kordan-asli',
    name: 'کردان اصلی',
    parentSlug: 'kordan-asli',
    coords: [35.9458, 50.8258],
    description: 'قلب تپنده منطقه کردان با دسترسی به رودخانه و بافت قدیمی و ییلاقی.',
    type: 'shomali',
    articleSlug: 'guide-kordan-asli'
  },
  {
    id: 'baraghan',
    name: 'برغان',
    parentSlug: 'baraghan',
    coords: [35.9554, 50.9388],
    description: 'روستایی تاریخی و توریستی با آب‌وهوای خنک و کوهستانی در شمال کردان.',
    type: 'shomali',
    articleSlug: 'guide-baraghan'
  },
  {
    id: 'chaharbagh',
    name: 'چهارباغ',
    parentSlug: 'chaharbagh',
    coords: [35.8672, 50.8419], // roughly tavousiyeh / chaharbagh area
    description: 'منطقه‌ای سرسبز با باغ‌های میوه و دسترسی عالی، مناسب برای ویلاهای دنج.',
    type: 'jonoubi',
    articleSlug: 'guide-chaharbagh'
  },
  {
    id: 'tehrandasht',
    name: 'تهراندشت',
    parentSlug: 'tehrandasht',
    coords: [35.8308, 50.7061],
    description: 'نگین سرسبز کردان جنوبی، ایده‌آل برای سرمایه‌گذاری ملکی و ساخت ویلای مدرن.',
    type: 'jonoubi',
    articleSlug: 'guide-tehrandasht'
  },
  {
    id: 'soheilieh',
    name: 'سهیلیه',
    parentSlug: 'soheilieh',
    coords: [35.8458, 50.7711],
    description: 'دشتی وسیع با شهرک‌های ویلایی معروف و آب‌وهوای عالی در تمام فصول.',
    type: 'jonoubi',
    articleSlug: 'guide-soheilieh'
  }
];
