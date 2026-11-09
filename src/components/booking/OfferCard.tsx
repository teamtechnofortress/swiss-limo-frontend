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
      className={`group flex w-full items-center justify-between gap-3 rounded-xl border-2 py-2 px-3 text-left transition-all duration-200 ${
        selected
          ? 'border-[#eab308] bg-[#eab308]/5 shadow-sm'
          : 'border-gray-200 bg-white hover:border-[#eab308]/50 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="h-10 w-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
          <Car className="text-gray-400" size={24} />
        </div>

        <div className="flex flex-col">
          <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold mb-0.5">{category}</p>
          <h3 className="text-sm font-serif font-bold text-[#0f172a] leading-tight">{offer.name}</h3>
          
          {offer.price.discount > 0 && (
            <p className="mt-0.5 text-[9px] text-[#eab308] font-semibold">Discount: {money(offer.price.discount)}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <p className="font-serif text-lg font-bold text-[#0f172a] leading-none">{money(total)}</p>
          <p className="mt-0.5 text-[8px] text-gray-400">
            {offer.vat.included
              ? `incl. VAT ${vatPercent}%`
              : `plus VAT ${vatPercent}%`}
          </p>
        </div>
        
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected 
              ? 'border-[#eab308] bg-[#eab308] text-white' 
              : 'border-gray-300 text-transparent group-hover:border-gray-400'
          }`}
          aria-hidden="true"
        >
          <Check size={10} strokeWidth={3} />
        </span>
      </div>
    </button>
  );
}