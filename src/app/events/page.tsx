'use client';

import { useQuery } from '@tanstack/react-query';
import { eventService } from '@/lib/api/services';
import { EventCard } from '@/components/cards/EventCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

export default function EventsPage() {
  const { t } = useLanguage();

  // Fetch all events
  const { data: events, isLoading } = useQuery({
    queryKey: ['events', 'all'],
    queryFn: () => eventService.getAll(),
  });

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-2">
            {t('common.events')}
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Discover upcoming concerts, festivals, and cultural events in Gevgelija
          </p>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events && events.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {events.length} event{events.length !== 1 ? 's' : ''} found
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-light-text-secondary dark:text-dark-text-secondary">
            <p>No events available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
