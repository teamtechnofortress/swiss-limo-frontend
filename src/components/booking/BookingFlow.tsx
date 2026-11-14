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
import { api, ApiError } from '@/lib/api';
import { addDays, formatDateTime, money, zurichLocalToIso, zurichToday } from '@/lib/format';
import { createPublicBooking, resolveCheckoutUrl } from '@/lib/public-booking';
import { getPublicConfig } from '@/lib/public-config';
import type { PaymentMethodKey, PlaceValue, Quote, QuoteOffer, RouteMetrics } from '@/lib/types';

export interface BookingFlowProps {
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  passengers?: number;
  vehicle?: string;
}

const STEPS = [
  { step: 1, label: 'Plan Your Journey' },
  { step: 2, label: 'Choose Vehicle' },
  { step: 3, label: 'Your Details' },
  { step: 4, label: 'Review & Book' },
] as const;

const lightInput = "h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-[#0f172a] placeholder:text-gray-400 transition focus:border-[#eab308] focus:outline-none focus:ring-2 focus:ring-[#eab308]/20";
const lightLabel = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f172a]";

function messageOf(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
}

export function BookingFlow({ from, to, date, time, passengers, vehicle }: BookingFlowProps) {
  const router = useRouter();
  const flowTopRef = useRef<HTMLDivElement>(null);
  const hasMountedStepRef = useRef(false);

  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState<PlaceValue | null>(null);
  const [dropoff, setDropoff] = useState<PlaceValue | null>(null);
  const [startDate, setStartDate] = useState(date ?? addDays(zurichToday(), 1));
  const [startTime, setStartTime] = useState(time ?? '10:00');
  const [roundTrip, setRoundTrip] = useState(false);
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
  const flowSteps = vehicle ? STEPS.filter(({ step: stepNumber }) => stepNumber !== 2) : STEPS;

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
    if (!hasMountedStepRef.current) {
      hasMountedStepRef.current = true;
      return;
    }

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
      setError('Please choose both addresses from the suggestions.');
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setError('Please complete the security verification before checking availability.');
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
        ...(roundTrip ? { return_at: zurichLocalToIso(returnDate, returnTime) } : {}),
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
      setError(messageOf(e));
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
      setError('Please choose a vehicle first.');
      return;
    }

    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setError('Please complete your contact details.');
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      setError('Please complete the security verification before confirming your booking.');
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
      setError(messageOf(e));
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
      setError('Please complete your contact details.');
      return;
    }
    setError(null);
    setTurnstileToken(null);
    setTurnstileKey((key) => key + 1);
    setStep(4);
  };

  return (
    <div className="grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-x-6 gap-y-4 lg:grid-cols-12">
      <div ref={flowTopRef} className="relative isolate mx-auto w-full max-w-5xl scroll-mt-28 rounded-2xl border-2 border-gray-200 bg-white px-1 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:px-4 md:px-8 lg:col-span-12">
   
   <ol className="flex items-center justify-between w-full" aria-label="Booking steps">
             {flowSteps.map(({ step: stepNumber, label }, index) => {
              const done = step > stepNumber;
              const current = step === stepNumber;

              return (
                <li key={label} className="flex min-w-0 flex-1 items-start justify-center relative" aria-current={current ? 'step' : undefined}>
                  <div className="relative z-10 flex min-w-0 flex-col items-center px-1 sm:px-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        current
                          ? 'border-[#eab308] bg-[#eab308] text-white'
                          : done
                            ? 'border-[#0f172a] bg-[#0f172a] text-white'
                            : 'border-gray-300 bg-gray-300 text-gray-600'
                      }`}
                    >
                      {done ? <Check size={12} /> : index + 1}
                    </span>
                    <span className={`mt-1 min-h-[28px] sm:min-h-0 text-center text-[9px] leading-[14px] sm:text-[10px] md:text-[11px] font-semibold ${current || done ? 'text-[#0f172a]' : 'text-gray-500'}`}>
                      {label}
                    </span>
                  </div>
                  {index < flowSteps.length - 1 && (
                    <div aria-hidden="true" className={`absolute top-3 left-[50%] w-full h-[2px] z-0 ${done ? 'bg-[#0f172a]' : 'bg-gray-200'}`} />
                  )}
                </li>
              );
            })}
          </ol>
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
                Step 1 of 4
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>
                Plan Your Journey
              </h2>
            </div>
            
            <form onSubmit={findVehicles} className="space-y-4">
              <div className="grid min-w-0 w-full grid-cols-1 gap-4 sm:grid-cols-2">
                
                <div className="min-w-0 w-full max-w-full">
                  <label className={lightLabel}>Pickup</label>
                  <PlaceField
                    id="pickup"
                    value={pickup}
                    onChange={setPickup}
                    placeholder="Address, hotel or airport"
                    initialQuery={from}
                    googleBrowserKey={googleBrowserKey}
                  />
                </div>
                <div className="min-w-0 w-full max-w-full">
                  <label className={lightLabel}>Destination</label>
                  <PlaceField
                    id="dropoff"
                    value={dropoff}
                    onChange={setDropoff}
                    placeholder="Address, hotel or airport"
                    initialQuery={to}
                    googleBrowserKey={googleBrowserKey}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <label className={lightLabel}>Date</label>
                  <input type="date" className={lightInput} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div>
                  <label className={lightLabel}>Time</label>
                  <input type="time" className={lightInput} value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div>
                  <label className={lightLabel}>Passengers</label>
                  <select className={lightInput} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
                    {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lightLabel}>Luggage</label>
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
                    checked={roundTrip}
                    onChange={(e) => setRoundTrip(e.target.checked)}
                    className="h-4 w-4 accent-[#eab308]"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-black">Add a return journey</span>
                </label>
              </div>

              {roundTrip && (
                <div className="grid grid-cols-1 gap-4 pb-1 sm:grid-cols-2">
                  <div>
                    <label className={lightLabel}>Return date</label>
                    <input type="date" className={lightInput} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
                  </div>
                  <div>
                    <label className={lightLabel}>Return time</label>
                    <input type="time" className={lightInput} value={returnTime} onChange={(e) => setReturnTime(e.target.value)} required />
                  </div>
                </div>
              )}

              {turnstileEnabled && (
                <div className="rounded-xl border border-[#eab308]/30 bg-[#fffaf0] px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#59430b]"><ShieldCheck size={15} className="text-[#d99b14]" /> Security verification is required to check availability.</div>
                  <div className="mt-2 flex justify-center sm:justify-start">
                    <Turnstile key={`quote-${turnstileKey}`} onToken={setTurnstileToken} siteKey={turnstileSiteKey} theme="light" />
                  </div>
                </div>
              )}

              <div className="flex w-full justify-center pt-1 sm:justify-end">
                <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-8 py-3 text-sm font-bold text-black transition-all hover:shadow-lg disabled:opacity-50 sm:w-auto">
                  {busy ? 'Checking availability…' : 'Continue to choose vehicle'}
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
                Step 2 of 4
              </p>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>
                    Choose Your Vehicle
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">Select the vehicle that best suits your journey.</p>
                </div>
                <p className="text-xs font-semibold text-[#536fad]">{offers.length} {offers.length === 1 ? 'vehicle' : 'vehicles'} available</p>
              </div>
            </div>

            <div className="space-y-3">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.vehicle_id}
                  offer={offer}
                  selected={offer.vehicle_id === selectedId}
                  onSelect={() => setSelectedId(offer.vehicle_id)}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-sm font-bold text-black transition hover:bg-gray-50 sm:w-auto"
              >
                <ArrowLeft size={16} /> Change journey
              </button>
              <button
                type="button"
                disabled={!selected}
                onClick={() => setStep(3)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 text-sm font-bold text-black transition hover:shadow-lg disabled:opacity-50 sm:w-auto"
              >
                Continue <ArrowRight size={16} />
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
            />
          </div>
        )}

        {step === 4 && quote && selected && (
          <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)] md:p-6">
            <div className="mb-5">
              <p className="mb-1 text-[13px] font-bold tracking-wider text-[#eab308] md:text-[14px]">
                Step 4 of 4
              </p>
              <h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>
                Review & Book
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[#536fad]">Review your journey and contact details, then submit your booking request.</p>
            </div>

            <form onSubmit={confirmBooking} className="space-y-4">
              
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                {/* Journey Details */}
                <div className="h-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#0f172a]"><MapPin size={12} /> Journey Details</h3>
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-0.5 text-[10px] font-bold text-[#d99b14] transition hover:text-[#0f172a]"><FileText size={10} /> Edit</button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">From</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{outbound?.pickup ?? pickup?.text}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">To</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{outbound?.dropoff ?? dropoff?.text}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">Date</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{outbound ? formatDateTime(outbound.starts_at).split(',')[0] : startDate}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">Time</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{outbound ? formatDateTime(outbound.starts_at).split(',')[1] : startTime}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">Distance</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{quote.route_summary ? routeSummary(quote.route_summary) : '—'}</span></div>
                  </div>
                </div>

                {/* Selected Vehicle */}
                <div className="h-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#0f172a]"><Car size={12} /> Selected Vehicle</h3>
                    <button type="button" onClick={() => setStep(2)} className="flex items-center gap-0.5 text-[10px] font-bold text-[#d99b14] transition hover:text-[#0f172a]"><FileText size={10} /> Edit</button>
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
                      <p className="inline-flex rounded-full bg-[#eab308]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a6505]">{selected.category}</p>
                      <p className="mt-2 truncate font-serif text-xl font-bold leading-none text-[#0f172a] md:text-2xl">{selected.name}</p>
                      <p className="mt-1 text-[11px] text-[#536fad]">Selected for your journey</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-slate-600">
                        <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1"><Users size={11} className="text-[#536fad]" /> {quote.passengers} passengers</span>
                        <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1"><Briefcase size={11} className="text-[#536fad]" /> {bags} bags</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Your Details */}
                <div className="h-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#0f172a]"><Users size={12} /> Your Details</h3>
                    <button type="button" onClick={() => setStep(3)} className="flex items-center gap-0.5 text-[10px] font-bold text-[#d99b14] transition hover:text-[#0f172a]"><FileText size={10} /> Edit</button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">Full name</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{customer.name}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">Email</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{customer.email}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">Phone</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{customer.phone}</span></div>
                    <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-slate-500">Flight number</span><span className="max-w-[65%] text-right font-semibold leading-4 text-[#0f172a] break-words">{flight || '—'}</span></div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="h-full rounded-xl border border-[#eab308]/30 bg-[#fffaf0] p-4 shadow-sm transition-shadow hover:shadow-md">
                  <h3 className="mb-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#0f172a]"><FileText size={12} /> Price Summary</h3>
                  <div className="mb-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-black">Distance</span>
                      <span className="font-semibold text-[#0f172a]">{quote.route_summary ? `${quote.route_summary.distance_km} km` : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Rate per km</span>
                      <span className="font-semibold text-[#0f172a]">{money(selected.vat.gross / (quote.route_summary?.distance_km || 1))}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#eab308]/20 pt-3">
                    <span className="font-bold text-sm text-[#0f172a]">Estimated Total</span>
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
                        <p className="text-[11px] font-semibold text-[#59430b]">Security verification is required before confirming your booking.</p>
                        <p className="mt-0.5 text-[10px] text-[#806522]">This protects your request and helps prevent automated submissions.</p>
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
                  <ArrowLeft size={14} /> Back to Details
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 text-sm font-bold text-black transition hover:shadow-lg disabled:opacity-50 sm:w-auto"
                >
                  {busy ? 'Processing...' : 'Book Now (Request Transfer)'} <Send size={14} />
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
              {step === 4 ? 'Confirm Your Booking' : 'Your Booking Summary'}
            </h3>
          </div>

          <div className="p-4 space-y-2 text-sm">
            
            {step === 4 ? (
              <div className="space-y-4 pt-1 pb-2">
                <p className="text-xs text-gray-600 leading-relaxed">
                  By submitting this request, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>
                
                <div className="bg-green-50/50 border border-green-100 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
                    <Check size={14} className="bg-green-500 text-white rounded-full p-0.5" /> Instant booking request
                  </div>
                  <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
                    <Check size={14} className="bg-green-500 text-white rounded-full p-0.5" /> Confirmation via email & WhatsApp
                  </div>
                  <div className="flex items-center gap-2 text-green-700 text-xs font-semibold">
                    <Check size={14} className="bg-green-500 text-white rounded-full p-0.5" /> Our team will contact you shortly
                  </div>
                </div>
              </div>
            ) : (
              <>
                {selected && (
                  <div className="mb-2 rounded-xl border border-gray-200 bg-gray-50 p-2 flex items-start gap-2">
                    <Car className="text-[#0f172a] mt-0.5 shrink-0" size={16} />
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-gray-500">Selected vehicle</p>
                      <p className="mt-0.5 font-serif text-sm text-[#0f172a] leading-tight">{selected.name}</p>
                      <p className="text-[10px] text-gray-500">{selected.category}</p>
                    </div>
                  </div>
                )}

                <SidebarRow icon={<MapPin size={14} />} label="Pickup" value={outbound?.pickup ?? pickup?.text ?? '—'} />
                <SidebarRow icon={<MapPin size={14} />} label="Destination" value={outbound?.dropoff ?? dropoff?.text ?? '—'} />
                <SidebarRow 
                  icon={<Calendar size={14} />} 
                  label="Date" 
                  value={outbound ? formatDateTime(outbound.starts_at).split(',')[0] : startDate} 
                />
                <SidebarRow 
                  icon={<Clock size={14} />} 
                  label="Time" 
                  value={outbound ? formatDateTime(outbound.starts_at).split(',')[1] : startTime} 
                />
                <SidebarRow 
                  icon={<Users size={14} />} 
                  label="Passengers" 
                  value={`${quote?.passengers ?? partySize}`} 
                />
                <SidebarRow 
                  icon={<Briefcase size={14} />} 
                  label="Luggage" 
                  value={`${bags}`} 
                />

                {roundTrip && (
                  <>
                    <SidebarRow 
                      icon={<Calendar size={14} />} 
                      label="Return" 
                      value={inbound ? formatDateTime(inbound.starts_at) : `${returnDate} ${returnTime}`} 
                    />
                  </>
                )}

                {quote?.route_summary && (
                  <SidebarRow icon={<FileText size={14} />} label="Route" value={routeSummary(quote.route_summary)} />
                )}

                <div className="pt-2">
                  {selected ? (
                    <>
                      <div className="flex items-baseline justify-between border-t border-gray-100 pt-2">
                        <span className="text-sm font-bold text-[#0f172a]">Estimated Total</span>
                        <span className="font-sans text-sm sm:text-xl text-[#0f172a] leading-none">{money(selected.vat.gross)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">Choose a vehicle to see your total price.</p>
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
            <h3 className="text-lg font-serif text-[#0f172a] font-bold" style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor' }}>Need Help?</h3>
          </div>
          <p className="text-xs text-[#0f172a] mb-3">Our team is here to assist you with your booking, special requests or custom travel plans.</p>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1 rounded-full border border-gray-200 py-1.5 text-xs font-bold text-[#0f172a] hover:bg-gray-50"><Phone size={12}/> +41 79 123 45 67</button>
            <button className="flex-1 flex items-center justify-center gap-1 rounded-full border border-gray-200 py-1.5 text-xs font-bold text-[#0f172a] hover:bg-gray-50"><Mail size={12}/> Chat</button>
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
