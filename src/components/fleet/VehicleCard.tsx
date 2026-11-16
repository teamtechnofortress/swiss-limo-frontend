import Link from 'next/link';
import { ArrowRight, Luggage, Users } from 'lucide-react';
import { ImagePlaceholder } from '@/components/ui/primitives';
import { CATEGORY_LABEL, pricePerKm } from '@/lib/format';
import type { Vehicle } from '@/lib/types';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const cover = vehicle.media.cover;
  const image = cover?.thumbnail_url ?? cover?.url ?? vehicle.images[0];

  return (
    <Link
      href={`/fleet/${vehicle.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#0d1b2a]/10 bg-white shadow-[0_14px_32px_-24px_rgba(13,27,42,0.52)] transition duration-300 hover:-translate-y-1 hover:border-[#f1c75b]/80 hover:shadow-[0_20px_40px_-24px_rgba(13,27,42,0.52)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e9e2d5]">
        {image ? (
          <img src={image} alt={cover?.alt ?? vehicle.name} className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" />
        ) : (
          <ImagePlaceholder label={vehicle.name} className="absolute inset-0 h-full w-full" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-[#0d1b2a]/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">{CATEGORY_LABEL[vehicle.category]}</span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
        <h3 className="font-serif text-[27px] font-semibold leading-[0.98] tracking-[-0.015em] text-[#0d1b2a]">{vehicle.name}</h3>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-[#40516b]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3e9] px-2.5 py-1.5"><Users size={13} className="text-[#9b7012]" />Up to {vehicle.passenger_capacity}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f3e9] px-2.5 py-1.5"><Luggage size={13} className="text-[#9b7012]" />{vehicle.luggage_capacity} bags</span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#0d1b2a]/10 pt-4">
          <div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">From</p><p className="mt-1 font-serif text-xl font-semibold leading-none text-[#0d1b2a]">{pricePerKm(vehicle.price_per_km)}</p></div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a] transition group-hover:translate-x-0.5 group-hover:bg-[#e0b54a]"><ArrowRight size={16} strokeWidth={2.4} /></span>
        </div>
      </div>
    </Link>
  );
}
