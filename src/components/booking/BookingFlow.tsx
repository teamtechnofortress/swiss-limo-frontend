'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { PlaceField } from './PlaceField';
import { OfferCard } from './OfferCard';
import { Turnstile } from './Turnstile';
import { CustomerDetailsForm } from './CustomerDetailsForm';
import { Button, Card, Field, inputClass } from '@/components/ui/primitives';
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
  { step: 1, label: 'Journey' },
  { step: 2, label: 'Vehicle' },
  { step: 3, label: 'Details' },
] as const;

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

    console.log('[Public config] Requesting /public/config');
    getPublicConfig()
      .then((publicConfig) => {
        console.log('[Public config] Google Maps browser key:', publicConfig.googleMapsBrowserKey);
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

      // The access token stays in this browser tab only. The booking page reads it from here.
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
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <ol className="mb-12 flex items-center gap-3" aria-label="Booking steps">
          {flowSteps.map(({ step: stepNumber, label }, index) => {
            const done = step > stepNumber;
            const current = step === stepNumber;

            return (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                    current
                      ? 'border-gold bg-gold-gradient text-ink'
                      : done
                        ? 'border-gold text-gold'
                        : 'border-line text-mute'
                  }`}
                >
                  {done ? <Check size={14} /> : index + 1}
                </span>
                <span className={`text-xs uppercase tracking-[0.2em] ${current ? 'text-gold' : 'text-mute'}`}>
                  {label}
                </span>
                {index < flowSteps.length - 1 && <span className="mx-2 h-px w-8 bg-line" />}
              </li>
            );
          })}
        </ol>

        {error && (
          <div role="alert" className="mb-8 rounded-2xl border border-red-400/30 bg-red-950/30 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={findVehicles} className="space-y-8">
            <Field label="Pickup">
              <PlaceField
                id="pickup"
                value={pickup}
                onChange={setPickup}
                placeholder="Address, hotel or airport"
                initialQuery={from}
                googleBrowserKey={googleBrowserKey}
              />
            </Field>

            <Field label="Destination">
              <PlaceField
                id="dropoff"
                value={dropoff}
                onChange={setDropoff}
                placeholder="Address, hotel or airport"
                initialQuery={to}
                googleBrowserKey={googleBrowserKey}
              />
            </Field>

            <div className="grid grid-cols-2 gap-5">
              <Field label="Date">
                <input type="date" className={inputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </Field>
              <Field label="Pickup time">
                <input type="time" className={inputClass} value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </Field>
            </div>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-line px-5 py-4">
              <input
                type="checkbox"
                checked={roundTrip}
                onChange={(e) => setRoundTrip(e.target.checked)}
                className="h-4 w-4 accent-[#c9a96e]"
              />
              <span className="text-sm text-ivory/85">Add a return journey</span>
            </label>

            {roundTrip && (
              <div className="grid grid-cols-2 gap-5">
                <Field label="Return date">
                  <input type="date" className={inputClass} value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required />
                </Field>
                <Field label="Return pickup time">
                  <input type="time" className={inputClass} value={returnTime} onChange={(e) => setReturnTime(e.target.value)} required />
                </Field>
              </div>
            )}

            <div className="grid grid-cols-2 gap-5">
              <Field label="Passengers">
                <select className={inputClass} value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>
              <Field label="Pieces of luggage">
                <select className={inputClass} value={bags} onChange={(e) => setBags(Number(e.target.value))}>
                  {Array.from({ length: 15 }, (_, i) => i).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Turnstile onToken={setTurnstileToken} siteKey={turnstileSiteKey} />

            <Button type="submit" disabled={busy} className="w-full">
              {busy ? 'Checking availability…' : 'View available vehicles'}
              {!busy && <ArrowRight size={16} />}
            </Button>
          </form>
        )}

        {step === 2 && quote && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl">Choose your vehicle</h2>
              <p className="text-xs text-mute">Quote valid until {formatDateTime(quote.expires_at)}</p>
            </div>

            <div className="space-y-4">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.vehicle_id}
                  offer={offer}
                  selected={offer.vehicle_id === selectedId}
                  onSelect={() => setSelectedId(offer.vehicle_id)}
                />
              ))}
            </div>

            <div className="flex flex-col-reverse gap-4 pt-6 sm:flex-row sm:justify-between">
              <Button variant="outline" type="button" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> Change journey
              </Button>
              <Button type="button" disabled={!selected} onClick={() => setStep(3)}>
                Continue <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && quote && selected && (
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
        )}
      </div>

      <aside className="lg:col-span-5">
        <Card className="sticky top-32 p-8">
          <p className="font-serif text-2xl">Your journey</p>
          {selected && (
            <div className="mt-6 rounded-2xl border border-gold/25 bg-ink-raised p-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Selected vehicle</p>
              <p className="mt-2 font-serif text-2xl text-ivory">{selected.name}</p>
              <p className="mt-1 text-sm text-mute">{selected.category}</p>
            </div>
          )}
          <div className="mt-6 space-y-5 text-sm">
            <SummaryRow label="Pickup" value={outbound?.pickup ?? pickup?.text ?? '—'} />
            <SummaryRow label="Destination" value={outbound?.dropoff ?? dropoff?.text ?? '—'} />
            <SummaryRow
              label="Pickup time"
              value={outbound ? formatDateTime(outbound.starts_at) : `${startDate} ${startTime}`}
            />
            {roundTrip && <SummaryRow label="Return pickup" value={inbound ? formatDateTime(inbound.starts_at) : `${returnDate} ${returnTime}`} />}
            {outbound && roundTrip && <SummaryRow label="Outbound route" value={routeSummary(outbound.route)} />}
            {inbound && <SummaryRow label="Return route" value={routeSummary(inbound.route)} />}
            {quote?.route_summary && <SummaryRow label="Total route" value={routeSummary(quote.route_summary)} />}
            <SummaryRow label="Party" value={`${quote?.passengers ?? partySize} passenger${(quote?.passengers ?? partySize) === 1 ? '' : 's'}`} />
          </div>

          <div className="mt-8 border-t hairline pt-6">
            {selected ? (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-mute">Total</span>
                  <span className="font-serif text-4xl text-gold">{money(selected.vat.gross)}</span>
                </div>
                <p className="mt-2 text-right text-xs text-mute">
                  Net {money(selected.vat.net)} · VAT {money(selected.vat.vat)}
                </p>
              </>
            ) : (
              <p className="text-sm text-mute">Choose a vehicle to see your total price.</p>
            )}
          </div>
        </Card>
      </aside>
    </div>
  );
}

function routeSummary(route: RouteMetrics): string {
  const distance = new Intl.NumberFormat('en-CH', { maximumFractionDigits: 1 }).format(route.distance_km);
  return `${distance} km · ${route.duration_minutes} min`;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.25em] text-mute">{label}</p>
      <p className="mt-1 text-ivory/85">{value}</p>
    </div>
  );
}
