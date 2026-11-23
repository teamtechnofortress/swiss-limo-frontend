import Link from 'next/link';
import { ArrowRight, Luggage, Users } from 'lucide-react';
import { ImagePlaceholder } from '@/components/ui/primitives';
import { CATEGORY_LABEL, vehiclePriceSummary } from '@/lib/format';
import type { Vehicle } from '@/lib/types';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const cover = vehicle.media.cover;
  const image = cover?.thumbnail_url ?? cover?.url ?? vehicle.images[0];
  const price = vehiclePriceSummary(vehicle);
  const enquiryHref = `/contact?type=vehicle&vehicle=${encodeURIComponent(vehicle.slug)}`;
  const bookingHref = vehicle.price_on_request
    ? enquiryHref
    : `/book?vehicle=${encodeURIComponent(vehicle.slug)}`;
  const actionLabel = vehicle.price_on_request ? 'Request a quote' : 'Book now';

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#0d1b2a]/10 bg-white shadow-[0_14px_32px_-24px_rgba(13,27,42,0.52)] transition duration-300 hover:-translate-y-1 hover:border-[#f1c75b]/80 hover:shadow-[0_20px_40px_-24px_rgba(13,27,42,0.52)]"
    >
      <Link href={`/fleet/${vehicle.slug}`} className="relative block aspect-[16/10] w-full overflow-hidden bg-[#e9e2d5]" aria-label={`View ${vehicle.name}`}>
        {image ? (
          <img src={image} alt={cover?.alt ?? vehicle.name} className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" />
        ) : (
          <ImagePlaceholder label={vehicle.name} className="absolute inset-0 h-full w-full" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-[#0d1b2a]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">{CATEGORY_LABEL[vehicle.category]}</span>
      </Link>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <h3 className="font-serif text-[27px] font-semibold leading-[0.98] tracking-[-0.015em] text-[#0d1b2a]"><Link href={`/fleet/${vehicle.slug}`} className="transition hover:text-[#9b7012] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b7012]">{vehicle.name}</Link></h3>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-[#40516b]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3e9] px-2.5 py-1.5"><Users size={13} className="text-[#9b7012]" />Up to {vehicle.passenger_capacity}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3e9] px-2.5 py-1.5"><Luggage size={13} className="text-[#9b7012]" />{vehicle.luggage_capacity} bags</span>
        </div>
        <div className="mt-auto border-t border-[#0d1b2a]/10 pt-4">
          <div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">{price.eyebrow}</p>
              <p className="mt-1 font-serif text-2xl font-semibold leading-none text-[#0d1b2a]">{price.price}</p>
              {price.detail && <p className="mt-1.5 text-[10px] font-medium leading-snug text-slate-500">{price.detail}</p>}
            </div>
            <div className="mt-4 grid gap-2">
              <Link href={bookingHref} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#f1c75b] px-4 py-2.5 text-[11px] font-bold text-[#0d1b2a] transition hover:bg-[#e0b54a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d1b2a]">{actionLabel}<ArrowRight size={14} strokeWidth={2.5} /></Link>
              {!vehicle.price_on_request && <Link href={enquiryHref} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#0d1b2a]/25 px-4 py-2.5 text-[11px] font-bold text-[#0d1b2a] transition hover:border-[#0d1b2a]/50 hover:bg-[#f8f3e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d1b2a]">Enquire now<ArrowRight size={14} strokeWidth={2.5} /></Link>}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
