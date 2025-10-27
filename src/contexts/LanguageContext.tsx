'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { languageService } from '@/lib/api/services';
import { getGuestIdAsync } from '@/lib/auth/tokens';

type Language = 'en' | 'mk';

interface LanguageContextType {
  language: Language;
  isLoading: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  toggleLanguage: () => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations (will be expanded with API integration)
const translations: Record<Language, Record<string, string>> = {
  en: {
    'common.home': 'Home',
    'common.search': 'Search',
    'common.events': 'Events',
    'common.promotions': 'Promotions',
    'common.profile': 'Profile',
    'common.listings': 'Listings',
    'common.blog': 'Blog',
    'common.wishlist': 'Wishlist',
    'common.login': 'Login',
    'common.logout': 'Logout',
    'common.guest': 'Continue as Guest',
    'common.welcome': 'Welcome',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.viewAll': 'View All',
    'common.featured': 'Featured',
    'common.seeAll': 'See All',
    'home.greeting.morning': 'Good Morning',
    'home.greeting.afternoon': 'Good Afternoon',
    'home.greeting.evening': 'Good Evening',
    'home.upcomingEvents': 'Upcoming Events',
    'home.promotions': 'Special Promotions',
    'home.latestArticles': 'Latest Articles',
  },
  mk: {
    'common.home': 'Почетна',
    'common.search': 'Пребарај',
    'common.events': 'Настани',
    'common.promotions': 'Промоции',
    'common.profile': 'Профил',
    'common.listings': 'Листинзи',
    'common.blog': 'Блог',
    'common.wishlist': 'Омилени',
    'common.login': 'Најава',
    'common.logout': 'Одјава',
    'common.guest': 'Продолжи како гостин',
    'common.welcome': 'Добредојдовте',
    'common.loading': 'Се вчитува...',
    'common.error': 'Грешка',
    'common.retry': 'Обиди се повторно',
    'common.viewAll': 'Видете ги сите',
    'common.featured': 'Издвоени',
    'common.seeAll': 'Видете ги сите',
    'home.greeting.morning': 'Добро утро',
    'home.greeting.afternoon': 'Добар ден',
    'home.greeting.evening': 'Добра вечер',
    'home.upcomingEvents': 'Претстојни настани',
    'home.promotions': 'Специјални промоции',
    'home.latestArticles': 'Најнови статии',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('gogevgelija_language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'mk')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      setIsLoading(true);
      localStorage.setItem('gogevgelija_language', lang);
      setLanguageState(lang);

      // Update API preference
      const guestId = await getGuestIdAsync();
      await languageService.updateLanguagePreference({
        language: lang,
        guest_id: guestId,
      });
    } catch (error) {
      console.error('Error setting language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'mk' : 'en';
    await setLanguage(newLang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    isLoading,
    setLanguage,
    toggleLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
