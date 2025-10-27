'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { Heart, Calendar, MapPin, Users } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { Card } from '../ui/Card';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist('event', event.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      await removeFromWishlist({ item_type: 'event', item_id: event.id });
    } else {
      await addToWishlist({ item_type: 'event', item_id: event.id });
    }
  };

  const imageUrl = event.image_medium || event.image || event.cover_image || '/placeholder.jpg';

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer h-full">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-light-surface dark:bg-dark-surface">
          <Image
            src={imageUrl}
            alt={event.title}
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
          {event.featured && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded-sm bg-primary text-white text-xs font-semibold shadow-md">
              FEATURED
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Category */}
          {event.category && (
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">
              {event.category.name}
            </p>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-2 line-clamp-2">
            {event.title}
          </h3>

          {/* Event Info */}
          <div className="space-y-1">
            {/* Date & Time */}
            {event.date_time && (
              <div className="flex items-center gap-1.5 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <Calendar className="h-3.5 w-3.5" />
                <span>{event.date_time}</span>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-1.5 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <MapPin className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}

            {/* Join Count */}
            {event.join_count > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                <Users className="h-3.5 w-3.5" />
                <span>{event.join_count} joined</span>
              </div>
            )}
          </div>

          {/* Entry Price */}
          {event.entry_price && (
            <div className="mt-2 text-sm font-semibold text-primary">
              {event.entry_price}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
