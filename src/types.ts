export type DealType = 'sell' | 'annual_rent' | 'daily_rent' | 'commercial_rent';
export type PropertyType = 'villa' | 'garden' | 'land' | 'apartment' | 'warehouse' | 'shop' | 'workshop';
export type RegionSlug = 'kordan-shomali' | 'kordan-markazi' | 'kordan-jonoubi';
export type BlogCategory = 'guide' | 'price' | 'investment' | 'region' | 'legal';

export interface Listing {
  id: string;
  slug: string;
  title: string;
  dealType: DealType;
  propertyType: PropertyType;
  region: RegionSlug;
  price: string;
  priceUnit: string;
  bedrooms: number;
  sizeBuilt: number;
  sizeLand?: number;
  bathrooms?: number;
  parking?: boolean;
  imageEmoji: string;
  bgGradient: string;
  status: 'active' | 'sold' | 'rented' | 'pending';
  features: string[];
  primaryImage?: string;
  images?: string[];
  agentName?: string;
  agentPhoto?: string;
  agentPhone?: string;
  agent_photo?: string;
  agent_name?: string;
  agent_bio?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_phone_2?: string;
  contact_phone_3?: string;
  views?: number;
  priceRaw?: number;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  deposit_price?: number | string | null;
  monthly_rent?: number | string | null;
  depositPrice?: number | string | null;
  monthlyRent?: number | string | null;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  category: BlogCategory;
  date: string;
  readTime: string;
  excerpt: string;
  imageEmoji: string;
  bgGradient: string;
  views: number;
  author: string;
  content?: string;
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
}

export interface RegionInfo {
  slug: RegionSlug;
  name: string;
  emoji: string;
  icon?: string;
  description: string;
  shortDescription: string;
  listingsCount: number;
  avgPrice: string;
  popularProperty: string;
  page_title?: string;
}
