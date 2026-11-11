'use client';

import { type FormEvent, type ReactNode, useState } from 'react';
import { CalendarDays, CheckCircle2, LoaderCircle, Luggage, Mail, MapPin, MessageSquare, Phone, Send, Users } from 'lucide-react';
import { Turnstile } from '@/components/booking/Turnstile';
import { api, ApiError } from '@/lib/api';

type EnquiryType = 'general' | 'trip' | 'vehicle' | 'booking' | 'corporate';

interface EnquiryResponse {
  data: {
    reference: string;
    message: string;
  };
}

type FieldErrors = Record<string, string>;

function firstErrors(errors: Record<string, string[]>): FieldErrors {
  return Object.fromEntries(
    Object.entries(errors).flatMap(([field, messages]) =>
      typeof messages[0] === 'string' ? [[field, messages[0]]] : [],
    ),
  );
}

const inputClass =
  'h-12 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-[#0d1b2a] outline-none transition placeholder:text-slate-400 focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/20';

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#233553]">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

export function EnquiryForm({
  tripSlug,
  vehicleSlug,
  sourcePath,
  contextLabel,
  turnstileEnabled,
  turnstileSiteKey,
}: {
  tripSlug?: string;
  vehicleSlug?: string;
  /** The original trip or vehicle page, recorded with the enquiry. */
  sourcePath?: string;
  contextLabel?: string;
  turnstileEnabled: boolean;
  turnstileSiteKey: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState<EnquiryResponse['data'] | null>(null);

  const enquiryType: EnquiryType = tripSlug ? 'trip' : vehicleSlug ? 'vehicle' : 'general';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (turnstileEnabled && !turnstileToken) {
      setError('Please complete the security check before sending your enquiry.');
      return;
    }

    const form = new FormData(event.currentTarget);
    const number = (name: string) => {
      const value = String(form.get(name) ?? '').trim();
      const parsed = Number(value);
      return value && Number.isFinite(parsed) ? parsed : undefined;
    };
    const value = (name: string) => String(form.get(name) ?? '').trim();
    const passengers = number('passengers');
    const luggage = number('luggage');
    const payload = {
      type: enquiryType,
      ...(tripSlug ? { trip_slug: tripSlug } : {}),
      ...(vehicleSlug ? { vehicle_slug: vehicleSlug } : {}),
      name: value('name'),
      email: value('email'),
      ...(value('phone') ? { phone: value('phone') } : {}),
      ...(value('preferred_contact_method') ? { preferred_contact_method: value('preferred_contact_method') } : {}),
      ...(value('travel_date') ? { travel_date: value('travel_date') } : {}),
      ...(value('return_date') ? { return_date: value('return_date') } : {}),
      ...(passengers !== undefined ? { passengers } : {}),
      ...(luggage !== undefined ? { luggage } : {}),
      ...(value('pickup_location') ? { pickup_location: value('pickup_location') } : {}),
      ...(value('dropoff_location') ? { dropoff_location: value('dropoff_location') } : {}),
      message: value('message'),
      source_url: sourcePath ? new URL(sourcePath, window.location.origin).href : window.location.href,
      ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
    };

    setIsSubmitting(true);
    try {
      const response = await api<EnquiryResponse>('/public/enquiries', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setSuccess(response.data);
      event.currentTarget.reset();
      setTurnstileToken(null);
    } catch (caught) {
      if (caught instanceof ApiError) {
        setFieldErrors(firstErrors(caught.fieldErrors));
        setError(caught.message);
      } else {
        setError('We could not send your enquiry. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-[#f1c75b]/40 bg-[#fffbef] px-6 py-12 text-center" role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a]">
          <CheckCircle2 size={30} />
        </span>
        <p className="mt-5 font-serif text-3xl font-bold text-[#0d1b2a]">Thank you</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">{success.message}</p>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9c6c14]">Reference: {success.reference}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-6" noValidate>
      {contextLabel && (
        <div className="flex items-center gap-3 rounded-lg border border-[#f1c75b]/40 bg-[#fff8e8] px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a]">
            <MessageSquare size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#906317]">Enquiring about</p>
            <p className="truncate text-sm font-bold text-[#0d1b2a]">{contextLabel}</p>
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d1b2a] text-[#f1c75b]"><Mail size={14} /></span>
          <div>
            <p className="text-sm font-bold text-[#0d1b2a]">Your contact details</p>
            <p className="text-[11px] text-slate-500">So our travel team can get back to you.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full name" error={fieldErrors.name}>
          <input className={inputClass} name="name" autoComplete="name" required />
          </FormField>
          <FormField label="Email address" error={fieldErrors.email}>
          <input className={inputClass} type="email" name="email" autoComplete="email" required />
          </FormField>
          <FormField label="Phone number" error={fieldErrors.phone}>
          <input className={inputClass} type="tel" name="phone" autoComplete="tel" />
          </FormField>
          <FormField label="Preferred contact method" error={fieldErrors.preferred_contact_method}>
          <select className={inputClass} name="preferred_contact_method" defaultValue="">
            <option value="">No preference</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
          </FormField>
        </div>
      </div>

      {(tripSlug || vehicleSlug) && (
        <div className="border-y border-slate-100 py-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff1c9] text-[#9c6c14]"><CalendarDays size={14} /></span>
            <div>
              <p className="text-sm font-bold text-[#0d1b2a]">Journey details</p>
              <p className="text-[11px] text-slate-500">Optional details help us prepare an accurate quote.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Travel date" error={fieldErrors.travel_date}>
              <div className="relative"><CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className={`${inputClass} pl-10`} type="date" name="travel_date" /></div>
            </FormField>
            <FormField label="Return date" error={fieldErrors.return_date}>
              <div className="relative"><CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className={`${inputClass} pl-10`} type="date" name="return_date" /></div>
            </FormField>
            <FormField label="Passengers" error={fieldErrors.passengers}>
              <div className="relative"><Users className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className={`${inputClass} pl-10`} type="number" name="passengers" min="1" inputMode="numeric" /></div>
            </FormField>
            {vehicleSlug && (
              <FormField label="Luggage" error={fieldErrors.luggage}>
                <div className="relative"><Luggage className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className={`${inputClass} pl-10`} type="number" name="luggage" min="0" inputMode="numeric" /></div>
              </FormField>
            )}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="Pickup location" error={fieldErrors.pickup_location}>
              <div className="relative"><MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className={`${inputClass} pl-10`} name="pickup_location" autoComplete="address-level2" /></div>
            </FormField>
            <FormField label="Drop-off location" error={fieldErrors.dropoff_location}>
              <div className="relative"><MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input className={`${inputClass} pl-10`} name="dropoff_location" autoComplete="address-level2" /></div>
            </FormField>
          </div>
        </div>
      )}

      <FormField label="How can we help?" error={fieldErrors.message}>
        <textarea className={`${inputClass} h-auto min-h-32 resize-y py-3.5`} name="message" placeholder="Tell us about your journey or request..." required />
      </FormField>

      {turnstileEnabled && <Turnstile onToken={setTurnstileToken} siteKey={turnstileSiteKey} />}

      {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>}

      <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-6 text-[13px] font-bold text-[#0d1b2a] shadow-sm transition hover:bg-[#e0b54a] hover:shadow-[0_5px_15px_rgba(241,199,91,0.38)] disabled:pointer-events-none disabled:opacity-60" disabled={isSubmitting}>
        {isSubmitting ? <LoaderCircle className="animate-spin" size={17} /> : null}
        {!isSubmitting && <Send size={16} />}
        {isSubmitting ? 'Sending enquiry…' : 'Send enquiry'}
      </button>
      <p className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-500"><Phone size={13} /> We usually reply within one working day.</p>
    </form>
  );
}
