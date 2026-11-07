'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, Car, MapPin, Calendar, Clock, 
  Users, Briefcase, FileText, ClipboardList 
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

const lightInput = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 transition focus:border-[#eab308] focus:outline-none focus:ring-1 focus:ring-[#eab308]";
const lightLabel = "mb-1 block text-xs font-bold uppercase tracking-wider text-[#0f172a]";

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

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        
        {/* STEPPER — UNSELECTED CIRCLES GREYISH */}
        <div className="mb-4 rounded-2xl bg-white px-4 md:px-8 py-2 shadow-sm border border-gray-100">
          <ol className="flex items-center justify-between min-w-[400px]" aria-label="Booking steps">
            {flowSteps.map(({ step: stepNumber, label }, index) => {
              const done = step > stepNumber;
              const current = step === stepNumber;

              return (
                <li key={label} className="flex flex-1 items-center relative">
                  <div className="flex flex-col items-center z-10 bg-white px-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                        current
                          ? 'border-[#eab308] bg-[#eab308] text-white'
                          : done
                            ? 'border-[#0f172a] bg-[#0f172a] text-white'
                            : 'border-gray-200 bg-gray-100 text-gray-500' // Greyish bg for unselected
                      }`}
                    >
                      {done ? <Check size={14} /> : index + 1}
                    </span>
                    <span className={`mt-1 text-[11px] font-semibold ${current || done ? 'text-[#0f172a]' : 'text-gray-500'}`}>
                      {label}
                    </span>
                  </div>
                  {index < flowSteps.length - 1 && (
                    <div className={`absolute top-3.5 left-[50%] w-full h-[2px] -z-0 ${done ? 'bg-[#0f172a]' : 'bg-gray-200'}`} />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* ERROR */}
        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* STEP 1 — ADDED SHADOW-LG */}
        {step === 1 && (
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl border border-gray-100">
            <h2 className="mb-5 text-3xl font-serif text-[#0f172a]">Plan Your Journey</h2>
            
            <form onSubmit={findVehicles} className="space-y-4">
              <div>
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

              <div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lightLabel}>Date</label>
                  <input type="date" className={lightInput} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div>
                  <label className={lightLabel}>Pickup time</label>
                  <input type="time" className={lightInput} value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={roundTrip}
                  onChange={(e) => setRoundTrip(e.target.checked)}
                  className="h-4 w-4 accent-[#eab308]"
                />
                <span className="text-sm text-black">Add a return journey</span>
              </label>

              {roundTrip && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lightLabel}>Return date</label>
                    <input type="date" className={lightInput} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
                  </div>
                  <div>
                    <label className={lightLabel}>Return pickup time</label>
                    <input type="time" className={lightInput} value={returnTime} onChange={(e) => setReturnTime(e.target.value)} required />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lightLabel}>Passengers</label>
                  <select className={lightInput} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
                    {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lightLabel}>Pieces of luggage</label>
                  <select className={lightInput} value={bags} onChange={(e) => setBags(Number(e.target.value))}>
                    {Array.from({ length: 15 }, (_, i) => i).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Turnstile onToken={setTurnstileToken} siteKey={turnstileSiteKey} />

              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-6 py-3 text-sm font-bold text-black hover:shadow-lg transition-all disabled:opacity-50"
              >
                {busy ? 'Checking availability…' : 'View available vehicles'}
                {!busy && <ArrowRight size={16} />}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2 — ADDED SHADOW-LG */}
        {step === 2 && quote && (
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-serif text-[#0f172a]">Choose Your Vehicle</h2>
              <p className="text-xs text-gray-400">Quote valid until {formatDateTime(quote.expires_at)}</p>
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

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-50 transition-all"
              >
                <ArrowLeft size={16} /> Change journey
              </button>
              <button
                type="button"
                disabled={!selected}
                onClick={() => setStep(3)}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 py-2.5 text-sm font-bold text-black hover:shadow-lg transition-all disabled:opacity-50"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — ADDED SHADOW-LG */}
        {step === 3 && quote && selected && (
          <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl border border-gray-100">
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
              onSubmit={confirmBooking}
              onBack={() => setStep(vehicle ? 1 : 2)}
              busy={busy}
            />
          </div>
        )}
      </div>

      {/* SIDEBAR — ADDED SHADOW-LG */}
      <aside className="lg:col-span-4">
        <div className="sticky top-24 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="bg-[#0f172a] px-5 py-3 flex items-center gap-2">
            <ClipboardList className="text-[#eab308]" size={18} />
            <h3 className="text-base font-serif text-white">Your Journey</h3>
          </div>

          <div className="p-5 space-y-3 text-sm">
            
            {selected && (
              <div className="mb-2 rounded-xl border border-gray-200 bg-gray-50 p-3 flex items-start gap-3">
                <Car className="text-[#0f172a] mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Selected vehicle</p>
                  <p className="mt-0.5 font-serif text-base text-[#0f172a] leading-tight">{selected.name}</p>
                  <p className="text-xs text-gray-500">{selected.category}</p>
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
                  label="Return pickup" 
                  value={inbound ? formatDateTime(inbound.starts_at) : `${returnDate} ${returnTime}`} 
                />
                {outbound && <SidebarRow icon={<FileText size={14} />} label="Outbound route" value={routeSummary(outbound.route)} />}
                {inbound && <SidebarRow icon={<FileText size={14} />} label="Return route" value={routeSummary(inbound.route)} />}
              </>
            )}

            {quote?.route_summary && (
              <SidebarRow icon={<FileText size={14} />} label="Total route" value={routeSummary(quote.route_summary)} />
            )}

            <div className="pt-2">
              {selected ? (
                <>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-[#0f172a]">Estimated Total</span>
                    <span className="font-serif text-2xl text-[#0f172a]">{money(selected.vat.gross)}</span>
                  </div>
                  <p className="mt-1 text-right text-xs text-gray-500">
                    Net {money(selected.vat.net)} · VAT {money(selected.vat.vat)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Choose a vehicle to see your total price.</p>
              )}
            </div>
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
    <div className="flex items-start gap-3">
      <div className="text-[#0f172a] mt-0.5 shrink-0 w-5 flex justify-center">
        {icon}
      </div>
      <div className="flex-1 grid grid-cols-[80px_1fr] gap-2 items-baseline">
        <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-sm font-bold text-[#0f172a] leading-snug truncate">{value}</p>
      </div>
    </div>
  );
}