'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { FormEvent } from 'react';
import { Turnstile } from '@/components/booking/Turnstile';
import { Button, Field, inputClass } from '@/components/ui/primitives';
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
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        {eyebrow && <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{eyebrow}</p>}
        <h2 className="mt-3 text-3xl">Your details</h2>
        <p className="mt-3 text-sm leading-relaxed text-mute">{intro}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name"><input className={inputClass} value={customer.name} onChange={(event) => onCustomerChange({ ...customer, name: event.target.value })} autoComplete="name" required /></Field>
        <Field label="Email"><input type="email" className={inputClass} value={customer.email} onChange={(event) => onCustomerChange({ ...customer, email: event.target.value })} autoComplete="email" required /></Field>
        <Field label="Mobile phone" hint="Your chauffeur may call you on arrival."><input type="tel" className={inputClass} value={customer.phone} onChange={(event) => onCustomerChange({ ...customer, phone: event.target.value })} autoComplete="tel" required /></Field>
        <Field label="Flight number (optional)" hint="Helps us plan your pickup if you are arriving by air."><input className={inputClass} value={flightNumber} onChange={(event) => onFlightNumberChange(event.target.value.toUpperCase())} placeholder="LX 1234" /></Field>
      </div>

      <fieldset>
        <legend className="text-xs uppercase tracking-[0.2em] text-mute">Payment method</legend>
        <div className="mt-4 grid gap-4">
          {paymentMethods.map((method) => (
            <label key={method} className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition ${payment === method ? 'border-gold bg-ink-raised' : 'border-line hover:border-gold/50'}`}>
              <input type="radio" name="payment" value={method} checked={payment === method} onChange={() => onPaymentChange(method)} className="mt-1 accent-[#c9a96e]" />
              <span><span className="block text-base">{PAYMENT_OPTIONS[method].title}</span><span className="mt-1 block text-sm text-mute">{PAYMENT_OPTIONS[method].text}</span></span>
            </label>
          ))}
        </div>
      </fieldset>

      <Turnstile onToken={onTurnstileToken} siteKey={turnstileSiteKey} />
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={onBack}><ArrowLeft size={16} /> {backLabel}</Button>
        <Button type="submit" disabled={busy}>{busy ? 'Please wait…' : payment === 'online' ? 'Continue to secure payment' : 'Confirm booking'} {!busy && <ArrowRight size={16} />}</Button>
      </div>
    </form>
  );
}
