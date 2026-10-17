export const getImageUrl = (filename?: string) => {
  if (!filename) return '';
  if (filename.startsWith('http')) return filename;
  if (filename.startsWith('/')) return filename;
  return `/uploads/${filename}`;
};

export const getDealTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    sell: 'فروش',
    annual_rent: 'رهن و اجاره',
    daily_rent: 'اجاره روزانه',
    commercial_rent: 'اجاره تجاری'
  };
  return map[type] || type;
};

export const getPropertyTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    villa: 'ویلا',
    garden: 'باغ',
    land: 'زمین',
    apartment: 'آپارتمان',
    warehouse: 'سوله',
    shop: 'مغازه',
    workshop: 'کارگاه'
  };
  return map[type] || type;
};

export const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    active: 'فعال',
    sold: 'فروخته شده',
    rented: 'اجاره رفته',
    pending: 'در حال بررسی',
    inactive: 'غیرفعال'
  };
  return map[status] || status;
};

export const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    sold: 'bg-blue-100 text-blue-800',
    rented: 'bg-purple-100 text-purple-800',
    pending: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-red-100 text-red-800'
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

export const getCategoryLabel = (cat: string) => {
  const map: Record<string, string> = {
    guide: 'راهنما',
    price: 'قیمت‌ها',
    investment: 'سرمایه‌گذاری',
    region: 'مناطق',
    legal: 'حقوقی'
  };
  return map[cat] || cat;
};

export const formatPrice = (price: number | null) => {
  if (!price) return 'توافقی';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
