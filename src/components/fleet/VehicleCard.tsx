import Link from 'next/link';
import { ArrowUpRight, Luggage, Users } from 'lucide-react';
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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-ink-soft transition duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={cover?.alt ?? vehicle.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder label={vehicle.name} className="h-full w-full" />
        )}
        <span className="absolute left-5 top-5 rounded-full border border-gold/40 bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold backdrop-blur">
          {CATEGORY_LABEL[vehicle.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl leading-tight">{vehicle.name}</h3>
          <ArrowUpRight className="mt-1 shrink-0 text-gold transition group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
        </div>

        <div className="mt-5 flex items-center gap-5 text-sm text-mute">
          <span className="inline-flex items-center gap-2"><Users size={15} className="text-gold" />{vehicle.passenger_capacity}</span>
          <span className="inline-flex items-center gap-2"><Luggage size={15} className="text-gold" />{vehicle.luggage_capacity}</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t hairline pt-6 mt-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-mute">From</p>
            <p className="mt-1 font-serif text-2xl text-gold">{pricePerKm(vehicle.price_per_km)}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-ivory/60 transition group-hover:text-gold">View</span>
        </div>
      </div>
    </Link>
  );
}
