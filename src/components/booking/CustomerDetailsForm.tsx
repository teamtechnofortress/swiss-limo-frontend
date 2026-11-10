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

const lightInput = "w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm !font-normal text-[#0f172a] placeholder:text-gray-400 transition focus:border-[#eab308] focus:outline-none focus:ring-1 focus:ring-[#eab308]";
const lightLabel = "mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#0f172a]";

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
  turnstileSiteKey: string;
  onTurnstileToken: (token: string | null) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  busy: boolean;
  eyebrow?: string;
  intro?: string;
  backLabel?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-1">
      
      <div className="mb-2">
        <p className="text-[14px] font-bold text-[#eab308] tracking-wider mb-0.5">
          Step 3 of 4
        </p>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0f172a]" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>                 
          Your Details
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Provide your contact information to confirm the booking.</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
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

      <fieldset className="pt-0">
        <legend className="text-[11px] font-bold uppercase tracking-wider text-[#0f172a] mb-1">Payment Method</legend>
        <div className="space-y-1">
          {paymentMethods.map((method) => (
            <label 
              key={method} 
              className={`flex cursor-pointer gap-2.5 rounded-xl border-2 p-3 transition ${
                payment === method 
                  ? 'border-[#eab308] bg-[#eab308]/5' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input 
                type="radio" 
                name="payment" 
                value={method} 
                checked={payment === method} 
                onChange={() => onPaymentChange(method)} 
                className="mt-0.5 accent-[#eab308] h-3.5 w-3.5" 
              />
              <span>
                <span className="block text-xs font-bold text-[#0f172a]">{PAYMENT_OPTIONS[method].title}</span>
                <span className="mt-0.5 block text-[10px] text-gray-500 leading-snug">{PAYMENT_OPTIONS[method].text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-center -mt-14 h-[33px] overflow-hidden">
        <Turnstile onToken={onTurnstileToken} siteKey={turnstileSiteKey} />
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between items-center -mt-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-gray-50 transition-all w-full sm:w-auto"
        >
          <ArrowLeft size={14} /> {backLabel}
        </button>
        <button
          type="submit"
          disabled={busy}
          className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 py-2.5 text-xs font-bold text-black hover:shadow-lg transition-all disabled:opacity-50 w-full sm:w-auto"
        >
          {busy ? 'Please wait…' : 'Continue to Review & Book'} 
          {!busy && <ArrowRight size={14} />}
        </button>
      </div>
    </form>
  );
}