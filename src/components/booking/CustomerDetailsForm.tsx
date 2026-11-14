'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { FormEvent } from 'react';
import { Turnstile } from '@/components/booking/Turnstile';
import type { PaymentMethodKey } from '@/lib/types';

export const PAYMENT_OPTIONS: Record<PaymentMethodKey, { title: string; text: string }> = {
  online: {
    title: 'Pay online',
    text: 'Secure card or Apple Pay payment. Your booking is confirmed once payment is received.',
  },
  cash_on_arrival: {
    title: 'Pay on arrival',
    text: 'Pay your chauffeur in cash. Confirm your booking from the link in your email.',
  },
};

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

const lightInput = "h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-[#0f172a] placeholder:text-gray-400 transition focus:border-[#eab308] focus:outline-none focus:ring-2 focus:ring-[#eab308]/20";
const lightLabel = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f172a]";

export function CustomerDetailsForm({
  customer,
  onCustomerChange,
  flightNumber,
  onFlightNumberChange,
  paymentMethods,
  payment,
  onPaymentChange,
  turnstileSiteKey,
  onTurnstileToken,
  onSubmit,
  onBack,
  busy,
  eyebrow,
  intro = 'We will send your confirmation and trip details to these contacts.',
  backLabel = 'Back',
}: {
  customer: CustomerDetails;
  onCustomerChange: (customer: CustomerDetails) => void;
  flightNumber: string;
  onFlightNumberChange: (value: string) => void;
  paymentMethods: PaymentMethodKey[];
  payment: PaymentMethodKey;
  onPaymentChange: (method: PaymentMethodKey) => void;
  /** Used by the trip booking flow; the main booking flow verifies on its review step. */
  turnstileSiteKey?: string;
  onTurnstileToken?: (token: string | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  busy: boolean;
  eyebrow?: string;
  intro?: string;
  backLabel?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      
      <div>
        <p className="mb-1 text-[13px] font-bold tracking-wider text-[#eab308] md:text-[14px]">
          {eyebrow ?? 'Step 3 of 4'}
        </p>
        <h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>
          Your Details
        </h2>
        <p className="mt-1 text-sm text-gray-500">{intro}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={lightLabel}>Full Name *</label>
          <input className={lightInput} value={customer.name} onChange={(event) => onCustomerChange({ ...customer, name: event.target.value })} autoComplete="name" required />
        </div>
        <div>
          <label className={lightLabel}>Email Address *</label>
          <input type="email" className={lightInput} value={customer.email} onChange={(event) => onCustomerChange({ ...customer, email: event.target.value })} autoComplete="email" required />
        </div>
        <div>
          <label className={lightLabel}>Phone / WhatsApp *</label>
          <input type="tel" className={lightInput} value={customer.phone} onChange={(event) => onCustomerChange({ ...customer, phone: event.target.value })} autoComplete="tel" required />
        </div>
        <div>
          <label className={lightLabel}>Flight Number (Optional)</label>
          <input className={lightInput} value={flightNumber} onChange={(event) => onFlightNumberChange(event.target.value.toUpperCase())} placeholder="LX 1234" />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f172a]">Payment Method</legend>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <label 
              key={method} 
              className={`flex cursor-pointer gap-3 rounded-xl border-2 p-3.5 transition ${
                payment === method 
                  ? 'border-[#eab308] bg-[#fffaf0] shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input 
                type="radio" 
                name="payment" 
                value={method} 
                checked={payment === method} 
                onChange={() => onPaymentChange(method)} 
                className="mt-0.5 h-4 w-4 accent-[#eab308]"
              />
              <span>
                <span className="block text-sm font-bold text-[#0f172a]">{PAYMENT_OPTIONS[method].title}</span>
                <span className="mt-0.5 block text-xs leading-snug text-gray-500">{PAYMENT_OPTIONS[method].text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {turnstileSiteKey && onTurnstileToken && (
        <div className="rounded-xl border border-[#eab308]/30 bg-[#fffaf0] px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold text-[#59430b]">Security verification is required before confirming your booking.</p>
          <Turnstile onToken={onTurnstileToken} siteKey={turnstileSiteKey} />
        </div>
      )}

      <div className="flex flex-col-reverse items-center gap-3 pt-1 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-5 text-sm font-bold text-black transition hover:bg-gray-50 sm:w-auto"
        >
          <ArrowLeft size={14} /> {backLabel}
        </button>
        <button
          type="submit"
          disabled={busy}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 text-sm font-bold text-black transition hover:shadow-lg disabled:opacity-50 sm:w-auto"
        >
          {busy ? 'Please wait…' : 'Continue to Review & Book'} 
          {!busy && <ArrowRight size={14} />}
        </button>
      </div>
    </form>
  );
}
