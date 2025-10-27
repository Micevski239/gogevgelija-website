'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Moon, Sun, User, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { authed, user, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('common.home') },
    { href: '/search', label: t('common.search') },
    { href: '/events', label: t('common.events') },
    { href: '/promotions', label: t('common.promotions') },
    { href: '/blog', label: t('common.blog') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-light-border dark:border-dark-border bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur supports-[backdrop-filter]:bg-light-bg/60 dark:supports-[backdrop-filter]:bg-dark-bg/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-light-text dark:text-dark-text">
              GoGevgelija
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
              title={language === 'en' ? 'Switch to Macedonian' : 'Switch to English'}
            >
              <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                {language.toUpperCase()}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-light-text dark:text-dark-text" />
              ) : (
                <Moon className="h-5 w-5 text-light-text dark:text-dark-text" />
              )}
            </button>

            {/* Wishlist */}
            {authed && (
              <Link
                href="/profile/wishlist"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                title={t('common.wishlist')}
              >
                <Heart className="h-5 w-5 text-light-text dark:text-dark-text" />
              </Link>
            )}

            {/* User Menu */}
            {authed ? (
              <Link
                href="/profile"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                title={user?.username || 'Profile'}
              >
                {user?.profile?.avatar ? (
                  <span className="text-lg">{user.profile.avatar}</span>
                ) : (
                  <User className="h-5 w-5 text-light-text dark:text-dark-text" />
                )}
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" className="hidden sm:inline-flex">
                  {t('common.login')}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-light-text dark:text-dark-text" />
              ) : (
                <Menu className="h-5 w-5 text-light-text dark:text-dark-text" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-light-border dark:border-dark-border py-4 animate-slide-down">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-light-border dark:border-dark-border my-2" />
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-left text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
              >
                {language === 'en' ? 'Македонски' : 'English'}
              </button>
              <button
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-left text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
              {authed ? (
                <>
                  <Link
                    href="/profile/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-left text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                  >
                    {t('common.wishlist')}
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-left text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
                  >
                    {t('common.profile')}
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-left text-error hover:bg-error-light transition-colors"
                  >
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-left bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  {t('common.login')}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
