import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { ImagePlaceholder } from '@/components/ui/primitives';
import { money } from '@/lib/format';
import type { Trip } from '@/lib/trips';

const pricingLabels = {
  fixed: 'Fixed-price journey',
  distance: 'Route-based pricing',
  enquiry: 'Tailored on request',
} as const;

export function TripCard({ trip }: { trip: Trip }) {
  const price = trip.pricingMode === 'fixed' && trip.startingFromPriceMinor !== null
    ? money(trip.startingFromPriceMinor)
    : trip.pricingMode === 'enquiry' ? 'On request' : 'Quote for your route';

  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#0d1b2a]/10 bg-white shadow-[0_14px_32px_-24px_rgba(13,27,42,0.52)] transition duration-300 hover:-translate-y-1 hover:border-[#f1c75b]/80 hover:shadow-[0_20px_40px_-24px_rgba(13,27,42,0.52)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e9e2d5]">
        {trip.coverUrl ? (
          // External trip imagery is managed by the API, so a native image avoids a fixed host allow-list.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={trip.coverUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <ImagePlaceholder label={trip.title} className="h-full w-full" />
        )}
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#0d1b2a]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
          <MapPin size={11} className="text-[#f1c75b]" /> {trip.region}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#9b7012]">{pricingLabels[trip.pricingMode]}</p>
        <h2 className="mt-3 font-serif text-[28px] font-semibold leading-[0.98] tracking-[-0.015em] text-[#0d1b2a]">{trip.title}</h2>
        <p className="mt-3 text-[13px] font-semibold leading-relaxed text-[#40516b]">{trip.subtitle}</p>
        <p className="mt-2 text-[12px] leading-relaxed text-slate-600">{trip.summary}</p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#0d1b2a]/10 pt-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">{trip.pricingMode === 'fixed' ? 'From' : 'Pricing'}</p>
            <p className="mt-1 font-serif text-2xl font-semibold leading-none text-[#0d1b2a]">{price}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a] transition group-hover:bg-[#e0b54a] group-hover:translate-x-0.5"><ArrowRight size={16} strokeWidth={2.4} /></span>
        </div>
      </div>
    </Link>
  );
}
