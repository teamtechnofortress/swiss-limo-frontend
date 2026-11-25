'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { FormEvent } from 'react';
import { Turnstile } from '@/components/booking/Turnstile';
import type { PaymentMethodKey } from '@/lib/types';
import type { BookingContent } from '@/content/booking';
import defaultBookingContent from '@/messages/en/booking';

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
  turnstileWidgetKey,
  onSubmit,
  onBack,
  busy,
  eyebrow,
  intro,
  backLabel,
  copy = defaultBookingContent.customer,
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
  /** Changes after a failed protected submission to request a fresh single-use token. */
  turnstileWidgetKey?: string | number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  busy: boolean;
  eyebrow?: string;
  intro?: string;
  backLabel?: string;
  copy?: BookingContent['customer'];
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      
      <div>
        <p className="mb-1 text-[13px] font-bold tracking-wider text-[#eab308] md:text-[14px]">
          {eyebrow}
        </p>
        <h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>
          {copy.title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{intro ?? copy.intro}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={lightLabel}>{copy.fullName}</label>
          <input className={lightInput} value={customer.name} onChange={(event) => onCustomerChange({ ...customer, name: event.target.value })} autoComplete="name" required />
        </div>
        <div>
          <label className={lightLabel}>{copy.email}</label>
          <input type="email" className={lightInput} value={customer.email} onChange={(event) => onCustomerChange({ ...customer, email: event.target.value })} autoComplete="email" required />
        </div>
        <div>
          <label className={lightLabel}>{copy.phone}</label>
          <input type="tel" className={lightInput} value={customer.phone} onChange={(event) => onCustomerChange({ ...customer, phone: event.target.value })} autoComplete="tel" required />
        </div>
        <div>
          <label className={lightLabel}>{copy.flightNumber}</label>
          <input className={lightInput} value={flightNumber} onChange={(event) => onFlightNumberChange(event.target.value.toUpperCase())} placeholder={copy.flightPlaceholder} />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f172a]">{copy.paymentMethod}</legend>
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
                <span className="block text-sm font-bold text-[#0f172a]">{method === 'online' ? copy.payOnlineTitle : copy.payArrivalTitle}</span>
                <span className="mt-0.5 block text-xs leading-snug text-gray-500">{method === 'online' ? copy.payOnlineText : copy.payArrivalText}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {turnstileSiteKey && onTurnstileToken && (
        <div className="rounded-xl border border-[#eab308]/30 bg-[#fffaf0] px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold text-[#59430b]">{copy.security}</p>
          <Turnstile key={turnstileWidgetKey} onToken={onTurnstileToken} siteKey={turnstileSiteKey} theme="light" />
        </div>
      )}

      <div className="flex flex-col-reverse items-center gap-3 pt-1 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-5 text-sm font-bold text-black transition hover:bg-gray-50 sm:w-auto"
        >
          <ArrowLeft size={14} /> {backLabel ?? copy.back}
        </button>
        <button
          type="submit"
          disabled={busy}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 text-sm font-bold text-black transition hover:shadow-lg disabled:opacity-50 sm:w-auto"
        >
          {busy ? copy.waiting : copy.continue}
          {!busy && <ArrowRight size={14} />}
        </button>
      </div>
    </form>
  );
}
