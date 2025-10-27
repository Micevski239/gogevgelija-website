'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem, WishlistAddRequest, WishlistRemoveRequest } from '@/types';
import { wishlistService } from '@/lib/api/services';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  error: string | null;
  addToWishlist: (request: WishlistAddRequest) => Promise<void>;
  removeFromWishlist: (request: WishlistRemoveRequest) => Promise<void>;
  isInWishlist: (itemType: string, itemId: number) => boolean;
  clearWishlist: () => void;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { authed, isGuest } = useAuth();
  const { showToast } = useToast();

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (authed && !isGuest) {
      refreshWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [authed, isGuest]);

  const refreshWishlist = async () => {
    if (!authed || isGuest) return;

    try {
      setLoading(true);
      setError(null);
      const items = await wishlistService.getAll();
      setWishlistItems(items);
    } catch (err: any) {
      console.error('Error loading wishlist:', err);
      setError(err?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (request: WishlistAddRequest) => {
    if (!authed || isGuest) {
      showToast('Please login to add items to wishlist', 'error');
      return;
    }

    try {
      setError(null);
      const newItem = await wishlistService.add(request);
      setWishlistItems((prev) => [...prev, newItem]);
      showToast('Added to wishlist', 'success');
    } catch (err: any) {
      console.error('Error adding to wishlist:', err);
      const message = err?.response?.data?.error || 'Failed to add to wishlist';
      setError(message);
      showToast(message, 'error');
    }
  };

  const removeFromWishlist = async (request: WishlistRemoveRequest) => {
    if (!authed || isGuest) return;

    try {
      setError(null);
      // Optimistic update
      setWishlistItems((prev) =>
        prev.filter(
          (item) => !(item.item_type === request.item_type && item.item_data.id === request.item_id)
        )
      );

      await wishlistService.remove(request);
      showToast('Removed from wishlist', 'success');
    } catch (err: any) {
      console.error('Error removing from wishlist:', err);
      // Revert on error
      await refreshWishlist();
      const message = err?.response?.data?.error || 'Failed to remove from wishlist';
      setError(message);
      showToast(message, 'error');
    }
  };

  const isInWishlist = (itemType: string, itemId: number): boolean => {
    return wishlistItems.some(
      (item) => item.item_type === itemType && item.item_data.id === itemId
    );
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value: WishlistContextType = {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
