'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { listingService } from '@/lib/api/services';
import { useWishlist } from '@/contexts/WishlistContext';
import { Loader2, Heart, MapPin, Phone, Globe, Facebook, Instagram, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingService.getById(id),
    enabled: !!id,
  });

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = listing ? isInWishlist('listing', listing.id) : false;

  const handleWishlistToggle = async () => {
    if (!listing) return;

    if (inWishlist) {
      await removeFromWishlist({ item_type: 'listing', item_id: listing.id });
    } else {
      await addToWishlist({ item_type: 'listing', item_id: listing.id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Listing not found
        </p>
        <Button onClick={() => router.push('/search')}>Back to Search</Button>
      </div>
    );
  }

  const images = [
    listing.image,
    listing.images_medium?.[0],
    listing.images_medium?.[1],
    listing.images_medium?.[2],
    listing.images_medium?.[3],
  ].filter((img): img is string => Boolean(img));

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Image Gallery */}
      <div className="w-full aspect-[21/9] relative bg-light-surface dark:bg-dark-surface">
        {images.length > 0 && (
          <Image
            src={images[0]}
            alt={listing.title}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {listing.category && (
                <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                  {listing.category.name}
                </p>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-2">
                {listing.title}
              </h1>
              {listing.address && (
                <div className="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.address}</span>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="h-12 w-12 rounded-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
            >
              <Heart
                className={`h-5 w-5 ${
                  inWishlist
                    ? 'fill-primary text-primary'
                    : 'text-light-text-secondary dark:text-dark-text-secondary'
                }`}
              />
            </button>
          </div>

          {/* Open Status */}
          {listing.show_open_status && (
            <div className="mb-6">
              {listing.is_open ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-light rounded-lg">
                  <span className="h-2 w-2 rounded-full bg-success-text"></span>
                  <span className="text-sm font-semibold text-success-text">Open Now</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-error-light rounded-lg">
                  <span className="h-2 w-2 rounded-full bg-error-text"></span>
                  <span className="text-sm font-semibold text-error-text">Closed</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-3">
                About
              </h2>
              <p className="text-base text-light-text dark:text-dark-text leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border mb-8">
            <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              {listing.phone_number && (
                <a
                  href={`tel:${listing.phone_number}`}
                  className="flex items-center gap-3 text-light-text dark:text-dark-text hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>{listing.phone_number}</span>
                </a>
              )}
              {listing.website_url && (
                <a
                  href={listing.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-light-text dark:text-dark-text hover:text-primary transition-colors"
                >
                  <Globe className="h-5 w-5" />
                  <span>Visit Website</span>
                </a>
              )}
              {listing.facebook_url && (
                <a
                  href={listing.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-light-text dark:text-dark-text hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </a>
              )}
              {listing.instagram_url && (
                <a
                  href={listing.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-light-text dark:text-dark-text hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>

          {/* Amenities */}
          {listing.amenities && Array.isArray(listing.amenities) && listing.amenities.length > 0 && (
            <div className="bg-light-card dark:bg-dark-card rounded-lg p-6 border border-light-border dark:border-dark-border">
              <h2 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
                {listing.amenities_title || 'Amenities'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listing.amenities.map((amenity, index) => {
                  const amenityText = typeof amenity === 'string' ? amenity : amenity.text;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-light-text dark:text-dark-text"
                    >
                      <span className="text-primary">✓</span>
                      <span>{amenityText}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
