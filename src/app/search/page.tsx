'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listingService, categoryService } from '@/lib/api/services';
import { ListingCard } from '@/components/cards/ListingCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function SearchPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  // Fetch all listings
  const { data: listings, isLoading } = useQuery({
    queryKey: ['listings', 'all'],
    queryFn: () => listingService.getAll(),
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories', 'listings'],
    queryFn: () => categoryService.getForListings(),
  });

  // Filter listings
  const filteredListings = listings?.filter((listing) => {
    const matchesSearch = searchQuery
      ? listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = selectedCategory
      ? listing.category?.id === parseInt(selectedCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-2">
            {t('common.search')} {t('common.listings')}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Discover restaurants, hotels, and attractions in Gevgelija
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-light-card dark:bg-dark-card rounded-lg p-4 shadow-sm border border-light-border dark:border-dark-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" />
              <Input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary pointer-events-none" />
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || undefined)}
                className="flex h-12 w-full rounded-lg border px-4 pl-10 py-2 text-base bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory) && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                Active filters:
              </span>
              {searchQuery && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory && categories && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                  {categories.find((c) => c.id === parseInt(selectedCategory))?.name}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(undefined);
                }}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredListings && filteredListings.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Showing {filteredListings.length} result{filteredListings.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
              No listings found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(undefined);
              }}
              className="text-primary hover:text-primary/80 font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
