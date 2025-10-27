export interface Category {
  id: number;
  name: string;
  name_en?: string;
  name_mk?: string;
  slug?: string;
  icon: string;
  image?: string;
  color?: string;

  // Hierarchy
  parent_id: number | null;
  level?: number;
  order?: number;

  // Visibility & Behavior
  is_active?: boolean;
  show_in_search?: boolean;
  show_in_navigation?: boolean;
  trending: boolean;
  featured?: boolean;

  // Scope
  applies_to?: ('listing' | 'event' | 'both')[];

  // Metadata
  description?: string;
  description_en?: string;
  description_mk?: string;
  item_count?: number;

  // Relations
  children?: Category[];
  parent?: Category;

  created_at: string;
  updated_at?: string;
}

export interface ListingAmenity {
  icon?: string;
  text: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  address: string;
  open_time: string | null;
  working_hours?: { [key: string]: string } | { working_hours?: { [key: string]: string } } | null;
  show_open_status?: boolean;
  is_open?: boolean;
  category: Category | null;
  tags?: string[] | { tags?: string[] } | string | null;
  amenities_title?: string;
  amenities?: ListingAmenity[] | string[] | null;
  image: string;
  images?: string[];
  image_thumbnail?: string | null;
  image_medium?: string | null;
  images_medium?: string[];
  phone_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  website_url?: string;
  featured: boolean;
  promotions?: Promotion[];
  events?: Event[];
  created_at: string;
  updated_at: string;
  rating?: number | string | null;
  can_edit?: boolean;
}

export interface EventExpectation {
  icon: string;
  text: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date_time: string;
  location: string;
  image?: string;
  images?: string[];
  image_thumbnail?: string | null;
  image_medium?: string | null;
  cover_image?: string;
  entry_price: string;
  category: Category | null;
  age_limit: string;
  expectations: EventExpectation[];
  join_count: number;
  has_joined: boolean;
  featured: boolean;
  is_active?: boolean;
  show_join_button: boolean;
  phone_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  website_url?: string;
  listings?: Listing[];
  created_at: string;
  updated_at: string;
}

export interface MinimalListing {
  id: number;
  title: string;
  address: string;
  image: string | null;
  image_thumbnail?: string | null;
}

export interface MinimalEvent {
  id: number;
  title: string;
  date_time: string;
  location: string;
  image?: string;
  image_thumbnail?: string | null;
  category?: Category | null;
  entry_price?: string;
}

export interface Promotion {
  id: number;
  title: string;
  description: string;
  has_discount_code: boolean;
  discount_code: string;
  tags?: string[] | { tags?: string[] } | string | null;
  image: string;
  images?: string[];
  image_thumbnail?: string | null;
  image_medium?: string | null;
  valid_until: string | null;
  featured: boolean;
  website?: string;
  phone_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  address?: string;
  listings?: MinimalListing[];
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  category: string;
  tags?: string[] | { tags?: string[] } | string | null;
  image?: string;
  images?: string[];
  image_thumbnail?: string | null;
  image_medium?: string | null;
  cover_image?: string;
  read_time_minutes: number;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  item_type: 'listing' | 'event' | 'promotion' | 'blog';
  item_data: Listing | Event | Promotion | Blog;
  created_at: string;
}

export interface WishlistAddRequest {
  item_type: 'listing' | 'event' | 'promotion' | 'blog';
  item_id: number;
}

export interface WishlistRemoveRequest {
  item_type: 'listing' | 'event' | 'promotion' | 'blog';
  item_id: number;
}

export interface UserPermission {
  id: number;
  user: User;
  listing: Listing;
  can_edit: boolean;
  granted_by: User;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
  profile?: {
    language_preference?: string;
    avatar?: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface EditListingRequest {
  // Base fields (non-translatable)
  working_hours?: { [key: string]: string };
  category?: string;
  tags?: string[];
  amenities_title?: string;
  amenities?: ListingAmenity[] | string[] | null;
  phone_number?: string;
  facebook_url?: string;
  instagram_url?: string;
  website_url?: string;

  // Bilingual fields
  title_en?: string;
  title_mk?: string;
  description_en?: string;
  description_mk?: string;
  address_en?: string;
  address_mk?: string;
  open_time_en?: string;
  open_time_mk?: string;
  working_hours_mk?: { [key: string]: string };
  tags_mk?: string[];
  amenities_title_mk?: string;
  amenities_mk?: ListingAmenity[] | string[] | null;
}

// Pagination response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Error types
export interface ApiError {
  error?: string;
  detail?: string;
  requires_auth?: boolean;
}
