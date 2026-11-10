import { Check, Car } from 'lucide-react';
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
      className={`group flex w-full flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border-2 p-3 sm:p-5 text-left transition-all duration-200 ${
        selected
          ? 'border-[#eab308] bg-[#eab308]/5 shadow-sm'
          : 'border-gray-200 bg-white hover:border-[#eab308]/50 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
        <div className="h-20 w-28 sm:h-28 sm:w-44 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          <Car className="text-gray-400" size={28} />
        </div>

        <div className="flex flex-col min-w-0">
          <p className="text-[10px] sm:text-[12px] uppercase tracking-wider text-gray-500 font-semibold mb-1">{category}</p>
          <h3 className="text-base sm:text-xl font-serif font-bold text-[#0f172a] leading-tight truncate">{offer.name}</h3>
          
          {offer.price.discount > 0 && (
            <p className="mt-1 text-[10px] sm:text-[11px] text-[#eab308] font-semibold">Discount: {money(offer.price.discount)}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0 border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0 mt-1 sm:mt-0 sm:pl-4">
        <div className="text-left sm:text-right">
          <p className="font-serif text-xl sm:text-3xl font-bold text-[#0f172a] leading-none">{money(total)}</p>
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