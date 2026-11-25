'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, Car, MapPin, Calendar, Clock, 
  Users, Briefcase, FileText, ClipboardList, ShieldCheck, Mail, Phone, Plane, Send
} from 'lucide-react';
import { PlaceField } from './PlaceField';
import { OfferCard } from './OfferCard';
import { Turnstile } from './Turnstile';
import { CustomerDetailsForm } from './CustomerDetailsForm';
import { BookingProgress } from './BookingProgress';
import { api, ApiError } from '@/lib/api';
import { addDays, money, zurichLocalToIso, zurichToday } from '@/lib/format';
import { createPublicBooking, resolveCheckoutUrl } from '@/lib/public-booking';
import { getPublicConfig } from '@/lib/public-config';
import type { PaymentMethodKey, PlaceValue, Quote, QuoteOffer, RouteMetrics } from '@/lib/types';
import type { BookingContent } from '@/content/booking';

export interface BookingFlowProps {
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  passengers?: number;
  vehicle?: string;
  roundTrip?: boolean;
  content: BookingContent;
  locale: string;
}

const lightInput = "h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-[#0f172a] placeholder:text-gray-400 transition focus:border-[#eab308] focus:outline-none focus:ring-2 focus:ring-[#eab308]/20";
const lightLabel = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f172a]";

