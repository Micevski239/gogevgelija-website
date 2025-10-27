'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { authService, userService } from '@/lib/api/services';
import { saveTokens, saveGuestId, clearAuth, getUserFromToken } from '@/lib/auth/tokens';

interface AuthContextType {
  authed: boolean;
  loading: boolean;
  transitioning: boolean;
  user: User | null;
  isGuest: boolean;
  guestId: string | undefined;
  apiError: string | null;
  signIn: (email: string, code: string) => Promise<void>;
  signUp: (email: string, name: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  restartApp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestId, setGuestId] = useState<string | undefined>(undefined);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      const tokenUser = await getUserFromToken();

      if (tokenUser) {
        // Try to fetch full user profile
        try {
          const fullUser = await userService.getProfile();
          setUser(fullUser);
          setAuthed(true);
          setIsGuest(false);
        } catch (error) {
          // Token might be expired, clear it
          await clearAuth();
          setAuthed(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, code: string) => {
    try {
      setTransitioning(true);
      setApiError(null);

      const response = await authService.verifyCode({ email, code });

      await saveTokens(response.access, response.refresh);
      setUser(response.user);
      setAuthed(true);
      setIsGuest(false);

      router.push('/');
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.response?.data?.detail || 'Invalid verification code';
      setApiError(message);
      throw new Error(message);
    } finally {
      setTransitioning(false);
    }
  };

  const signUp = async (email: string, name: string, code: string) => {
    try {
      setTransitioning(true);
      setApiError(null);

      const response = await authService.verifyCode({ email, code, name });

      await saveTokens(response.access, response.refresh);
      setUser(response.user);
      setAuthed(true);
      setIsGuest(false);

      router.push('/');
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.response?.data?.detail || 'Registration failed';
      setApiError(message);
      throw new Error(message);
    } finally {
      setTransitioning(false);
    }
  };

  const signOut = async () => {
    try {
      setTransitioning(true);
      await clearAuth();
      setAuthed(false);
      setUser(null);
      setIsGuest(false);
      setGuestId(undefined);
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setTransitioning(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (authed && !isGuest) {
        const freshUser = await userService.getProfile();
        setUser(freshUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const loginAsGuest = async () => {
    try {
      setTransitioning(true);
      setApiError(null);

      const response = await authService.loginAsGuest();

      await saveGuestId(response.guest_id);
      setGuestId(response.guest_id);
      setIsGuest(true);
      setAuthed(false);
      setUser(null);

      router.push('/');
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Guest login failed';
      setApiError(message);
      throw new Error(message);
    } finally {
      setTransitioning(false);
    }
  };

  const restartApp = () => {
    setApiError(null);
    initializeAuth();
  };

  const value: AuthContextType = {
    authed,
    loading,
    transitioning,
    user,
    isGuest,
    guestId,
    apiError,
    signIn,
    signUp,
    signOut,
    refreshUser,
    loginAsGuest,
    restartApp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
