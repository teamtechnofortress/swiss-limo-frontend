import { Check } from 'lucide-react';
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
      className={`group flex w-full items-center justify-between gap-6 rounded-3xl border p-7 text-left transition duration-300 ${
        selected
          ? 'border-gold bg-ink-raised shadow-gold'
          : 'border-line bg-ink-soft hover:-translate-y-0.5 hover:border-gold/50'
      }`}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{category}</p>
        <h3 className="mt-3 text-2xl">{offer.name}</h3>
        {offer.price.discount > 0 && (
          <p className="mt-2 text-xs text-gold/90">Round-trip discount applied: {money(offer.price.discount)}</p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-serif text-3xl text-gold">{money(total)}</p>
          <p className="mt-1 text-xs text-mute">
            {offer.vat.included
              ? `incl. VAT ${vatPercent}%`
              : `plus VAT ${vatPercent}%`}
          </p>
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
            selected ? 'border-gold bg-gold-gradient text-ink' : 'border-line text-transparent group-hover:border-gold/60'
          }`}
          aria-hidden="true"
        >
          <Check size={16} />
        </span>
      </div>
    </button>
  );
}