function messageOf(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function BookingFlow({ from, to, date, time, passengers, vehicle, roundTrip = false, content, locale }: BookingFlowProps) {
  const c = content;
  const router = useRouter();
  const flowTopRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef(1);

  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState<PlaceValue | null>(null);
  const [dropoff, setDropoff] = useState<PlaceValue | null>(null);
  const [startDate, setStartDate] = useState(date ?? addDays(zurichToday(), 1));
  const [startTime, setStartTime] = useState(time ?? '10:00');
  const [isRoundTrip, setIsRoundTrip] = useState(roundTrip);
  const [returnDate, setReturnDate] = useState(addDays(zurichToday(), 1));
  const [returnTime, setReturnTime] = useState('18:00');
  const [partySize, setPartySize] = useState(passengers ?? 1);
  const [bags, setBags] = useState(1);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentMethodKey>('online');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [flight, setFlight] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [googleBrowserKey, setGoogleBrowserKey] = useState('');
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offers = useMemo(() => quote?.offers ?? [], [quote]);
  const selected: QuoteOffer | null = offers.find((o) => o.vehicle_id === selectedId) ?? null;
  const outbound = quote?.legs.find((l) => l.direction === 'outbound') ?? null;
  const inbound = quote?.legs.find((l) => l.direction === 'return') ?? null;
  const selectedCategory = selected ? categoryLabel(selected.category, c.offer.categories) : '';
  const flowSteps = c.progress.steps.map((label, index) => ({ step: index + 1, label }));
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'Europe/Zurich' });
  const timeFormatter = new Intl.DateTimeFormat(locale, { timeStyle: 'short', timeZone: 'Europe/Zurich' });
  const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
  const formatTime = (iso: string) => timeFormatter.format(new Date(iso));

  useEffect(() => {
    let active = true;

    getPublicConfig()
      .then((publicConfig) => {
        if (active) {
          setGoogleBrowserKey(publicConfig.googleMapsBrowserKey);
          setTurnstileEnabled(publicConfig.turnstileEnabled);
          setTurnstileSiteKey(publicConfig.turnstileEnabled ? publicConfig.turnstileSiteKey : '');
        }
      })
      .catch((error: unknown) => {
        console.error('[Public config] Failed to load /public/config:', error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (previousStepRef.current === step) {
      return;
    }
    previousStepRef.current = step;

    const scrollToStep = () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      flowTopRef.current?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    };

    const frame = window.requestAnimationFrame(scrollToStep);
    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  async function findVehicles(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!pickup || !dropoff) {
      setError(c.flow.addressError);
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setError(c.flow.quoteSecurityError);
      return;
    }

    setBusy(true);

    try {
      const body = {
        pickup_place_id: pickup.placeId,
        dropoff_place_id: dropoff.placeId,
        pickup_address: pickup.text,
        dropoff_address: dropoff.text,
        pickup_at: zurichLocalToIso(startDate, startTime),
        passengers: partySize,
        luggage: bags,
        ...(isRoundTrip ? { return_at: zurichLocalToIso(returnDate, returnTime) } : {}),
        ...(vehicle ? { vehicle_slug: vehicle } : {}),
        ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
      };

      const res = await api<{ data: Quote }>('/public/quotes', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const preselected = res.data.offers.find((offer) => offer.slug === vehicle);

      setQuote(res.data);
      setSelectedId(preselected?.vehicle_id ?? null);
      setPayment(res.data.payment_methods[0] ?? 'online');
      setTurnstileToken(null);
      setStep(preselected ? 3 : 2);
    } catch (e) {
      setError(messageOf(e, c.flow.fallbackError));
      if (turnstileEnabled) {
        setTurnstileToken(null);
        setTurnstileKey((key) => key + 1);
      }
    } finally {
      setBusy(false);
    }
  }

  async function confirmBooking(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!quote || !selected) {
      setError(c.flow.chooseVehicleError);
      return;
    }

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setError(c.flow.contactError);
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setError(c.flow.bookingSecurityError);
      return;
    }

    setBusy(true);

    try {
      const booking = await createPublicBooking({
        quoteToken: quote.token,
        vehicleId: selected.vehicle_id,
        paymentMethod: payment,
        customer: { name: customer.name.trim(), email: customer.email.trim(), phone: customer.phone.trim() },
        flightNumber: flight.trim() || null,
        turnstileToken,
      });

      sessionStorage.setItem(`limo:access:${booking.reference}`, booking.accessToken);

      if (payment === 'online') {
        const checkoutUrl = await resolveCheckoutUrl(booking).catch(() => null);
        if (checkoutUrl) {
          window.location.assign(checkoutUrl);
          return;
        }
        router.push(`/bookings/${booking.reference}`);
        return;
      }

      router.push(`/bookings/${booking.reference}`);
    } catch (e) {
      if (e instanceof ApiError && ['quote_unavailable', 'slot_unavailable', 'vehicle_not_in_quote'].includes(e.code)) {
        setQuote(null);
        setStep(1);
        setSelectedId(null);
      }
      setError(messageOf(e, c.flow.fallbackError));
      if (turnstileEnabled) {
        setTurnstileToken(null);
        setTurnstileKey((key) => key + 1);
      }
    } finally {
      setBusy(false);
    }
  }

  const handleStep3Continue = (e: FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setError(c.flow.contactError);
      return;
    }
    setError(null);
    setTurnstileToken(null);
    setTurnstileKey((key) => key + 1);
    setStep(4);
  };

  return (
    <div className="grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-x-6 gap-y-4 lg:grid-cols-12">
      <div ref={flowTopRef} className="scroll-mt-28 lg:col-span-12">
        <BookingProgress
          steps={flowSteps.map(({ step: id, label }) => ({ id, label }))}
          currentStep={step}
          label={c.progress.label}
        />
      </div>

      <div className="flex w-full max-w-full min-w-0 flex-col lg:col-span-8">
        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)] md:p-6">
            
            <div className="mb-6 max-w-2xl">
              <p className="mb-1 text-[13px] font-bold tracking-wider text-[#eab308] md:text-[14px]">
                {c.flow.step.replace('{step}', '1')}
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>
                {c.flow.planTitle}
              </h2>
            </div>
            
            <form onSubmit={findVehicles} className="space-y-4">
              <div className="grid min-w-0 w-full grid-cols-1 gap-4 sm:grid-cols-2">
                
                <div className="min-w-0 w-full max-w-full">
                  <label className={lightLabel}>{c.flow.pickup}</label>
                  <PlaceField
                    id="pickup"
                    value={pickup}
                    onChange={setPickup}
                    placeholder={c.flow.addressPlaceholder}
                    initialQuery={from}
                    googleBrowserKey={googleBrowserKey}
                    selectedLabel={c.placeField.selected}
                  />
                </div>
                <div className="min-w-0 w-full max-w-full">
                  <label className={lightLabel}>{c.flow.destination}</label>
                  <PlaceField
                    id="dropoff"
                    value={dropoff}
                    onChange={setDropoff}
                    placeholder={c.flow.addressPlaceholder}
                    initialQuery={to}
                    googleBrowserKey={googleBrowserKey}
                    selectedLabel={c.placeField.selected}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <label className={lightLabel}>{c.flow.date}</label>
                  <input type="date" className={lightInput} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div>
                  <label className={lightLabel}>{c.flow.time}</label>
                  <input type="time" className={lightInput} value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div>
                  <label className={lightLabel}>{c.flow.passengers}</label>
                  <select className={lightInput} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
                    {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lightLabel}>{c.flow.luggage}</label>
                  <select className={lightInput} value={bags} onChange={(e) => setBags(Number(e.target.value))}>
                    {Array.from({ length: 15 }, (_, i) => i).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isRoundTrip}
                    onChange={(e) => setIsRoundTrip(e.target.checked)}
                    className="h-4 w-4 accent-[#eab308]"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-black">{c.flow.returnJourney}</span>
                </label>
              </div>

              {isRoundTrip && (
                <div className="grid grid-cols-1 gap-4 pb-1 sm:grid-cols-2">
                  <div>
                    <label className={lightLabel}>{c.flow.returnDate}</label>
                    <input type="date" className={lightInput} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
                  </div>
                  <div>
                    <label className={lightLabel}>{c.flow.returnTime}</label>
                    <input type="time" className={lightInput} value={returnTime} onChange={(e) => setReturnTime(e.target.value)} required />
                  </div>
                </div>
              )}

              {turnstileEnabled && (
                <div className="rounded-xl border border-[#eab308]/30 bg-[#fffaf0] px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#59430b]"><ShieldCheck size={15} className="text-[#d99b14]" /> {c.flow.quoteSecurity}</div>
                  <div className="mt-2 flex justify-center sm:justify-start">
                    <Turnstile key={`quote-${turnstileKey}`} onToken={setTurnstileToken} siteKey={turnstileSiteKey} theme="light" />
                  </div>
                </div>
              )}

              <div className="flex w-full justify-center pt-1 sm:justify-end">
                <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-8 py-3 text-sm font-bold text-black transition-all hover:shadow-lg disabled:opacity-50 sm:w-auto">
                  {busy ? c.flow.checking : c.flow.chooseVehicle}
                  {!busy && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && quote && (
          <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)] md:p-6">
            
            <div className="mb-5">
              <p className="mb-1 text-[13px] font-bold tracking-wider text-[#eab308] md:text-[14px]">
                {c.flow.step.replace('{step}', '2')}
              </p>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>
                    {c.flow.vehicleTitle}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{c.flow.vehicleIntro}</p>
                </div>
                <p className="text-xs font-semibold text-[#536fad]">{offers.length} {offers.length === 1 ? c.flow.vehicleAvailable : c.flow.vehiclesAvailable}</p>
              </div>
            </div>

            <div className="space-y-3">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.vehicle_id}
                  offer={offer}
                  selected={offer.vehicle_id === selectedId}
                  onSelect={() => setSelectedId(offer.vehicle_id)}
                  copy={c.offer}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-sm font-bold text-black transition hover:bg-gray-50 sm:w-auto"
              >
                <ArrowLeft size={16} /> {c.flow.changeJourney}
              </button>
              <button
                type="button"
                disabled={!selected}
                onClick={() => setStep(3)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 text-sm font-bold text-black transition hover:shadow-lg disabled:opacity-50 sm:w-auto"
              >
                {c.flow.continue} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && quote && selected && (
          <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)] md:p-6">
            <CustomerDetailsForm
              customer={customer}
              onCustomerChange={setCustomer}
              flightNumber={flight}
              onFlightNumberChange={setFlight}
              paymentMethods={quote.payment_methods}
              payment={payment}
              onPaymentChange={setPayment}
              onSubmit={handleStep3Continue} 
              onBack={() => setStep(vehicle ? 1 : 2)}
              busy={busy}
              copy={c.customer}
              eyebrow={c.flow.step.replace('{step}', '3')}
            />
          </div>
        )}

        {step === 4 && quote && selected && (
          <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)] md:p-6">
            <div className="mb-5">
              <p className="mb-1 text-[13px] font-bold tracking-wider text-[#eab308] md:text-[14px]">
                {c.flow.step.replace('{step}', '4')}
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>
                {c.flow.reviewTitle}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[#536fad]">{c.flow.reviewIntro}</p>
            </div>

            <form onSubmit={confirmBooking} className="space-y-4">
              
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                {/* Journey Details */}
                <div className="h-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#0f172a]"><MapPin size={12} /> {c.flow.journeyDetails}</h3>
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-0.5 text-[10px] font-bold text-[#d99b14] transition hover:text-[#0f172a]"><FileText size={10} /> {c.flow.edit}</button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">{c.flow.from}</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{outbound?.pickup ?? pickup?.text}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">{c.flow.to}</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{outbound?.dropoff ?? dropoff?.text}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">{c.flow.date}</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{outbound ? formatDate(outbound.starts_at) : startDate}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">{c.flow.time}</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{outbound ? formatTime(outbound.starts_at) : startTime}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">{c.flow.distance}</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{quote.route_summary ? routeSummary(quote.route_summary) : '—'}</span></div>
                  </div>
                </div>

                {/* Selected Vehicle */}
                <div className="h-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#0f172a]"><Car size={12} /> {c.flow.selectedVehicle}</h3>
                    <button type="button" onClick={() => setStep(2)} className="flex items-center gap-0.5 text-[10px] font-bold text-[#d99b14] transition hover:text-[#0f172a]"><FileText size={10} /> {c.flow.edit}</button>
                  </div>

                  <div className="flex min-h-28 items-center gap-4">
                    {selected.thumbnail_url ? (
                      <div className="h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <img src={selected.thumbnail_url} alt={selected.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                        <Car className="text-gray-400" size={32} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="inline-flex rounded-full bg-[#eab308]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a6505]">{selectedCategory}</p>
                      <p className="mt-2 truncate font-serif text-xl font-bold leading-none text-[#0f172a] md:text-2xl">{selected.name}</p>
                      <p className="mt-1 text-[11px] text-[#536fad]">{c.flow.selectedForJourney}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-slate-600">
                        <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1"><Users size={11} className="text-[#536fad]" /> {c.offer.passengers.replace('{count}', String(quote.passengers))}</span>
                        <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1"><Briefcase size={11} className="text-[#536fad]" /> {c.offer.bags.replace('{count}', String(bags))}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Details */}
                <div className="h-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#0f172a]"><Users size={12} /> {c.flow.yourDetails}</h3>
                    <button type="button" onClick={() => setStep(3)} className="flex items-center gap-0.5 text-[10px] font-bold text-[#d99b14] transition hover:text-[#0f172a]"><FileText size={10} /> {c.flow.edit}</button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">{c.flow.fullName}</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{customer.name}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">{c.flow.email}</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{customer.email}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">{c.flow.phone}</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{customer.phone}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">{c.flow.flightNumber}</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{flight || '—'}</span></div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="h-full rounded-xl border border-[#eab308]/30 bg-[#fffaf0] p-4 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="mb-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#0f172a]"><FileText size={12} /> {c.flow.priceSummary}</h3>
                  <div className="mb-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-black">{c.flow.distance}</span>
                      <span className="font-semibold text-[#0f172a]">{quote.route_summary ? `${quote.route_summary.distance_km} km` : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">{c.flow.ratePerKm}</span>
                      <span className="font-semibold text-[#0f172a]">{money(selected.vat.gross / (quote.route_summary?.distance_km || 1))}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#eab308]/20 pt-3">
                    <span className="font-bold text-sm text-[#0f172a]">{c.flow.estimatedTotal}</span>
                    <span className="text-xl font-bold tracking-tight text-[#b77909] tabular-nums">{money(selected.vat.gross)}</span>
                  </div>
                </div>
              </div>

              {turnstileEnabled && (
                <div className="rounded-xl border border-[#eab308]/30 bg-[#fffaf0] px-4 py-3">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="flex items-start gap-2">
                      <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#d99b14]" />
                      <div>
                        <p className="text-[11px] font-semibold text-[#59430b]">{c.flow.bookingSecurity}</p>
                        <p className="mt-0.5 text-[10px] text-[#806522]">{c.flow.bookingSecurityDescription}</p>
                      </div>
                    </div>
                    <div className="flex justify-center sm:justify-end">
                      <Turnstile key={`booking-${turnstileKey}`} onToken={setTurnstileToken} siteKey={turnstileSiteKey} theme="light" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse items-center gap-3 pt-1 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-5 text-sm font-bold text-black transition hover:bg-gray-50 sm:w-auto"
                >
                  <ArrowLeft size={14} /> {c.flow.backToDetails}
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 text-sm font-bold text-black transition hover:shadow-lg disabled:opacity-50 sm:w-auto"
                >
                  {busy ? c.flow.processing : c.flow.bookNow} <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <aside className="mt-4 lg:col-span-4 lg:mt-0 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)]">
          
          <div className="bg-[#0f172a] px-4 py-2.5 flex items-center gap-2">
            {step === 4 ? <ShieldCheck className="text-[#eab308]" size={18} /> : <ClipboardList className="text-[#eab308]" size={18} />}
            <h3 className="text-lg font-serif text-white font-bold">
              {step === 4 ? c.flow.confirmBooking : c.flow.bookingSummary}
            </h3>
          </div>

          <div className="p-4 space-y-2 text-sm">
            
            {step === 4 ? (
              <div className="space-y-4 pt-1 pb-2">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {c.flow.termsPrefix} <a href="#" className="text-blue-600 hover:underline">{c.flow.terms}</a> {c.flow.termsJoiner} <a href="#" className="text-blue-600 hover:underline">{c.flow.privacy}</a>
                </p>
                
                <div className="bg-green-50/50 border border-green-100 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
                    <Check size={14} className="bg-green-500 text-white rounded-full p-0.5" /> {c.flow.instantRequest}
                  </div>
                  <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
                    <Check size={14} className="bg-green-500 text-white rounded-full p-0.5" /> {c.flow.confirmationVia}
                  </div>
                  <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
                    <Check size={14} className="bg-green-500 text-white rounded-full p-0.5" /> {c.flow.teamContact}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {selected && (
                  <div className="mb-2 rounded-xl border border-gray-200 bg-gray-50 p-2 flex items-start gap-2">
                    <Car className="text-[#0f172a] mt-0.5 shrink-0" size={16} />
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-gray-500">{c.flow.selectedVehicleLabel}</p>
                      <p className="mt-0.5 font-serif text-sm text-[#0f172a] leading-tight">{selected.name}</p>
                      <p className="text-[10px] text-gray-500">{selectedCategory}</p>
                    </div>
                  </div>
                )}

                <SidebarRow icon={<MapPin size={14} />} label={c.flow.pickup} value={outbound?.pickup ?? pickup?.text ?? '—'} />
                <SidebarRow icon={<MapPin size={14} />} label={c.flow.destination} value={outbound?.dropoff ?? dropoff?.text ?? '—'} />
                <SidebarRow 
                  icon={<Calendar size={14} />} 
                  label={c.flow.date}
                  value={outbound ? formatDate(outbound.starts_at) : startDate}
                />
                <SidebarRow 
                  icon={<Clock size={14} />} 
                  label={c.flow.time}
                  value={outbound ? formatTime(outbound.starts_at) : startTime}
                />
                <SidebarRow 
                  icon={<Users size={14} />} 
                  label={c.flow.passengers}
                  value={`${quote?.passengers ?? partySize}`} 
                />
                <SidebarRow 
                  icon={<Briefcase size={14} />} 
                  label={c.flow.luggage}
                  value={`${bags}`} 
                />

                {isRoundTrip && (
                  <>
                    <SidebarRow 
                      icon={<Calendar size={14} />} 
                      label={c.flow.return}
                      value={inbound ? `${formatDate(inbound.starts_at)} ${formatTime(inbound.starts_at)}` : `${returnDate} ${returnTime}`}
                    />
                  </>
                )}

                {quote?.route_summary && (
                  <SidebarRow icon={<FileText size={14} />} label={c.flow.route} value={routeSummary(quote.route_summary)} />
                )}

                <div className="pt-2">
                  {selected ? (
                    <>
                      <div className="flex items-baseline justify-between border-t border-gray-100 pt-2">
                        <span className="text-sm font-bold text-[#0f172a]">{c.flow.estimatedTotal}</span>
                        <span className="font-sans text-sm sm:text-xl text-[#0f172a] leading-none">{money(selected.vat.gross)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">{c.flow.chooseVehicleForPrice}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[#eab308]">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-serif text-[#0f172a] font-bold" style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor' }}>{c.flow.needHelp}</h3>
          </div>
          <p className="text-xs text-[#0f172a] mb-3">{c.flow.helpText}</p>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1 rounded-full border border-gray-200 py-1.5 text-xs font-bold text-[#0f172a] hover:bg-gray-50"><Phone size={12}/> +41 79 123 45 67</button>
            <button className="flex-1 flex items-center justify-center gap-1 rounded-full border border-gray-200 py-1.5 text-xs font-bold text-[#0f172a] hover:bg-gray-50"><Mail size={12}/> {c.flow.chat ?? 'Chat'}</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function routeSummary(route: RouteMetrics): string {
  const distance = new Intl.NumberFormat('en-CH', { maximumFractionDigits: 1 }).format(route.distance_km);
  return `${distance} km · ${route.duration_minutes} min`;
}

function categoryLabel(category: string, categories: BookingContent['offer']['categories']): string {
  if (category === 'first_class') return categories.firstClass;
  if (category === 'executive') return categories.executive;
  if (category === 'van') return categories.van;
  return category;
}

function SidebarRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 py-0.5">
      <div className="mt-0.5 flex w-4 shrink-0 justify-center text-[#0f172a]">
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
        <p className="shrink-0 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0f172a]">{label}</p>
        <p className="min-w-0 text-right text-xs font-bold leading-5 text-[#0f172a] break-words">{value}</p>
      </div>
    </div>
  );
}
