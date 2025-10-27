import { api } from './client';
import {
  Category,
  Listing,
  Event,
  Promotion,
  Blog,
  WishlistItem,
  WishlistAddRequest,
  WishlistRemoveRequest,
  UserPermission,
  User,
  EditListingRequest,
  PaginatedResponse,
} from '@/types';

export const categoryService = {
  // Get all categories (flat list)
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/api/categories/');
    return response.data.results || response.data;
  },

  // Get hierarchical tree structure
  getTree: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/api/categories/tree/');
      return response.data.results || response.data;
    } catch (error) {
      // Fallback to flat list if tree endpoint doesn't exist yet
      console.warn('Tree endpoint not available, falling back to flat list');
      return categoryService.getAll();
    }
  },

  // Get root categories only (parent_id = null)
  getRoot: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/api/categories/root/');
      return response.data.results || response.data;
    } catch (error) {
      // Fallback: filter locally
      const all = await categoryService.getAll();
      return all.filter((c) => !c.parent_id);
    }
  },

  // Get single category by ID
  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/api/categories/${id}/`);
    return response.data;
  },

  // Get children of a category
  getChildren: async (parentId: number): Promise<Category[]> => {
    try {
      const response = await api.get(`/api/categories/${parentId}/children/`);
      return response.data.results || response.data;
    } catch (error) {
      // Fallback: filter locally
      const all = await categoryService.getAll();
      return all.filter((c) => c.parent_id === parentId);
    }
  },

  // Get ancestors (breadcrumb path)
  getAncestors: async (categoryId: number): Promise<Category[]> => {
    try {
      const response = await api.get(`/api/categories/${categoryId}/ancestors/`);
      return response.data.results || response.data;
    } catch (error) {
      // Fallback: build path locally
      const all = await categoryService.getAll();
      const category = all.find((c) => c.id === categoryId);
      if (!category) return [];

      const ancestors: Category[] = [];
      let current = category;
      while (current.parent_id) {
        const parent = all.find((c) => c.id === current.parent_id);
        if (!parent) break;
        ancestors.unshift(parent);
        current = parent;
      }
      return ancestors;
    }
  },

  // Get categories for listings
  getForListings: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/api/categories/for-listings/');
      return response.data.results || response.data;
    } catch (error) {
      // Fallback: filter locally
      const all = await categoryService.getAll();
      return all.filter(
        (c) =>
          !c.applies_to ||
          c.applies_to.includes('listing') ||
          c.applies_to.includes('both')
      );
    }
  },

  // Get categories for events
  getForEvents: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/api/categories/for-events/');
      return response.data.results || response.data;
    } catch (error) {
      // Fallback: filter locally
      const all = await categoryService.getAll();
      return all.filter(
        (c) =>
          !c.applies_to ||
          c.applies_to.includes('event') ||
          c.applies_to.includes('both')
      );
    }
  },

  // Get featured categories
  getFeatured: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/api/categories/featured/');
      return response.data.results || response.data;
    } catch (error) {
      // Fallback: filter locally
      const all = await categoryService.getAll();
      return all.filter((c) => c.featured);
    }
  },

  // Get trending categories
  getTrending: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/api/categories/trending/');
      return response.data.results || response.data;
    } catch (error) {
      // Fallback: filter locally
      const all = await categoryService.getAll();
      return all.filter((c) => c.trending);
    }
  },
};

export const listingService = {
  getAll: async (): Promise<Listing[]> => {
    const response = await api.get('/api/listings/');
    return response.data.results || response.data;
  },

  getPage: async (
    page: number = 1,
    pageSize: number = 20,
    filters?: { category?: string }
  ): Promise<PaginatedResponse<Listing>> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (filters?.category) params.append('category', filters.category);
    const response = await api.get(`/api/listings/?${params}`);

    // Handle both paginated and non-paginated responses
    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data,
      };
    }

    return response.data;
  },

  getFeatured: async (): Promise<Listing[]> => {
    const response = await api.get('/api/listings/featured/');
    return response.data;
  },

  getByCategory: async (category: string): Promise<Listing[]> => {
    const response = await api.get(`/api/listings/?category=${category}`);
    return response.data.results || response.data;
  },

  getById: async (id: number): Promise<Listing> => {
    const response = await api.get(`/api/listings/${id}/`);
    return response.data;
  },

  update: async (id: number, data: EditListingRequest): Promise<Listing> => {
    const response = await api.patch(`/api/listings/${id}/edit/`, data);
    return response.data;
  },
};

export const eventService = {
  getAll: async (): Promise<Event[]> => {
    const response = await api.get('/api/events/');
    return response.data.results || response.data;
  },

  getPage: async (
    page: number = 1,
    pageSize: number = 20,
    filters?: { category?: string }
  ): Promise<PaginatedResponse<Event>> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (filters?.category) params.append('category', filters.category);
    const response = await api.get(`/api/events/?${params}`);

    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data,
      };
    }

    return response.data;
  },

  getFeatured: async (): Promise<Event[]> => {
    const response = await api.get('/api/events/featured/');
    return response.data;
  },

  getById: async (id: number): Promise<Event> => {
    const response = await api.get(`/api/events/${id}/`);
    return response.data;
  },

  join: async (id: number): Promise<void> => {
    await api.post(`/api/events/${id}/join/`);
  },

  unjoin: async (id: number): Promise<void> => {
    await api.post(`/api/events/${id}/unjoin/`);
  },
};

export const promotionService = {
  getAll: async (): Promise<Promotion[]> => {
    const response = await api.get('/api/promotions/');
    return response.data.results || response.data;
  },

  getPage: async (
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Promotion>> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    const response = await api.get(`/api/promotions/?${params}`);

    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data,
      };
    }

    return response.data;
  },

  getFeatured: async (): Promise<Promotion[]> => {
    const response = await api.get('/api/promotions/featured/');
    return response.data;
  },

  getById: async (id: number): Promise<Promotion> => {
    const response = await api.get(`/api/promotions/${id}/`);
    return response.data;
  },
};

export const blogService = {
  getAll: async (): Promise<Blog[]> => {
    const response = await api.get('/api/blogs/');
    return response.data.results || response.data;
  },

  getPage: async (
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Blog>> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    const response = await api.get(`/api/blogs/?${params}`);

    if (Array.isArray(response.data)) {
      return {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data,
      };
    }

    return response.data;
  },

  getFeatured: async (): Promise<Blog[]> => {
    const response = await api.get('/api/blogs/featured/');
    return response.data;
  },

  getById: async (id: number): Promise<Blog> => {
    const response = await api.get(`/api/blogs/${id}/`);
    return response.data;
  },
};

export const wishlistService = {
  getAll: async (): Promise<WishlistItem[]> => {
    const response = await api.get('/api/wishlist/');
    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.results)) {
      return data.results;
    }

    console.warn('wishlistService.getAll received unexpected payload shape', data);
    return [];
  },

  add: async (request: WishlistAddRequest): Promise<WishlistItem> => {
    const response = await api.post('/api/wishlist/', request);
    const data = response.data;

    if (Array.isArray(data)) {
      const matchedItem = data.find(
        (item: WishlistItem) =>
          item?.item_type === request.item_type &&
          item?.item_data?.id === request.item_id
      );

      return matchedItem ?? data[0];
    }

    return data as WishlistItem;
  },

  remove: async (request: WishlistRemoveRequest): Promise<void> => {
    await api.post('/api/wishlist/remove/', request);
  },
};

export interface UpdateProfileRequest {
  username?: string;
  current_password?: string;
  new_password?: string;
  avatar?: string;
}

export interface LanguagePreferenceResponse {
  language: string;
  is_guest?: boolean;
}

export interface LanguageUpdateRequest {
  language: string;
  guest_id?: string;
}

export const languageService = {
  getLanguagePreference: async (
    guestId?: string
  ): Promise<LanguagePreferenceResponse> => {
    const url = guestId
      ? `/api/auth/language/?guest_id=${guestId}`
      : '/api/auth/language/';
    const response = await api.get(url);
    return response.data;
  },

  updateLanguagePreference: async (
    request: LanguageUpdateRequest
  ): Promise<LanguagePreferenceResponse> => {
    try {
      const response = await api.post('/api/auth/language/', request);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 405) {
        const fallbackResponse = await api.put('/api/auth/language/', request);
        return fallbackResponse.data;
      }
      throw error;
    }
  },
};

export const userService = {
  updateProfile: async (request: UpdateProfileRequest): Promise<User> => {
    const response = await api.put('/api/auth/profile/', request);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/auth/profile/');
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await api.get('/api/admin/users/');
    return response.data;
  },
};

export const permissionService = {
  grantEditPermission: async (
    userId: number,
    listingId: number
  ): Promise<UserPermission> => {
    const response = await api.post('/api/admin/permissions/', {
      user_id: userId,
      listing_id: listingId,
      can_edit: true,
    });
    return response.data;
  },

  revokeEditPermission: async (permissionId: number): Promise<void> => {
    await api.delete(`/api/admin/permissions/${permissionId}/`);
  },

  getListingPermissions: async (listingId: number): Promise<UserPermission[]> => {
    const response = await api.get(
      `/api/admin/permissions/by_listing/?listing_id=${listingId}`
    );
    return response.data;
  },

  getUserPermissions: async (userId: number): Promise<UserPermission[]> => {
    const response = await api.get(
      `/api/admin/permissions/by_user/?user_id=${userId}`
    );
    return response.data;
  },

  getAllPermissions: async (): Promise<UserPermission[]> => {
    const response = await api.get('/api/admin/permissions/');
    return response.data;
  },
};

// Auth service for web
export interface SendCodeRequest {
  email: string;
  name?: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
  name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface GuestResponse {
  guest_id: string;
  language_preference: string;
}

export const authService = {
  sendCode: async (request: SendCodeRequest): Promise<void> => {
    await api.post('/api/auth/send-code/', request);
  },

  verifyCode: async (request: VerifyCodeRequest): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/verify-code/', request);
    return response.data;
  },

  register: async (email: string, name: string): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/register/', { email, name });
    return response.data;
  },

  loginAsGuest: async (): Promise<GuestResponse> => {
    const response = await api.post('/api/auth/guest/');
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me/');
    return response.data;
  },
};
