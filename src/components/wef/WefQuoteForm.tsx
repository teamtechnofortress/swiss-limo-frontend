'use client';

import { type FormEvent, type ReactNode, useState } from 'react';
import { CalendarDays, CheckCircle2, LoaderCircle, Car, MapPin, PenLine, Plane, Send, ShieldCheck, Users, Mail, Phone, User } from 'lucide-react';
import { Turnstile } from '@/components/booking/Turnstile';
import { api, ApiError } from '@/lib/api';

export const WEF_SERVICES = [
  'Zurich Airport Transfer',
  'Davos Chauffeur Service',
  'St. Moritz Transfer',
  'Hourly Chauffeur Service',
  'Executive & Delegation Travel',
  'Special Event Transportation',
];

const VEHICLES = ['Mercedes-Benz E-Class', 'Mercedes-Benz S-Class', 'Mercedes-Benz V-Class', 'Renault Koleos (SUV)'];

interface EnquiryResponse {
  data: { reference: string; message: string };
}

type FieldErrors = Record<string, string>;

function firstErrors(errors: Record<string, string[]>): FieldErrors {
  return Object.fromEntries(
    Object.entries(errors).flatMap(([field, messages]) => (typeof messages[0] === 'string' ? [[field, messages[0]]] : [])),
  );
}

const inputClass =
  'h-10 w-full rounded-lg border border-transparent bg-white pl-9 pr-3 text-[12.5px] font-medium text-[#0d1b2a] outline-none transition placeholder:text-slate-400 focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/40';

