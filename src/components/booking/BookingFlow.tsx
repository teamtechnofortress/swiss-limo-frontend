'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
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

const lightInput = "w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-[#0f172a] placeholder:text-gray-400 transition focus:border-[#eab308] focus:outline-none focus:ring-1 focus:ring-[#eab308]";
const lightLabel = "mb-1 block text-[11px]  uppercase tracking-wider text-[#0f172a]";

function messageOf(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
}

export function BookingFlow({ from, to, date, time, passengers, vehicle }: BookingFlowProps) {
  const router = useRouter();

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

  async function findVehicles(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!pickup || !dropoff) {
      setError('Please choose both addresses from the suggestions.');
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
    setStep(4);
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12 items-start min-w-0 w-full max-w-full">
      <div className="lg:col-span-8 min-w-0 w-full max-w-full">
        
<div className="mb-4 rounded-2xl bg-white px-2 md:px-8 py-2 border-2 border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
  <ol className="flex items-center justify-between w-full" aria-label="Booking steps">
             {flowSteps.map(({ step: stepNumber, label }, index) => {
              const done = step > stepNumber;
              const current = step === stepNumber;

              return (
                <li key={label} className="flex flex-1 items-center relative">
                  <div className="flex flex-col items-center z-10 bg-white px-2">
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
                    <span className={`mt-1 text-[10px] md:text-[11px] font-semibold ${current || done ? 'text-[#0f172a]' : 'text-gray-500'}`}>
                      {label}
                    </span>
                  </div>
                  {index < flowSteps.length - 1 && (
                    <div className={`absolute top-3 left-[50%] w-full h-[2px] -z-0 ${done ? 'bg-[#0f172a]' : 'bg-gray-200'}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="rounded-2xl bg-white p-4 md:p-6 border-2 border-gray-200 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)]">
            
            <div className="mb-4">
              <p className="text-[14px] md:text-[16px] font-bold text-[#eab308] tracking-wider mb-1">
                Step 1 of 4
              </p>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#0f172a]" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>                 
                Plan Your Journey
              </h2>
            </div>
            
            <form onSubmit={findVehicles} className="space-y-3 md:space-y-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 w-full">
                
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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

              <div className="flex items-center gap-2 pt-0">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={roundTrip}
                    onChange={(e) => setRoundTrip(e.target.checked)}
                    className="h-4 w-4 accent-[#eab308]"
                  />
                  <span className="text-xs font-bold text-black uppercase tracking-wider">Add a return journey</span>
                </label>
              </div>

              {roundTrip && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
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

              <div className="h-[13px] relative overflow-hidden flex items-start -mb-4">
                <Turnstile onToken={setTurnstileToken} siteKey={turnstileSiteKey} />
              </div>

              <div className="flex justify-center w-full relative z-10 pt-4 md:pt-0">
                <button type="submit" disabled={busy} className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-8 py-2.5 text-sm font-bold text-black hover:shadow-lg transition-all disabled:opacity-50">
                  {busy ? 'Checking availability…' : 'Continue to choose vehicle'}
                  {!busy && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          </div>
        )}

                {step === 2 && quote && (
          <div className="rounded-2xl bg-white p-4 md:p-6 border-2 border-gray-200 shadow-xl">
            
            <div className="mb-4">
              <p className="text-[14px] md:text-[16px] font-bold text-[#eab308] tracking-wider mb-1">
                Step 2 of 4
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#0f172a]" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>
                  Choose Your Vehicle
                </h2>
              </div>
            </div>

            <div className="space-y-3 pb-2">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.vehicle_id}
                  offer={offer}
                  selected={offer.vehicle_id === selectedId}
                  onSelect={() => setSelectedId(offer.vehicle_id)}
                />
              ))}
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 mt-2 border-t border-gray-100 sm:flex-row sm:justify-between shrink-0">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-50 transition-all w-full sm:w-auto"
              >
                <ArrowLeft size={16} /> Change journey
              </button>
              <button
                type="button"
                disabled={!selected}
                onClick={() => setStep(3)}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 py-2.5 text-sm font-bold text-black hover:shadow-lg transition-all disabled:opacity-50 w-full sm:w-auto"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && quote && selected && (
          <div className="rounded-2xl bg-white p-5 md:p-6 border-2 border-gray-200 shadow-xl">
            <CustomerDetailsForm
              customer={customer}
              onCustomerChange={setCustomer}
              flightNumber={flight}
              onFlightNumberChange={setFlight}
              paymentMethods={quote.payment_methods}
              payment={payment}
              onPaymentChange={setPayment}
              turnstileSiteKey={turnstileSiteKey}
              onTurnstileToken={setTurnstileToken}
              onSubmit={handleStep3Continue} 
              onBack={() => setStep(vehicle ? 1 : 2)}
              busy={busy}
            />
          </div>
        )}

        {step === 4 && quote && selected && (
          <div className="rounded-2xl bg-white p-4 md:p-5 border border-gray-300 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.25)]">
            <div className="mb-4">
              <p className="text-[14px] font-bold text-[#eab308] tracking-wider mb-0.5">
                Step 4 of 4
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0f172a]" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>                 
                Review & Book
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Please review your booking details and confirm your request.</p>
            </div>

            <form onSubmit={confirmBooking} className="space-y-3">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Journey Details */}
                <div className="rounded-xl border border-gray-200 p-3 bg-white shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5"><MapPin size={12} /> Journey Details</h3>
                    <button type="button" onClick={() => setStep(1)} className="text-[#eab308] text-[10px] font-bold hover:underline flex items-center gap-0.5"><FileText size={10} /> Edit</button>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-black">From</span><span className="font-semibold text-[#0f172a] text-right truncate max-w-[150px]">{outbound?.pickup ?? pickup?.text}</span></div>
                    <div className="flex justify-between"><span className="text-black">To</span><span className="font-semibold text-[#0f172a] text-right truncate max-w-[150px]">{outbound?.dropoff ?? dropoff?.text}</span></div>
                    <div className="flex justify-between"><span className="text-black">Date</span><span className="font-semibold text-[#0f172a]">{outbound ? formatDateTime(outbound.starts_at).split(',')[0] : startDate}</span></div>
                    <div className="flex justify-between"><span className="text-black">Time</span><span className="font-semibold text-[#0f172a]">{outbound ? formatDateTime(outbound.starts_at).split(',')[1] : startTime}</span></div>
                    <div className="flex justify-between"><span className="text-black">Distance</span><span className="font-semibold text-[#0f172a]">{quote.route_summary ? routeSummary(quote.route_summary) : '—'}</span></div>
                  </div>
                </div>

                {/* Selected Vehicle */}
                <div className="rounded-xl border border-gray-200 p-3 bg-white shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[11px] font-black  uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5"><Car size={12} /> Selected Vehicle</h3>
                    <button type="button" onClick={() => setStep(2)} className="text-[#eab308] text-[10px] font-bold hover:underline flex items-center gap-0.5"><FileText size={10} /> Edit</button>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center"><Car className="text-gray-400" size={20} /></div>
                    <div>
                      <p className="font-serif font-bold text-xs text-[#0f172a]">{selected.name}</p>
                      <p className="text-[10px] text-gray-500">{selected.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-[10px] text-gray-600 mt-1">
                    <span className="flex items-center gap-1"><Users size={10} /> {quote.passengers} Passengers</span>
                    <span className="flex items-center gap-1"><Briefcase size={10} /> {bags} Bags</span>
                  </div>
                </div>

                {/* Your Details */}
                <div className="rounded-xl border border-gray-200 p-3 bg-white shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-[11px] font-black  uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5"><Users size={12} /> Your Details</h3>
                    <button type="button" onClick={() => setStep(3)} className="text-[#eab308] text-[10px] font-bold hover:underline flex items-center gap-0.5"><FileText size={10} /> Edit</button>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-black">Full Name</span><span className="font-semibold text-[#0f172a]">{customer.name}</span></div>
                    <div className="flex justify-between"><span className="text-black">Email</span><span className="font-semibold text-[#0f172a] truncate max-w-[150px]">{customer.email}</span></div>
                    <div className="flex justify-between"><span className="text-black">Phone</span><span className="font-semibold text-[#0f172a]">{customer.phone}</span></div>
                    <div className="flex justify-between"><span className="text-black">Flight Number</span><span className="font-semibold text-[#0f172a]">{flight || '—'}</span></div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="rounded-xl border border-gray-200 p-3 bg-gray-50/50 shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_2px_5px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <h3 className="text-[11px] font-black  uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5 mb-2"><FileText size={12} /> Price Summary</h3>
                  <div className="space-y-1.5 text-xs mb-2">
                    <div className="flex justify-between">
                      <span className="text-black">Distance</span>
                      <span className="font-semibold text-[#0f172a]">{quote.route_summary ? `${quote.route_summary.distance_km} km` : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Rate per km</span>
                      <span className="font-semibold text-[#0f172a]">{money(selected.vat.gross / (quote.route_summary?.distance_km || 1))}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                    <span className="font-bold text-sm text-[#0f172a]">Estimated Total</span>
                    <span className="font-serif text-xl font-bold text-[#eab308]">{money(selected.vat.gross)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center -mt-24 h-[28px] overflow-hidden">
                <Turnstile onToken={setTurnstileToken} siteKey={turnstileSiteKey} />
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between items-center relative -top-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-gray-50 transition-all w-full sm:w-auto"
                >
                  <ArrowLeft size={14} /> Back to Details
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 py-1.5 text-xs font-bold text-black hover:shadow-lg transition-all disabled:opacity-50 w-full sm:w-auto"
                >
                  {busy ? 'Processing...' : 'Book Now (Request Transfer)'} <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <aside className="lg:col-span-4 mt-4 lg:mt-[77px] sticky top-24">
        <div className="rounded-2xl bg-white border-2 border-gray-200 shadow-xl   shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] overflow-hidden">
          
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
                        <span className="font-serif text-xl text-[#0f172a]">{money(selected.vat.gross)}</span>
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

        <div className="mt-4 rounded-2xl bg-white border-2 border-gray-200 shadow-xl p-4  shadow-[0_15px_40px_-10px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[#eab308]">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-serif text-[#0f172a] font-bold">Need Help?</h3>
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
    <div className="flex items-start gap-2">
      <div className="text-[#0f172a] mt-0.5 shrink-0 w-4 flex justify-center">
        {icon}
      </div>
      <div className="flex-1 flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-wider text-[#0f172a]">{label}</p>
        <p className="text-xs font-bold text-[#0f172a] whitespace-nowrap overflow-hidden text-ellipsis leading-[1.6]">{value}</p>
      </div>
    </div>
  );
}