'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock3, MapPin, Minus, Plus } from 'lucide-react';
import { OfferCard } from '@/components/booking/OfferCard';
import { PlaceField } from '@/components/booking/PlaceField';
import { Turnstile } from '@/components/booking/Turnstile';
import { Button, Card, Field, inputClass } from '@/components/ui/primitives';
import { api, ApiError } from '@/lib/api';
import { formatDateTime, money, zurichToday } from '@/lib/format';
import { createPublicBooking, resolveCheckoutUrl } from '@/lib/public-booking';
import { getPublicConfig } from '@/lib/public-config';
import type { PaymentMethodKey, PlaceValue, Quote, QuoteOffer } from '@/lib/types';
import type { TripBookingAddon, TripBookingConfig, TripBookingPickupLocation } from '@/lib/trip-booking';

const PAYMENT_OPTIONS: Record<PaymentMethodKey, { title: string; text: string }> = {
  online: {
    title: 'Pay online',
    text: 'Secure card or Apple Pay payment. Your booking is confirmed once payment is received.',
  },
  cash_on_arrival: {
    title: 'Pay on arrival',
    text: 'Pay your chauffeur in cash. Confirm your booking from the link in your email.',
  },
};

const STEPS = [
  { number: 1, label: 'Trip details' },
  { number: 2, label: 'Vehicle' },
  { number: 3, label: 'Your details' },
] as const;

function messageOf(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
}

function apiPath(endpoint: string): string {
  return endpoint.startsWith('/api/') ? endpoint.slice(4) : endpoint;
}

function durationLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours === 0) return `${remaining} min`;
  return remaining === 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : `${hours}h ${remaining} min`;
}

function travellerLimitLabel(minimum: number, maximum: number): string {
  if (minimum === maximum) return `This trip is for ${minimum} ${minimum === 1 ? 'traveller' : 'travellers'}.`;
  return `This trip is for ${minimum}–${maximum} travellers.`;
}

