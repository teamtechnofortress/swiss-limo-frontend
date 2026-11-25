import { Check, Car, Users, Briefcase } from 'lucide-react';
import { money } from '@/lib/format';
import type { BookingContent } from '@/content/booking';
import type { QuoteOffer } from '@/lib/types';

export function OfferCard({
  offer,
  selected,
  onSelect,
  copy,
}: {
  offer: QuoteOffer;
  selected: boolean;
  onSelect: () => void;
  copy: BookingContent['offer'];
}) {
  const total = offer.vat.gross;
  const vatPercent = (offer.vat.rate_bp / 100).toFixed(2);
  const category = offer.category === 'first_class'
    ? copy.categories.firstClass
    : offer.category === 'executive'
      ? copy.categories.executive
      : offer.category === 'van'
        ? copy.categories.van
        : offer.category;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex w-full min-w-0 flex-col items-stretch justify-between overflow-hidden rounded-xl border-2 text-left transition-all duration-200 md:flex-row ${
        selected
          ? 'border-[#eab308] bg-[#eab308]/5 shadow-sm'
          : 'border-gray-200 bg-gray-200 hover:border-[#eab308]/50 hover:bg-gray-50'
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col items-stretch bg-gray-100 md:flex-row md:items-center md:gap-3">
        <div className="w-full shrink-0 overflow-hidden bg-gray-200 md:h-36 md:w-44 lg:h-[129px] xl:w-60">
          {offer.thumbnail_url ? (
            <img
              src={offer.thumbnail_url}
              alt={offer.name}
              className="block h-auto w-full bg-gray-100 object-contain md:h-full md:object-cover"
            />
          ) : (
            <div className="flex h-44 w-full items-center justify-center md:h-full">
              <Car className="text-gray-400" size={28} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col break-words px-4 py-3 md:py-5 md:pl-0 md:pr-2 lg:py-2">
          <p className="text-[10px] sm:text-[12px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{category}</p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {copy.passengers.replace('{count}', String(offer.passenger_capacity))}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} />
              {copy.bags.replace('{count}', String(offer.luggage_capacity))}
            </span>
          </div>
          <h3 className="font-sans text-sm sm:text-base font-semibold text-[#0f172a] leading-normal">{offer.name}</h3>
          
          {offer.price.discount > 0 && (
            <p className="mt-1 text-[10px] sm:text-[11px] text-[#eab308] font-semibold">{copy.discount.replace('{amount}', money(offer.price.discount))}</p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-300/60 px-4 py-3 md:border-l md:border-t-0 md:px-4 md:py-5 lg:py-2">
        <div className="min-w-0 text-left md:text-right">
          <p className=" text-sm sm:text-2xl text-[#0f172a] leading-none">{money(total)}</p>
          <p className="mt-1 text-[9px] sm:text-[11px] text-gray-400">
            {offer.vat.included
              ? copy.vatIncluded.replace('{rate}', vatPercent)
              : copy.vatExcluded.replace('{rate}', vatPercent)}
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
