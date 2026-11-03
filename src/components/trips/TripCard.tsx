import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ImagePlaceholder } from '@/components/ui/primitives';
import { money } from '@/lib/format';
import type { Trip } from '@/lib/trips';

const pricingLabels = {
  fixed: 'Fixed price',
  distance: 'Distance priced',
  enquiry: 'Price on request',
} as const;

export function TripCard({ trip, variant = 'grid' }: { trip: Trip; variant?: 'grid' | 'list' }) {
  const isListCard = variant === 'list';

  return (
    <Link
      href={`/trips/${trip.slug}`}
      className={`group flex overflow-hidden rounded-3xl border border-line bg-ink-soft transition duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold ${
        isListCard ? 'flex-col md:min-h-[250px] md:flex-row' : 'flex-col'
      }`}
    >
      <div className={`relative shrink-0 overflow-hidden ${isListCard ? 'aspect-[16/8] md:w-[38%] md:aspect-auto' : 'aspect-[16/9]'}`}>
        {trip.coverUrl ? (
          // External trip images are managed by the API, so a native image avoids a fixed host allow-list.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={trip.coverUrl}
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={trip.title} className="h-full w-full" />
        )}
        <span className="absolute left-5 top-5 rounded-full border border-gold/40 bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold backdrop-blur">
          {trip.region}
        </span>
      </div>

      <div className={`flex flex-1 flex-col ${isListCard ? 'p-7 md:p-9' : 'p-8'}`}>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{pricingLabels[trip.pricingMode]}</p>
        <div className="mt-5 flex items-start justify-between gap-4">
          <h2 className={`leading-tight ${isListCard ? 'text-3xl md:text-4xl' : 'text-3xl'}`}>{trip.title}</h2>
          <ArrowUpRight className="mt-1 shrink-0 text-gold transition group-hover:translate-x-1 group-hover:-translate-y-1" size={19} />
        </div>
        <p className="mt-4 text-base text-ivory/80">{trip.subtitle}</p>
        <p className="mt-4 leading-relaxed text-mute">{trip.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-5 border-t hairline pt-6">
          {trip.startingFromPriceMinor !== null ? (
            <p className="inline-flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-[10px] uppercase tracking-[0.25em] text-mute">From</span>
              <span className="font-serif text-2xl text-gold">{money(trip.startingFromPriceMinor)}</span>
            </p>
          ) : (
            <span className="text-xs text-mute">Tailored to your journey</span>
          )}
          <span className="text-xs uppercase tracking-[0.25em] text-ivory/60 transition group-hover:text-gold">View trip →</span>
        </div>
      </div>
    </Link>
  );
}