export function TripBookingFlow({ config }: { config: TripBookingConfig }) {
  const router = useRouter();
  const { booking, trip } = config;
  const enquiryHref = `/contact?trip=${encodeURIComponent(trip.slug)}`;
  const [step, setStep] = useState(1);
  const [pickupId, setPickupId] = useState<number | null>(booking.pickup.locations[0]?.id ?? null);
  const [customPickup, setCustomPickup] = useState<PlaceValue | null>(null);
  const [travelDate, setTravelDate] = useState(zurichToday());
  const [departureId, setDepartureId] = useState<number | null>(booking.schedule.fixedDepartures[0]?.id ?? null);
  const [customDepartureTime, setCustomDepartureTime] = useState('09:00');
  const [travellers, setTravellers] = useState<number | null>(
    booking.travellers.limitsApplied ? booking.travellers.min : null,
  );
  const [addonQuantities, setAddonQuantities] = useState<Record<number, number>>({});
  const [quote, setQuote] = useState<Quote | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentMethodKey>('online');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [flight, setFlight] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [googleBrowserKey, setGoogleBrowserKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingUnavailable, setBookingUnavailable] = useState(false);

  const selectedPickup = booking.pickup.locations.find((location) => location.id === pickupId) ?? null;
  const offers = quote?.offers ?? [];
  const selectedOffer = offers.find((offer) => offer.vehicle_id === selectedVehicleId) ?? null;
  const selectedDeparture = booking.schedule.fixedDepartures.find((departure) => departure.id === departureId) ?? null;
  const startingPrice = booking.pricing.mode === 'fixed'
    ? selectedPickup?.startingFromPriceMinor ?? booking.pricing.startingFromPriceMinor
    : null;
  const configurationUnavailable =
    (booking.pickup.mode === 'selected' && booking.pickup.locations.length === 0) ||
    (booking.schedule.mode === 'fixed' && booking.schedule.fixedDepartures.length === 0);
  const addonTotal = useMemo(
    () => booking.addons.reduce((total, addon) => total + addon.priceMinor * (addonQuantities[addon.id] ?? 0), 0),
    [addonQuantities, booking.addons],
  );

  useEffect(() => {
    let active = true;

    getPublicConfig()
      .then((publicConfig) => {
        if (!active) return;
        setGoogleBrowserKey(publicConfig.googleMapsBrowserKey);
        setTurnstileSiteKey(publicConfig.turnstileEnabled ? publicConfig.turnstileSiteKey : '');
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  function setAddonQuantity(addon: TripBookingAddon, quantity: number) {
    setAddonQuantities((current) => ({ ...current, [addon.id]: Math.max(0, Math.min(addon.maxQuantity, quantity)) }));
  }

  async function requestQuote(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const pickup = booking.pickup.mode === 'selected'
      ? selectedPickup && { placeId: selectedPickup.placeId, address: selectedPickup.address }
      : customPickup && { placeId: customPickup.placeId, address: customPickup.text };

    if (!pickup) {
      setError(booking.pickup.mode === 'selected' ? 'Please choose one of the approved pickup locations.' : 'Please choose your pickup address from the suggestions.');
      return;
    }
    if (travellers === null) {
      setError('Please select a traveller count from the suggestions.');
      return;
    }
    if (booking.schedule.mode === 'fixed' && !selectedDeparture) {
      setError('Please choose an available departure time.');
      return;
    }
    if (!booking.flow.quoteEndpoint) {
      setBookingUnavailable(true);
      return;
    }

    setBusy(true);
    try {
      const departurePayload = booking.schedule.mode === 'fixed'
        ? { departure_id: selectedDeparture!.id }
        : { custom_departure_time: customDepartureTime };
      const addons = Object.fromEntries(
        Object.entries(addonQuantities).filter(([, quantity]) => quantity > 0),
      );
      const response = await api<{ data: Quote }>(apiPath(booking.flow.quoteEndpoint), {
        method: 'POST',
        body: JSON.stringify({
          travel_date: travelDate,
          ...departurePayload,
          travellers,
          pickup_place_id: pickup.placeId,
          pickup_address: pickup.address,
          addons,
          ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
        }),
      });

      setQuote(response.data);
      setSelectedVehicleId(null);
      setPayment(response.data.payment_methods[0] ?? 'online');
      setTurnstileToken(null);
      setStep(2);
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === 'trip_enquiry_only') {
        setBookingUnavailable(true);
      } else if (caught instanceof ApiError && caught.code === 'trip_traveller_limit') {
        setError(caught.message);
      } else {
        setError(messageOf(caught));
      }
    } finally {
      setBusy(false);
    }
  }

  async function confirmBooking(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!quote || !selectedOffer) {
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
        vehicleId: selectedOffer.vehicle_id,
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
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === 'trip_booking_unavailable') {
        setBookingUnavailable(true);
      } else if (caught instanceof ApiError && ['quote_unavailable', 'slot_unavailable', 'vehicle_not_in_quote'].includes(caught.code)) {
        setQuote(null);
        setStep(1);
        setSelectedVehicleId(null);
        setError('This vehicle or quote is no longer available. Please check availability again.');
      } else {
        setError(messageOf(caught));
      }
    } finally {
      setBusy(false);
    }
  }

  if (bookingUnavailable || configurationUnavailable) {
    return (
      <Card className="mx-auto max-w-2xl p-8 text-center md:p-10">
        <p className="font-serif text-3xl">Online booking is unavailable</p>
        <p className="mx-auto mt-5 max-w-lg leading-relaxed text-mute">
          {bookingUnavailable
            ? 'Online booking is no longer available for this trip. Please send us an enquiry instead.'
            : 'This trip does not currently have enough booking information to be reserved online. Please send us an enquiry instead.'}
        </p>
        <div className="mt-8 flex justify-center">
          <Button type="button" onClick={() => router.push(enquiryHref)}>Send an enquiry <ArrowRight size={16} /></Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <BookingProgress step={step} />
        {error && (
          <div role="alert" className="mb-8 rounded-2xl border border-red-400/30 bg-red-950/30 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={requestQuote} className="space-y-8">
            <div>
              <h2 className="text-3xl">Plan your trip</h2>
              <p className="mt-3 text-sm leading-relaxed text-mute">Complete these details to see the vehicles and current prices available for your trip.</p>
            </div>

            {booking.pickup.mode === 'selected' ? (
              <Field label="Pickup location" hint="This trip can start only from one of the approved locations.">
                <div className="grid gap-3">
                  {booking.pickup.locations.map((location) => (
                    <PickupLocationOption
                      key={location.id}
                      location={location}
                      selected={pickupId === location.id}
                      onSelect={() => setPickupId(location.id)}
                    />
                  ))}
                </div>
              </Field>
            ) : (
              <Field label="Pickup address">
                <PlaceField
                  id="trip-pickup"
                  value={customPickup}
                  onChange={setCustomPickup}
                  placeholder="Address, hotel or airport"
                  googleBrowserKey={googleBrowserKey}
                />
              </Field>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Travel date" hint={booking.schedule.minNoticeHours > 0 ? `At least ${booking.schedule.minNoticeHours} hours’ notice is required.` : undefined}>
                <input type="date" className={inputClass} min={zurichToday()} value={travelDate} onChange={(event) => setTravelDate(event.target.value)} required={booking.schedule.dateRequired} />
              </Field>
              {booking.schedule.mode === 'fixed' ? (
                <Field label="Departure time">
                  <select className={inputClass} value={departureId ?? ''} onChange={(event) => setDepartureId(Number(event.target.value))} required>
                    {booking.schedule.fixedDepartures.map((departure) => (
                      <option key={departure.id} value={departure.id}>{departure.startTime}</option>
                    ))}
                  </select>
                </Field>
              ) : (
                <Field label="Preferred departure time">
                  <input type="time" className={inputClass} value={customDepartureTime} onChange={(event) => setCustomDepartureTime(event.target.value)} required />
                </Field>
              )}
            </div>

            <Field
              label="Travellers"
              hint={booking.travellers.limitsApplied
                ? travellerLimitLabel(booking.travellers.min, booking.travellers.max)
                : 'Enter and select the number of travellers so we can show suitable vehicles.'}
            >
              {booking.travellers.limitsApplied ? (
                <select className={inputClass} value={travellers ?? ''} onChange={(event) => setTravellers(Number(event.target.value))}>
                  {Array.from({ length: booking.travellers.max - booking.travellers.min + 1 }, (_, index) => booking.travellers.min + index).map((count) => (
                    <option key={count} value={count}>{count} {count === 1 ? 'traveller' : 'travellers'}</option>
                  ))}
                </select>
              ) : (
                <TravellerCountInput value={travellers} onSelect={setTravellers} />
              )}
            </Field>

            {booking.addons.length > 0 && (
              <fieldset>
                <legend className="text-xs uppercase tracking-[0.2em] text-mute">Optional extras</legend>
                <div className="mt-4 space-y-3">
                  {booking.addons.map((addon) => (
                    <AddonQuantity
                      key={addon.id}
                      addon={addon}
                      quantity={addonQuantities[addon.id] ?? 0}
                      onChange={(quantity) => setAddonQuantity(addon, quantity)}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            <Turnstile onToken={setTurnstileToken} siteKey={turnstileSiteKey} />
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? 'Checking availability…' : 'View available vehicles'} {!busy && <ArrowRight size={16} />}
            </Button>
          </form>
        )}

        {step === 2 && quote && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-3xl">Choose your vehicle</h2>
                <p className="mt-2 text-sm text-mute">Final price includes the trip details and extras you selected.</p>
              </div>
              <p className="text-xs text-mute">Quote valid until {formatDateTime(quote.expires_at)}</p>
            </div>
            <div className="space-y-4">
              {offers.map((offer) => (
                <OfferCard key={offer.vehicle_id} offer={offer} selected={offer.vehicle_id === selectedVehicleId} onSelect={() => setSelectedVehicleId(offer.vehicle_id)} />
              ))}
            </div>
            <div className="flex flex-col-reverse gap-4 pt-6 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft size={16} /> Change trip details</Button>
              <Button type="button" disabled={!selectedOffer} onClick={() => setStep(3)}>Continue <ArrowRight size={16} /></Button>
            </div>
          </div>
        )}

        {step === 3 && quote && selectedOffer && (
          <form onSubmit={confirmBooking} className="space-y-8">
            <div>
              <h2 className="text-3xl">Your details</h2>
              <p className="mt-3 text-sm text-mute">We will send your confirmation and trip details to these contacts.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name"><input className={inputClass} value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} autoComplete="name" required /></Field>
              <Field label="Email"><input type="email" className={inputClass} value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} autoComplete="email" required /></Field>
              <Field label="Mobile phone"><input type="tel" className={inputClass} value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} autoComplete="tel" required /></Field>
              <Field label="Flight number (optional)"><input className={inputClass} value={flight} onChange={(event) => setFlight(event.target.value.toUpperCase())} placeholder="LX 1234" /></Field>
            </div>

            <fieldset>
              <legend className="text-xs uppercase tracking-[0.2em] text-mute">Payment method</legend>
              <div className="mt-4 grid gap-4">
                {quote.payment_methods.map((method) => (
                  <label key={method} className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition ${payment === method ? 'border-gold bg-ink-raised' : 'border-line hover:border-gold/50'}`}>
                    <input type="radio" name="payment" value={method} checked={payment === method} onChange={() => setPayment(method)} className="mt-1 accent-[#c9a96e]" />
                    <span><span className="block text-base">{PAYMENT_OPTIONS[method].title}</span><span className="mt-1 block text-sm text-mute">{PAYMENT_OPTIONS[method].text}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Turnstile onToken={setTurnstileToken} siteKey={turnstileSiteKey} />
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</Button>
              <Button type="submit" disabled={busy}>{busy ? 'Please wait…' : payment === 'online' ? 'Continue to secure payment' : 'Confirm booking'} {!busy && <ArrowRight size={16} />}</Button>
            </div>
          </form>
        )}
      </div>

      <aside className="lg:col-span-5">
        <Card className="sticky top-32 p-8">
          {trip.coverUrl && (
            // Images are maintained by the trip CMS, so a native image avoids a fixed host allow-list.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={trip.coverUrl} alt="" className="mb-7 aspect-[16/8] w-full rounded-2xl object-cover" />
          )}
          <p className="font-serif text-2xl">{trip.title}</p>
          {trip.subtitle && <p className="mt-2 text-sm text-mute">{trip.subtitle}</p>}
          <dl className="mt-7 space-y-5 text-sm">
            <SummaryRow label="Pickup" value={selectedPickup?.name ?? customPickup?.text ?? 'Choose a pickup'} />
            <SummaryRow label="Date" value={travelDate} />
            <SummaryRow label="Departure" value={selectedDeparture?.startTime ?? customDepartureTime} />
            <SummaryRow label="Travellers" value={travellers === null ? 'Choose traveller count' : `${travellers} ${travellers === 1 ? 'traveller' : 'travellers'}`} />
            {selectedPickup && <SummaryRow label="Trip duration" value={durationLabel(selectedPickup.durationMinutes)} />}
          </dl>
          <div className="mt-8 border-t hairline pt-6">
            {selectedOffer ? (
              <>
                <SummaryRow label="Selected vehicle" value={selectedOffer.name} />
                <div className="mt-5 flex items-baseline justify-between"><span className="text-sm text-mute">Total</span><span className="font-serif text-4xl text-gold">{money(selectedOffer.vat.gross)}</span></div>
              </>
            ) : startingPrice !== null ? (
              <>
                <div className="flex items-baseline justify-between"><span className="text-sm text-mute">Starting from</span><span className="font-serif text-3xl text-gold">{money(startingPrice + addonTotal)}</span></div>
                <p className="mt-2 text-xs leading-relaxed text-mute">Vehicle availability and your final price are confirmed in the next step.</p>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-mute">Your final price is calculated once we check the selected date and available vehicles.</p>
            )}
          </div>
        </Card>
      </aside>
    </div>
  );
}

function BookingProgress({ step }: { step: number }) {
  return (
    <ol className="mb-12 flex items-center gap-3" aria-label="Booking steps">
      {STEPS.map(({ number, label }, index) => {
        const done = step > number;
        const current = step === number;
        return (
          <li key={label} className="flex items-center gap-3">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${current ? 'border-gold bg-gold-gradient text-ink' : done ? 'border-gold text-gold' : 'border-line text-mute'}`}>{done ? <Check size={14} /> : number}</span>
            <span className={`text-xs uppercase tracking-[0.2em] ${current ? 'text-gold' : 'text-mute'}`}>{label}</span>
            {index < STEPS.length - 1 && <span className="mx-1 h-px w-5 bg-line sm:mx-2 sm:w-8" />}
          </li>
        );
      })}
    </ol>
  );
}

function PickupLocationOption({ location, selected, onSelect }: { location: TripBookingPickupLocation; selected: boolean; onSelect: () => void }) {
  return (
    <label className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition ${selected ? 'border-gold bg-ink-raised' : 'border-line hover:border-gold/50'}`}>
      <input type="radio" name="pickup" checked={selected} onChange={onSelect} className="mt-1 accent-[#c9a96e]" />
      <span>
        <span className="block font-medium text-ivory">{location.name}</span>
        <span className="mt-1 flex items-start gap-2 text-sm text-mute"><MapPin size={14} className="mt-0.5 shrink-0 text-gold" />{location.address}</span>
        <span className="mt-2 inline-flex items-center gap-2 text-xs text-gold"><Clock3 size={14} />About {durationLabel(location.durationMinutes)}</span>
        {location.startingFromPriceMinor !== null && <span className="mt-2 block text-sm text-gold">From {money(location.startingFromPriceMinor)}</span>}
      </span>
    </label>
  );
}

function AddonQuantity({ addon, quantity, onChange }: { addon: TripBookingAddon; quantity: number; onChange: (quantity: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-line p-5">
      <div>
        <p className="text-ivory">{addon.name}</p>
        {addon.description && <p className="mt-1 text-sm text-mute">{addon.description}</p>}
        <p className="mt-2 text-sm text-gold">{money(addon.priceMinor)} each</p>
      </div>
      <div className="flex items-center gap-3" aria-label={`${addon.name} quantity`}>
        <Button type="button" variant="outline" className="h-9 w-9 px-0" disabled={quantity === 0} onClick={() => onChange(quantity - 1)} aria-label={`Remove ${addon.name}`}><Minus size={15} /></Button>
        <span className="w-4 text-center text-sm" aria-live="polite">{quantity}</span>
        <Button type="button" variant="outline" className="h-9 w-9 px-0" disabled={quantity === addon.maxQuantity} onClick={() => onChange(quantity + 1)} aria-label={`Add ${addon.name}`}><Plus size={15} /></Button>
      </div>
    </div>
  );
}

/** An open-range traveller picker: the quote value changes only after a suggestion is chosen. */
function TravellerCountInput({ value, onSelect }: { value: number | null; onSelect: (value: number | null) => void }) {
  const travellerLabel = (count: number) => `${count} ${count === 1 ? 'traveller' : 'travellers'}`;
  const [text, setText] = useState(value === null ? '' : travellerLabel(value));
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const selectedCount = useRef<number | null>(value);
  const suggestions = Array.from({ length: 30 }, (_, index) => index + 1).filter((count) =>
    text.trim() === '' || String(count).startsWith(text.trim()),
  );

  function selectCount(count: number) {
    setText(travellerLabel(count));
    setInvalid(false);
    selectedCount.current = count;
    onSelect(count);
    setOpen(false);
  }

  function handleBlur() {
    window.setTimeout(() => {
      if (selectedCount.current !== null) return;
      setText('Select travellers');
      setInvalid(true);
      setOpen(false);
    }, 150);
  }

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && suggestions.length > 0}
        aria-controls="traveller-count-suggestions"
        className={`${inputClass} ${invalid ? 'border-red-400 focus:border-red-400 focus:ring-red-400/60' : ''}`}
        value={text}
        placeholder="Type a number, e.g. 20"
        onFocus={() => {
          if (value === null && text === 'Select travellers') setText('');
          setOpen(true);
        }}
        onBlur={handleBlur}
        onChange={(event) => {
          setText(event.target.value.replace(/\D/g, '').slice(0, 2));
          selectedCount.current = null;
          onSelect(null);
          setInvalid(false);
          setOpen(true);
        }}
      />
      {open && suggestions.length > 0 && (
        <ul id="traveller-count-suggestions" role="listbox" className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-gold/25 bg-ink-raised shadow-gold">
          {suggestions.map((count) => (
            <li key={count}>
              <button
                type="button"
                role="option"
                aria-selected={value === count}
                className="w-full px-5 py-3 text-left text-sm text-ivory/85 transition hover:bg-gold/10 hover:text-gold"
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectCount(count);
                }}
              >
                {travellerLabel(count)}
              </button>
            </li>
          ))}
        </ul>
      )}
      {invalid && <p className="mt-2 text-xs text-red-300">Traveller not selected.</p>}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[10px] uppercase tracking-[0.25em] text-mute">{label}</dt><dd className="mt-1 text-ivory/85">{value}</dd></div>;
}
