import { Check, Car, Users, Briefcase } from 'lucide-react';
import { CATEGORY_LABEL, money } from '@/lib/format';
import type { QuoteOffer } from '@/lib/types';

export function OfferCard({
  offer,
  selected,
  onSelect,
}: {
  offer: QuoteOffer;
  selected: boolean;
  onSelect: () => void;
}) {
  const total = offer.vat.gross;
  const vatPercent = (offer.vat.rate_bp / 100).toFixed(2);
  const category = CATEGORY_LABEL[offer.category as keyof typeof CATEGORY_LABEL] ?? offer.category;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex w-full items-stretch justify-between overflow-hidden rounded-xl border-2 text-left transition-all duration-200 ${
        selected
          ? 'border-[#eab308] bg-[#eab308]/5 shadow-sm'
          : 'border-gray-200 bg-gray-200 hover:border-[#eab308]/50 hover:bg-gray-50'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center bg-gray-100 gap-3 sm:gap-5">
        <div className="w-40 shrink-0 overflow-hidden bg-gray-200 sm:h-36 sm:w-64">
          {offer.thumbnail_url ? (
            <img
              src={offer.thumbnail_url}
              alt={offer.name}
              className="h-full w-full object-cover bg-gray-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Car className="text-gray-400" size={28} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col py-3 sm:py-5">
          <p className="text-[10px] sm:text-[12px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{category}</p>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {offer.passenger_capacity} Passengers
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} />
              {offer.luggage_capacity} Bags
            </span>
          </div>
          <h3 className="text-sm sm:text-xl font-bold text-[#0f172a] leading-tight truncate">{offer.name}</h3>
          
          {offer.price.discount > 0 && (
            <p className="mt-1 text-[10px] sm:text-[11px] text-[#eab308] font-semibold">Discount: {money(offer.price.discount)}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 px-3 py-3 sm:gap-5 sm:px-5 sm:py-5">
        <div className="text-left sm:text-right">
          <p className=" text-sm sm:text-2xl text-[#0f172a] leading-none">{money(total)}</p>
          <p className="mt-1 text-[9px] sm:text-[11px] text-gray-400">
            {offer.vat.included
              ? `incl. VAT ${vatPercent}%`
              : `plus VAT ${vatPercent}%`}
          </p>
        </div>
        
        <span
          className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected 
              ? 'border-[#eab308] bg-[#eab308] text-white' 
              : 'border-gray-300 text-transparent group-hover:border-gray-400'
          }`}
          aria-hidden="true"
        >
          <Check size={12} strokeWidth={3} />
        </span>
      </div>
    </button>
  );
}