function Field({
  label, required, error, icon, children, className = '',
}: {
  label: string; required?: boolean; error?: string; icon: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-1.5 block text-[12px] font-bold text-white">
        {label}{required && <span className="text-[#f1c75b]"> *</span>}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-[20px] z-10 -translate-y-1/2 text-[#6a7685]">{icon}</span>
        {children}
      </span>
      {error && <span className="mt-1 block text-[11px] font-semibold text-red-300">{error}</span>}
    </label>
  );
}

export function WefQuoteForm({ turnstileEnabled, turnstileSiteKey }: { turnstileEnabled: boolean; turnstileSiteKey: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState<EnquiryResponse['data'] | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    setError(null);
    setFieldErrors({});

    if (turnstileEnabled && !turnstileToken) {
      setError('Please complete the security check before sending your request.');
      return;
    }

    const form = new FormData(formEl);
    const value = (name: string) => String(form.get(name) ?? '').trim();
    const passengers = Number(value('passengers'));
    const details = [
      'WEF Davos 2027 quote request',
      `Service: ${value('service')}`,
      value('vehicle') ? `Vehicle preference: ${value('vehicle')}` : '',
      value('flight') ? `Flight number: ${value('flight')}` : '',
      value('requirements') ? `\nAdditional requirements:\n${value('requirements')}` : '',
    ].filter(Boolean).join('\n');

    const payload = {
      type: 'corporate',
      name: value('name'),
      email: value('email'),
      ...(value('phone') ? { phone: value('phone') } : {}),
      ...(value('pickup_date') ? { travel_date: value('pickup_date') } : {}),
      ...(value('return_date') ? { return_date: value('return_date') } : {}),
      ...(Number.isFinite(passengers) && passengers > 0 ? { passengers } : {}),
      ...(value('pickup_location') ? { pickup_location: value('pickup_location') } : {}),
      ...(value('destination') ? { dropoff_location: value('destination') } : {}),
      message: details,
      source_url: window.location.href,
      ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
    };

    setIsSubmitting(true);
    try {
      const response = await api<EnquiryResponse>('/public/enquiries', { method: 'POST', body: JSON.stringify(payload) });
      setSuccess(response.data);
      formEl.reset();
      setTurnstileToken(null);
    } catch (caught) {
      if (caught instanceof ApiError) {
        setFieldErrors(firstErrors(caught.fieldErrors));
        setError(caught.message);
      } else {
        setError('We could not send your request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div role="status" className="py-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a]"><CheckCircle2 size={30} /></span>
        <p className="mt-5 font-serif text-3xl font-bold text-white">Thank you</p>
        <p className="mx-auto mt-3 max-w-sm text-[14px] font-medium leading-relaxed text-white/85">{success.message}</p>
        <p className="mt-5 text-[11px] font-bold tracking-wide text-[#f1c75b]">Reference: {success.reference}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="mt-5 grid gap-3.5">
      <Field label="Service Required" required error={fieldErrors.service} icon={<Car size={15} />}>
        <select name="service" required defaultValue="" className={`${inputClass} appearance-none`}>
          <option value="" disabled>Select a service (e.g. Airport Transfer, Hourly, etc.)</option>
          {WEF_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="Pickup Date" required error={fieldErrors.travel_date} icon={<CalendarDays size={15} />}>
          <input type="date" name="pickup_date" required className={inputClass} />
        </Field>
        <Field label="Return Date" error={fieldErrors.return_date} icon={<CalendarDays size={15} />}>
          <input type="date" name="return_date" className={inputClass} />
        </Field>
        <Field label="Pickup Location" required error={fieldErrors.pickup_location} icon={<MapPin size={15} />}>
          <input name="pickup_location" required placeholder="e.g. Zurich Airport (ZRH)" className={inputClass} />
        </Field>
        <Field label="Destination" required error={fieldErrors.dropoff_location} icon={<MapPin size={15} />}>
          <input name="destination" required placeholder="e.g. Davos / St. Moritz" className={inputClass} />
        </Field>
        <Field label="Passengers" required error={fieldErrors.passengers} icon={<Users size={15} />}>
          <select name="passengers" required defaultValue="" className={`${inputClass} appearance-none`}>
            <option value="" disabled>Select</option>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
        <Field label="Vehicle Preference" icon={<Car size={15} />}>
          <select name="vehicle" defaultValue="" className={`${inputClass} appearance-none`}>
            <option value="">Any / E-Class / S-Class / V-Class</option>
            {VEHICLES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Flight Number (if applicable)" icon={<Plane size={15} />}>
        <input name="flight" placeholder="e.g. LX123" className={inputClass} />
      </Field>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="Full Name" required error={fieldErrors.name} icon={<User size={15} />}>
          <input name="name" autoComplete="name" required className={inputClass} />
        </Field>
        <Field label="Phone" error={fieldErrors.phone} icon={<Phone size={15} />}>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+41 …" className={inputClass} />
        </Field>
      </div>
      <Field label="Email" required error={fieldErrors.email} icon={<Mail size={15} />}>
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </Field>

      <Field label="Additional Requirements" error={fieldErrors.message} icon={<PenLine size={15} />}>
        <textarea name="requirements" rows={3} placeholder="Tell us about your travel plan, meetings, or any special requests…" className={`${inputClass} h-auto resize-y py-2.5`} />
      </Field>

      {turnstileEnabled && (
        <div className="flex justify-center">
          <Turnstile onToken={setTurnstileToken} siteKey={turnstileSiteKey} theme="dark" />
        </div>
      )}

      {error && <p role="alert" className="rounded-lg border border-red-300/40 bg-red-500/15 px-3 py-2 text-[12px] font-semibold text-red-100">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#f1c75b] px-6 text-[14px] font-bold text-[#0d1b2a] shadow-[0_12px_26px_-14px_rgba(241,199,91,.9)] transition hover:bg-[#e6b941] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? <LoaderCircle size={17} className="animate-spin" /> : <Send size={16} />}
        {isSubmitting ? 'Sending…' : 'Submit Request for Quote'}
      </button>
      <p className="flex items-center justify-center gap-2 text-center text-[11.5px] font-medium text-white/80">
        <ShieldCheck size={14} className="text-[#f1c75b]" /> We will confirm availability and send a tailored quotation shortly.
      </p>
    </form>
  );
}