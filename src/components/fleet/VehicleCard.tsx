import Link from 'next/link';
import { ArrowRight, Luggage, Users } from 'lucide-react';
import { ImagePlaceholder } from '@/components/ui/primitives';
import { CATEGORY_LABEL, pricePerKm } from '@/lib/format';
import type { Vehicle } from '@/lib/types';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  // New public fleet responses expose a curated cover separately from gallery media.
  // The flattened `images` fallback keeps cards working while older API responses exist.
  const cover = vehicle.media.cover;
  const image = cover?.thumbnail_url ?? cover?.url ?? vehicle.images[0];

  return (
    <Link
      href={`/fleet/${vehicle.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-50">
        {image ? (
          <img
            src={image}
            alt={cover?.alt ?? vehicle.name}
            className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={vehicle.name} className="absolute inset-0 h-full w-full" />
        )}
        
        {/* Category Badge */}
        <span className="absolute left-3 top-3 rounded-full bg-[#f1c75b] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-black shadow-sm">
          {CATEGORY_LABEL[vehicle.category]}
        </span>
      </div>

      {/* Content - Reduced padding */}
      <div className="flex flex-1 flex-col px-4 py-3">
        
        {/* Name */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans text-[15px] font-bold leading-tight text-black">
            {vehicle.name}
          </h3>
        </div>

        <div className="mt-1.5 flex items-center gap-4 text-[10px] font-medium text-black">
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} className="text-[#d38b12]" />
            {vehicle.passenger_capacity} Passengers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Luggage size={13} className="text-[#d38b12]" />
            {vehicle.luggage_capacity} Luggage
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-gray-100 pt-2">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-500">From</p>
            <p className="mt-0.5 font-sans text-[13px] font-bold text-black">
              {pricePerKm(vehicle.price_per_km)}
            </p>
          </div>
          
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f1c75b] text-black transition group-hover:bg-[#e0b54a]">
            <ArrowRight size={14} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}