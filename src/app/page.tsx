'use client';

import { useQuery } from '@tanstack/react-query';
import { listingService, eventService, promotionService } from '@/lib/api/services';
import { ListingCard } from '@/components/cards/ListingCard';
import { EventCard } from '@/components/cards/EventCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const { user, authed, isGuest } = useAuth();

  // Fetch featured listings
  const { data: featuredListings, isLoading: listingsLoading } = useQuery({
    queryKey: ['listings', 'featured'],
    queryFn: () => listingService.getFeatured(),
  });

  // Fetch featured events
  const { data: featuredEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: () => eventService.getFeatured(),
  });

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting.morning');
    if (hour < 18) return t('home.greeting.afternoon');
    return t('home.greeting.evening');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-light-bg dark:via-dark-bg to-accent/10 dark:from-primary-dark/10 dark:to-accent-dark/10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {/* Greeting */}
            {authed && user && (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                {getGreeting()},
              </p>
            )}

            {/* Main Heading */}
            <h1 className="text-3xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-4">
              {authed && user ? (
                <>
                  {user.username || user.email}!
                </>
              ) : isGuest ? (
                <>Welcome to GoGevgelija</>
              ) : (
                <>Discover Gevgelija</>
              )}
            </h1>

            <p className="text-lg md:text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8">
              Explore the best restaurants, events, promotions, and local stories in Gevgelija, North Macedonia
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/search"
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg inline-flex items-center justify-center gap-2"
              >
                Explore Listings
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/events"
                className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-all inline-flex items-center justify-center gap-2"
              >
                View Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-12 bg-light-bg dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text">
              {t('common.featured')} {t('common.listings')}
            </h2>
            <Link
              href="/search"
              className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1 transition-colors"
            >
              {t('common.seeAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {listingsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredListings && featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredListings.slice(0, 8).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-light-text-secondary dark:text-dark-text-secondary">
              <p>No featured listings available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-12 bg-light-surface dark:bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text">
              {t('home.upcomingEvents')}
            </h2>
            <Link
              href="/events"
              className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1 transition-colors"
            >
              {t('common.seeAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {eventsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredEvents && featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredEvents.slice(0, 4).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-light-text-secondary dark:text-dark-text-secondary">
              <p>No upcoming events at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 bg-light-bg dark:bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/search?category=restaurants"
              className="p-6 bg-light-card dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border hover:shadow-md transition-all group"
            >
              <div className="text-4xl mb-3">🍽️</div>
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-primary transition-colors">
                Restaurants
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Discover local cuisine and dining experiences
              </p>
            </Link>

            <Link
              href="/events"
              className="p-6 bg-light-card dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border hover:shadow-md transition-all group"
            >
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-primary transition-colors">
                Events
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Find concerts, festivals, and cultural activities
              </p>
            </Link>

            <Link
              href="/promotions"
              className="p-6 bg-light-card dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border hover:shadow-md transition-all group"
            >
              <div className="text-4xl mb-3">🏷️</div>
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-primary transition-colors">
                Promotions
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Get the best deals and special offers
              </p>
            </Link>

            <Link
              href="/blog"
              className="p-6 bg-light-card dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border hover:shadow-md transition-all group"
            >
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-primary transition-colors">
                Blog
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Read travel guides and local stories
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
