export interface Admin {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
  is_active: boolean;
  last_login: string;
  created_at: string;
}

export interface ListingImage {
  id: number;
  listing_id: number;
  filename: string;
  original_name: string;
  file_size: number;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Listing {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_desc: string;
  property_type: 'villa'|'garden'|'land'|'apartment'|'warehouse'|'shop'|'workshop';
  deal_type: 'sell'|'annual_rent'|'daily_rent'|'commercial_rent';
  region_id: number;
  region_name?: string;
  region_slug?: string;
  price: number | null;
  price_label: string;
  price_per_night: number | null;
  price_negotiable: boolean;
  size_built: number | null;
  size_land: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floors: number | null;
  floor_number: number | null;
  has_pool: boolean;
  has_garden: boolean;
  has_parking: boolean;
  has_elevator: boolean;
  has_storage: boolean;
  has_security: boolean;
  three_phase_power: boolean;
  truck_access: boolean;
  document_type: string;
  permit_status: string;
  address: string;
  map_lat: number | null;
  map_lng: number | null;
  nearby_notes: string;
  contact_name: string;
  contact_phone: string;
  status: 'active'|'sold'|'rented'|'pending'|'inactive';
  is_featured: boolean;
  is_investment: boolean;
  views: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  images?: ListingImage[];
  primary_image?: string;
}

export interface Inquiry {
  id: number;
  listing_id: number | null;
  listing_title?: string;
  listing_slug?: string;
  name: string;
  phone: string;
  message: string;
  inquiry_type: 'general'|'listing'|'investment'|'consult';
  deal_interest: string;
  is_read: boolean;
  is_archived: boolean;
  admin_note: string;
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  cover_alt: string;
  category: 'guide'|'price'|'investment'|'region'|'legal';
  admin_id: number;
  author_name?: string;
  related_listing_id: number | null;
  is_published: boolean;
  is_featured: boolean;
  views: number;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: number;
  slug: string;
  name_fa: string;
  emoji: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  active_listing_count?: number;
  created_at: string;
}

export type Settings = Record<string, string>;

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
