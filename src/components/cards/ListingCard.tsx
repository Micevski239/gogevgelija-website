'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/types';
import { Heart, MapPin } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { Card } from '../ui/Card';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist('listing', listing.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      await removeFromWishlist({ item_type: 'listing', item_id: listing.id });
    } else {
      await addToWishlist({ item_type: 'listing', item_id: listing.id });
    }
  };

  const imageUrl = listing.image_medium || listing.image || '/placeholder.jpg';

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-light-surface dark:bg-dark-surface">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-md z-10"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`h-4 w-4 ${
                inWishlist
                  ? 'fill-primary text-primary'
                  : 'text-light-text-secondary dark:text-dark-text-secondary'
              }`}
            />
          </button>

          {/* Featured Badge */}
          {listing.featured && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded-sm bg-primary text-white text-xs font-semibold shadow-md">
              FEATURED
            </div>
          )}

          {/* Open/Closed Status */}
          {listing.show_open_status && (
            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-sm text-xs font-semibold shadow-md">
              {listing.is_open ? (
                <span className="bg-success-light text-success-text px-2 py-0.5 rounded">
                  Open
                </span>
              ) : (
                <span className="bg-error-light text-error-text px-2 py-0.5 rounded">
                  Closed
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Category */}
          {listing.category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              {listing.category.name}
            </p>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-1 line-clamp-1">
            {listing.title}
          </h3>

          {/* Address */}
          {listing.address && (
            <div className="flex items-center gap-1 text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{listing.address}</span>
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-2">
              {listing.description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
