'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Minus, Plus, Users } from 'lucide-react';
import { CustomerDetailsForm } from '@/components/booking/CustomerDetailsForm';
import { Turnstile } from '@/components/booking/Turnstile';
import { Button, Card, Field, inputClass } from '@/components/ui/primitives';
import { ApiError } from '@/lib/api';
import { addDays, formatDateTime, money, zurichToday } from '@/lib/format';
import { createPublicBooking, resolveCheckoutUrl } from '@/lib/public-booking';
import { getPublicConfig } from '@/lib/public-config';
import { getTripQuote, type TripJourneyConfig, type TripVehicleOffer } from '@/lib/trip-journey';
import type { PaymentMethodKey } from '@/lib/types';

export interface SelectedTripPickup {
  placeId: string;
  address: string;
  name: string;
}

function travellerLimitLabel(minimum: number, maximum: number): string {
  return minimum === maximum
    ? `This trip is for ${minimum} ${minimum === 1 ? 'traveller' : 'travellers'}.`
    : `This trip is for ${minimum}–${maximum} travellers.`;
}

export function TripJourneyVehicles({
  pickup,
  config,
  activeStep,
  onQuoteReady,
  onQuoteInvalidated,
  onVehicleSelected,
  onProceedToDetails,
  onReturnToJourney,
  onReturnToVehicles,
  enquiryHref,
}: {
  pickup: SelectedTripPickup;
  config: TripJourneyConfig;
  activeStep: 1 | 2 | 3 | 4;
  onQuoteReady: () => void;
  onQuoteInvalidated: () => void;
  onVehicleSelected: (vehicle: TripVehicleOffer) => void;
  onProceedToDetails: () => void;
  onReturnToJourney: () => void;
  onReturnToVehicles: () => void;
  enquiryHref: string;
}) {
  const router = useRouter();
  const earliestTravelDate = addDays(zurichToday(), Math.ceil(config.schedule.minNoticeHours / 24));
  const [travelDate, setTravelDate] = useState(earliestTravelDate);
  const [departureId, setDepartureId] = useState<number | null>(config.schedule.fixedDepartures[0]?.id ?? null);
  const [customDepartureTime, setCustomDepartureTime] = useState('09:00');
  const [travellers, setTravellers] = useState<number | null>(config.travellers.limitsApplied ? config.travellers.min : null);
  const [addonQuantities, setAddonQuantities] = useState<Record<number, number>>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [quote, setQuote] = useState<Awaited<ReturnType<typeof getTripQuote>>>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentMethodKey>('online');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [flight, setFlight] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingUnavailable, setBookingUnavailable] = useState(false);

  const selectedDeparture = config.schedule.fixedDepartures.find((departure) => departure.id === departureId) ?? null;
  const selectedOffer = quote?.offers.find((offer) => offer.vehicleId === selectedOfferId) ?? null;
  useEffect(() => {
    let active = true;
    getPublicConfig().then((publicConfig) => {
      if (active && publicConfig.turnstileEnabled) setTurnstileSiteKey(publicConfig.turnstileSiteKey);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  function invalidateQuote() {
    if (quote) onQuoteInvalidated();
    setQuote(null);
    setSelectedOfferId(null);
  }

  async function requestQuote(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (travellers === null) {
      setError('Please select a traveller count from the suggestions.');
      return;
    }
    if (config.schedule.mode === 'fixed' && !selectedDeparture) {
      setError('Please select an available departure time.');
      return;
    }
    if (!config.startBookingAllowed || !config.quoteEndpoint) {
      setError('Online booking is no longer available for this trip. Please send us an enquiry instead.');
      return;
    }

    setBusy(true);
    try {
      const addons = Object.fromEntries(Object.entries(addonQuantities).filter(([, quantity]) => quantity > 0));
      const response = await getTripQuote(config.quoteEndpoint, {
        pickup_place_id: pickup.placeId,
        pickup_address: pickup.address,
        travel_date: travelDate,
        ...(config.schedule.mode === 'fixed' ? { departure_id: selectedDeparture!.id } : { custom_departure_time: customDepartureTime }),
        travellers,
        addons,
        ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
      });
      if (!response) throw new Error('We could not read the available vehicles. Please try again.');
      setQuote(response);
      setSelectedOfferId(null);
      setPayment(response.paymentMethods[0] ?? 'online');
      setTurnstileToken(null);
      onQuoteReady();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : caught instanceof Error ? caught.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function confirmBooking(event: FormEvent<HTMLFormElement>) {
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
        vehicleId: selectedOffer.vehicleId,
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
        invalidateQuote();
        onReturnToJourney();
        setError('This vehicle or quote is no longer available. Please check availability again.');
      } else {
        setError(caught instanceof ApiError ? caught.message : caught instanceof Error ? caught.message : 'Something went wrong. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  if (bookingUnavailable) {
    return (
      <Card className="mt-10 p-8 text-center md:p-10">
        <p className="font-serif text-3xl">Online booking is unavailable</p>
        <p className="mx-auto mt-5 max-w-lg leading-relaxed text-mute">Online booking is no longer available for this trip. Please send us an enquiry instead.</p>
        <Button type="button" className="mt-8" onClick={() => router.push(enquiryHref)}>Send an enquiry <ArrowRight size={16} /></Button>
      </Card>
    );
  }

  return (
    <section className="mt-10 space-y-8" aria-labelledby="journey-details-heading">
      <Card className={activeStep === 2 ? 'p-7 md:p-9' : 'hidden'}>
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Step 2 of 4 · Journey details</p>
          <h2 id="journey-details-heading" className="mt-3 text-3xl">When would you like to travel?</h2>
          <p className="mt-3 text-sm leading-relaxed text-mute">We use these details to check live vehicle availability and final pricing.</p>
        </div>

        <form onSubmit={requestQuote} className="mt-8 space-y-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Travel date" hint={config.schedule.minNoticeHours > 0 ? `At least ${config.schedule.minNoticeHours} hours’ notice is required.` : undefined}>
              <input type="date" className={inputClass} min={earliestTravelDate} value={travelDate} onChange={(event) => { invalidateQuote(); setTravelDate(event.target.value); }} required={config.schedule.dateRequired} />
            </Field>
            {config.schedule.mode === 'fixed' ? (
              <Field label="Departure time">
                <select className={inputClass} value={departureId ?? ''} onChange={(event) => { invalidateQuote(); setDepartureId(Number(event.target.value)); }} required>
                  {config.schedule.fixedDepartures.map((departure) => <option key={departure.id} value={departure.id}>{departure.startTime}</option>)}
                </select>
              </Field>
            ) : (
              <Field label="Preferred departure time">
                <input type="time" className={inputClass} value={customDepartureTime} onChange={(event) => { invalidateQuote(); setCustomDepartureTime(event.target.value); }} required />
              </Field>
            )}
          </div>

          <Field label="Travellers" hint={config.travellers.limitsApplied ? travellerLimitLabel(config.travellers.min, config.travellers.max) : 'Enter and select the number of travellers so we can show suitable vehicles.'}>
            {config.travellers.limitsApplied ? (
              <select className={inputClass} value={travellers ?? ''} onChange={(event) => { invalidateQuote(); setTravellers(Number(event.target.value)); }}>
                {Array.from({ length: config.travellers.max - config.travellers.min + 1 }, (_, index) => config.travellers.min + index).map((count) => <option key={count} value={count}>{count} {count === 1 ? 'traveller' : 'travellers'}</option>)}
              </select>
            ) : <TravellerCountInput value={travellers} onSelect={(value) => { invalidateQuote(); setTravellers(value); }} />}
          </Field>

          {config.addons.length > 0 && (
            <fieldset>
              <legend className="text-xs uppercase tracking-[0.2em] text-mute">Optional extras</legend>
              <div className="mt-4 space-y-3">
                {config.addons.map((addon) => {
                  const quantity = addonQuantities[addon.id] ?? 0;
                  return (
                    <div key={addon.id} className="flex items-center justify-between gap-5 rounded-2xl border border-line p-5">
                      <div><p className="text-ivory">{addon.name}</p>{addon.description && <p className="mt-1 text-sm text-mute">{addon.description}</p>}<p className="mt-2 text-sm text-gold">{money(addon.priceMinor)} each</p></div>
                      <div className="flex items-center gap-3">
                        <Button type="button" variant="outline" className="h-9 w-9 px-0" disabled={quantity === 0} onClick={() => { invalidateQuote(); setAddonQuantities({ ...addonQuantities, [addon.id]: quantity - 1 }); }}><Minus size={15} /></Button>
                        <span className="w-4 text-center text-sm">{quantity}</span>
                        <Button type="button" variant="outline" className="h-9 w-9 px-0" disabled={quantity === addon.maxQuantity} onClick={() => { invalidateQuote(); setAddonQuantities({ ...addonQuantities, [addon.id]: quantity + 1 }); }}><Plus size={15} /></Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )}

          <Turnstile onToken={setTurnstileToken} siteKey={turnstileSiteKey} />
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? 'Checking availability…' : 'View available vehicles'}</Button>
        </form>
      </Card>

      {quote && activeStep === 3 && (
        <div className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-[11px] uppercase tracking-[0.35em] text-gold">Step 3 of 4 · Available vehicles</p><h2 className="mt-3 text-3xl">Choose your vehicle</h2></div>
            <div className="flex items-center gap-4"><p className="text-xs text-mute">Quote valid until {formatDateTime(quote.expiresAt)}</p><Button type="button" variant="outline" className="shrink-0" onClick={onReturnToJourney}>Edit details</Button></div>
          </div>
          <div className="grid gap-4">
            {quote.offers.map((offer) => <TripVehicleCard key={offer.vehicleId} offer={offer} selected={selectedOfferId === offer.vehicleId} onSelect={() => { setSelectedOfferId(offer.vehicleId); onVehicleSelected(offer); }} />)}
          </div>
          {quote.offers.length === 0 && <p className="rounded-xl border border-line px-5 py-4 text-sm text-mute">No vehicles are available for these journey details. Please choose another date or departure time.</p>}
          {selectedOffer && <div className="flex flex-col gap-4 rounded-2xl border border-gold/25 bg-ink-raised p-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-gold-soft">{selectedOffer.vehicle.name} selected at {money(selectedOffer.price.totalMinor)}.</p><Button type="button" onClick={onProceedToDetails}>Continue to your details <ArrowRight size={16} /></Button></div>}
        </div>
      )}

      {quote && selectedOffer && activeStep === 4 && (
        <Card className="p-7 md:p-9">
          <CustomerDetailsForm
            customer={customer}
            onCustomerChange={setCustomer}
            flightNumber={flight}
            onFlightNumberChange={setFlight}
            paymentMethods={quote.paymentMethods}
            payment={payment}
            onPaymentChange={setPayment}
            turnstileSiteKey={turnstileSiteKey}
            onTurnstileToken={setTurnstileToken}
            onSubmit={confirmBooking}
            onBack={onReturnToVehicles}
            busy={busy}
            eyebrow="Step 4 of 4 · Finalise booking"
          />
          {error && <p role="alert" className="mt-5 text-sm text-red-300">{error}</p>}
        </Card>
      )}
    </section>
  );
}

function TripVehicleCard({ offer, selected, onSelect }: { offer: TripVehicleOffer; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} className={`grid w-full gap-5 rounded-3xl border p-6 text-left transition md:grid-cols-[10rem_1fr_auto] md:items-center ${selected ? 'border-gold bg-ink-raised shadow-gold' : 'border-line bg-ink-soft hover:border-gold/50'}`}>
      {offer.vehicle.imageUrl ? (
        // Vehicle images are served by the API, so a native image avoids a fixed host allow-list.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={offer.vehicle.imageUrl} alt="" className="aspect-[16/10] w-full rounded-2xl object-cover" />
      ) : <div className="aspect-[16/10] rounded-2xl bg-ink-raised" />}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{offer.vehicle.categoryName}</p>
        <h3 className="mt-2 text-2xl">{offer.vehicle.name}</h3>
        {offer.vehicle.modelName && <p className="mt-1 text-sm text-mute">{offer.vehicle.modelName}</p>}
        {offer.vehicle.description && <p className="mt-3 text-sm leading-relaxed text-mute">{offer.vehicle.description}</p>}
        <p className="mt-3 inline-flex items-center gap-2 text-xs text-mute"><Users size={14} className="text-gold" />{offer.vehicle.passengerCapacity} passengers · {offer.vehicle.luggageCapacity} luggage</p>
        {offer.vehicle.amenities.length > 0 && <p className="mt-2 text-xs text-mute">{offer.vehicle.amenities.join(' · ')}</p>}
      </div>
      <div className="flex items-center justify-between gap-5 md:block md:text-right"><div><p className="font-serif text-3xl text-gold">{money(offer.price.totalMinor)}</p><p className="mt-1 text-xs text-mute">{offer.vat.included ? 'VAT included' : `plus VAT ${(offer.vat.rateBp / 100).toFixed(2)}%`}</p></div><span className={`mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full border ${selected ? 'border-gold bg-gold-gradient text-ink' : 'border-line text-transparent'}`}><Check size={15} /></span></div>
    </button>
  );
}

function TravellerCountInput({ value, onSelect }: { value: number | null; onSelect: (value: number | null) => void }) {
  const label = (count: number) => `${count} ${count === 1 ? 'traveller' : 'travellers'}`;
  const [text, setText] = useState(value === null ? '' : label(value));
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const selectedCount = useRef<number | null>(value);
  const suggestions = Array.from({ length: 30 }, (_, index) => index + 1).filter((count) => text.trim() === '' || String(count).startsWith(text.trim()));
  const choose = (count: number) => { selectedCount.current = count; setText(label(count)); setInvalid(false); onSelect(count); setOpen(false); };

  return <div className="relative"><input type="text" inputMode="numeric" autoComplete="off" role="combobox" aria-expanded={open && suggestions.length > 0} className={`${inputClass} ${invalid ? 'border-red-400 focus:border-red-400 focus:ring-red-400/60' : ''}`} value={text} placeholder="Type a number, e.g. 20" onFocus={() => { if (value === null && text === 'Select travellers') setText(''); setOpen(true); }} onBlur={() => window.setTimeout(() => { if (selectedCount.current === null) { setText('Select travellers'); setInvalid(true); } setOpen(false); }, 150)} onChange={(event) => { selectedCount.current = null; setText(event.target.value.replace(/\D/g, '').slice(0, 2)); onSelect(null); setInvalid(false); setOpen(true); }} />{open && suggestions.length > 0 && <ul role="listbox" className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-gold/25 bg-ink-raised shadow-gold">{suggestions.map((count) => <li key={count}><button type="button" role="option" aria-selected={value === count} className="w-full px-5 py-3 text-left text-sm text-ivory/85 transition hover:bg-gold/10 hover:text-gold" onMouseDown={(event) => { event.preventDefault(); choose(count); }}>{label(count)}</button></li>)}</ul>}{invalid && <p className="mt-2 text-xs text-red-300">Traveller not selected.</p>}</div>;
}
