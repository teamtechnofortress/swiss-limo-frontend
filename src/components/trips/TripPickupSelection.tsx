'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Car, Check, Clock3, MapPin, ShieldCheck, Users } from 'lucide-react';
import { BookingProgress } from '@/components/booking/BookingProgress';
import { CustomerDetailsForm } from '@/components/booking/CustomerDetailsForm';
import { PlaceField } from '@/components/booking/PlaceField';
import { Turnstile } from '@/components/booking/Turnstile';
import { ApiError } from '@/lib/api';
import { addDays, money, zurichToday } from '@/lib/format';
import type { BookingContent } from '@/content/booking';
import type { TripBookingContent } from '@/content/trip-booking';
import { createPublicBooking, resolveCheckoutUrl } from '@/lib/public-booking';
import { getPublicConfig } from '@/lib/public-config';
import type { TripDetail } from '@/lib/trips';
import { getTripQuote, type TripJourneyConfig, type TripVehicleOffer } from '@/lib/trip-journey';
import type { PaymentMethodKey, PlaceValue } from '@/lib/types';

type Step = 1 | 2 | 3;

const lightInput = 'h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-[#0f172a] placeholder:text-gray-400 transition focus:border-[#eab308] focus:outline-none focus:ring-2 focus:ring-[#eab308]/20';
const lightLabel = 'mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f172a]';
const primaryButton = 'flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#facc15] to-[#eab308] px-5 text-sm font-bold text-black transition hover:shadow-lg disabled:opacity-50';
const secondaryButton = 'flex h-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 text-sm font-bold text-black transition hover:bg-gray-50 disabled:opacity-50';

interface SelectedPickup {
  placeId: string;
  address: string;
  name: string;
}

function fill(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce((result, [key, value]) => result.replace(`{${key}}`, String(value)), template);
}

function durationLabel(minutes: number, copy: TripBookingContent['summary']): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours === 0) return fill(copy.minutes, { count: remaining });
  const duration = fill(hours === 1 ? copy.hour : copy.hours, { count: hours });
  return remaining === 0 ? duration : fill(copy.hoursWithMinutes, { hours: duration, minutes: remaining });
}

function travellerLimitLabel(minimum: number, maximum: number, copy: TripBookingContent['flow']): string {
  const travellers = minimum === 1 ? copy.traveller : copy.travellersPlural;
  return minimum === maximum
    ? fill(copy.travellerFixedLimit, { min: minimum, travellers })
    : fill(copy.travellerRange, { min: minimum, max: maximum });
}

/**
 * The journey-config response is the source of truth for the complete first
 * step, including eligible pickups. Keeping it together ensures the customer
 * sees and submits one coherent journey request before we quote vehicles.
 */
export function TripPickupSelection({
  trip,
  journeyConfig,
  content,
  bookingContent,
  locale,
  enquiryHref,
}: {
  trip: TripDetail;
  journeyConfig: TripJourneyConfig;
  content: TripBookingContent;
  bookingContent: BookingContent;
  locale: string;
  enquiryHref: string;
}) {
  const c = content;
  const router = useRouter();
  const earliestTravelDate = addDays(zurichToday(), Math.ceil(journeyConfig.schedule.minNoticeHours / 24));
  const [activeStep, setActiveStep] = useState<Step>(1);
  const [selectedLocation, setSelectedLocation] = useState(journeyConfig.pickup.locations[0] ?? null);
  const [customPickup, setCustomPickup] = useState<PlaceValue | null>(null);
  const [travelDate, setTravelDate] = useState(earliestTravelDate);
  const [departureId, setDepartureId] = useState<number | null>(journeyConfig.schedule.fixedDepartures[0]?.id ?? null);
  const [customDepartureTime, setCustomDepartureTime] = useState('09:00');
  const [travellers, setTravellers] = useState<number | null>(journeyConfig.travellers.limitsApplied ? journeyConfig.travellers.min : null);
  const [quote, setQuote] = useState<Awaited<ReturnType<typeof getTripQuote>>>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentMethodKey>('online');
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [flight, setFlight] = useState('');
  const [quoteTurnstileToken, setQuoteTurnstileToken] = useState<string | null>(null);
  const [bookingTurnstileToken, setBookingTurnstileToken] = useState<string | null>(null);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [publicConfigLoaded, setPublicConfigLoaded] = useState(false);
  const [quoteTurnstileKey, setQuoteTurnstileKey] = useState(0);
  const [bookingTurnstileKey, setBookingTurnstileKey] = useState(0);
  const [googleBrowserKey, setGoogleBrowserKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingUnavailable, setBookingUnavailable] = useState(false);

  const selectedDeparture = journeyConfig.schedule.fixedDepartures.find((departure) => departure.id === departureId) ?? null;
  const selectedOffer = quote?.offers.find((offer) => offer.vehicleId === selectedOfferId) ?? null;
  const pickup: SelectedPickup | null = journeyConfig.pickup.mode === 'selected'
    ? selectedLocation && { placeId: selectedLocation.placeId, address: selectedLocation.address, name: selectedLocation.name }
    : customPickup && { placeId: customPickup.placeId, address: customPickup.text, name: customPickup.text };
  const travellerMaximum = journeyConfig.pickup.mode === 'selected' && selectedLocation
    ? journeyConfig.travellers.maxByPickupLocation[selectedLocation.id] ?? journeyConfig.travellers.max
    : journeyConfig.travellers.max;
  const travellerSelectionMaximum = travellerMaximum ?? journeyConfig.travellers.min;
  const quoteDateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Zurich' });

  useEffect(() => {
    let active = true;
    getPublicConfig().then((publicConfig) => {
      if (!active) return;
      setGoogleBrowserKey(publicConfig.googleMapsBrowserKey);
      setTurnstileEnabled(publicConfig.turnstileEnabled);
      setTurnstileSiteKey(publicConfig.turnstileEnabled ? publicConfig.turnstileSiteKey : '');
    }).catch(() => undefined).finally(() => {
      if (active) setPublicConfigLoaded(true);
    });
    return () => { active = false; };
  }, []);

  function invalidateQuote() {
    if (!quote) return;
    setQuote(null);
    setSelectedOfferId(null);
    if (activeStep !== 1) setActiveStep(1);
  }

  function selectPickupLocation(location: TripJourneyConfig['pickup']['locations'][number]) {
    if (location.id !== selectedLocation?.id) {
      setTravellers(journeyConfig.travellers.limitsApplied ? journeyConfig.travellers.min : null);
    }
    invalidateQuote();
    setSelectedLocation(location);
  }

  function selectStep(step: Step) {
    if (step === 1 || (step === 2 && quote) || (step === 3 && selectedOffer)) {
      setError(null);
      if (step === 3) {
        setBookingTurnstileToken(null);
        setBookingTurnstileKey((key) => key + 1);
      }
      setActiveStep(step);
    }
  }

  function openBookingDetails() {
    setError(null);
    setBookingTurnstileToken(null);
    setBookingTurnstileKey((key) => key + 1);
    setActiveStep(3);
  }

  async function requestQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!publicConfigLoaded) {
      setError(c.flow.preparingError);
      return;
    }
    if (!pickup) {
      setError(journeyConfig.pickup.mode === 'selected'
        ? c.flow.pickupLocationError
        : c.flow.pickupAddressError);
      return;
    }
    if (
      travellers === null ||
      travellerMaximum === null ||
      travellers < journeyConfig.travellers.min ||
      travellers > travellerMaximum
    ) {
      setError(fill(c.flow.travellerError, { min: journeyConfig.travellers.min, max: travellerSelectionMaximum }));
      return;
    }
    if (journeyConfig.schedule.mode === 'fixed' && !selectedDeparture) {
      setError(c.flow.departureError);
      return;
    }
    if (!journeyConfig.quoteEndpoint) {
      setBookingUnavailable(true);
      return;
    }
    if (turnstileEnabled && !quoteTurnstileToken) {
      setError(c.flow.quoteSecurityError);
      return;
    }

    setBusy(true);
    try {
      const response = await getTripQuote(journeyConfig.quoteEndpoint, {
        pickup_place_id: pickup.placeId,
        pickup_address: pickup.address,
        travel_date: travelDate,
        ...(journeyConfig.schedule.mode === 'fixed' ? { departure_id: selectedDeparture!.id } : { custom_departure_time: customDepartureTime }),
        travellers,
        ...(quoteTurnstileToken ? { turnstile_token: quoteTurnstileToken } : {}),
      });
      if (!response) throw new Error(c.flow.quoteError);
      setQuote(response);
      setSelectedOfferId(null);
      setPayment(response.paymentMethods[0] ?? 'online');
      setQuoteTurnstileToken(null);
      setQuoteTurnstileKey((key) => key + 1);
      setActiveStep(2);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : caught instanceof Error ? caught.message : c.flow.fallbackError);
      if (turnstileEnabled) {
        setQuoteTurnstileToken(null);
        setQuoteTurnstileKey((key) => key + 1);
      }
    } finally {
      setBusy(false);
    }
  }

  async function confirmBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!quote || !selectedOffer) {
      setError(c.flow.chooseVehicleError);
      return;
    }
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setError(c.flow.contactError);
      return;
    }
    if (turnstileEnabled && !bookingTurnstileToken) {
      setError(c.flow.bookingSecurityError);
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
        turnstileToken: bookingTurnstileToken,
      });
      sessionStorage.setItem(`limo:access:${booking.reference}`, booking.accessToken);
      if (payment === 'online') {
        const checkoutUrl = await resolveCheckoutUrl(booking).catch(() => null);
        if (checkoutUrl) {
          window.location.assign(checkoutUrl);
          return;
        }
      }
      router.push(`/bookings/${booking.reference}`);
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === 'trip_booking_unavailable') {
        setBookingUnavailable(true);
      } else if (caught instanceof ApiError && ['quote_unavailable', 'slot_unavailable', 'vehicle_not_in_quote'].includes(caught.code)) {
        invalidateQuote();
        setError(c.flow.quoteUnavailable);
      } else {
        setError(caught instanceof ApiError ? caught.message : caught instanceof Error ? caught.message : c.flow.fallbackError);
      }
      if (turnstileEnabled) {
        setBookingTurnstileToken(null);
        setBookingTurnstileKey((key) => key + 1);
      }
    } finally {
      setBusy(false);
    }
  }

  if (bookingUnavailable) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border-2 border-gray-200 bg-white p-8 text-center shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)] md:p-10">
        <p className="font-serif text-3xl font-bold text-[#0f172a]">{c.unavailable.title}</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-500">{c.unavailable.description}</p>
        <button type="button" className={`mx-auto mt-7 ${primaryButton}`} onClick={() => router.push(enquiryHref)}>{c.unavailable.enquiry} <ArrowRight size={16} /></button>
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-x-6 gap-y-4 lg:grid-cols-12">
      <BookingProgress
        steps={[
          { id: 1, label: c.progress.steps[0], enabled: true },
          { id: 2, label: c.progress.steps[1], enabled: Boolean(quote) },
          { id: 3, label: c.progress.steps[2], enabled: Boolean(selectedOffer) },
        ]}
        currentStep={activeStep}
        onStepSelect={(step) => selectStep(step as Step)}
        className="lg:col-span-12"
        label={c.progress.label}
      />

      <div className="flex min-w-0 flex-col lg:col-span-8">
        {error && activeStep !== 1 && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}

        {activeStep === 1 && (
          <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)] md:p-6">
            <div className="mb-6 max-w-2xl">
              <p className="mb-1 text-[13px] font-bold tracking-wider text-[#eab308] md:text-[14px]">{fill(c.flow.step, { step: 1 })}</p>
              <h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>{c.flow.planTitle}</h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{c.flow.planIntro}</p>
            </div>

            <form onSubmit={requestQuote} className="space-y-4">
              {journeyConfig.pickup.mode === 'selected' ? (
                <div>
                  <label className={lightLabel}>{c.flow.pickupLocation}</label>
                  <p className="mb-2 text-xs text-gray-500">{c.flow.pickupLocationHelp}</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {journeyConfig.pickup.locations.map((location) => (
                      <PickupLocationOption key={location.id} location={location} selected={selectedLocation?.id === location.id} onSelect={() => selectPickupLocation(location)} aboutDuration={fill(c.summary.aboutDuration, { duration: durationLabel(location.durationMinutes, c.summary) })} />
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className={lightLabel}>{c.flow.pickupAddress}</label>
                  <PlaceField id="trip-pickup" value={customPickup} onChange={(value) => { invalidateQuote(); setCustomPickup(value); }} placeholder={c.flow.addressPlaceholder} googleBrowserKey={googleBrowserKey} />
                  <p className="mt-1.5 text-xs text-gray-500">{c.flow.pickupAddressHelp}</p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={lightLabel}>{c.flow.travelDate}</label>
                  <input type="date" className={lightInput} min={earliestTravelDate} value={travelDate} onChange={(event) => { invalidateQuote(); setTravelDate(event.target.value); }} required={journeyConfig.schedule.dateRequired} />
                  {journeyConfig.schedule.minNoticeHours > 0 && <p className="mt-1.5 text-xs text-gray-500">{fill(c.flow.noticeHours, { count: journeyConfig.schedule.minNoticeHours })}</p>}
                </div>
                {journeyConfig.schedule.mode === 'fixed' ? (
                  <div>
                    <label className={lightLabel}>{c.flow.departureTime}</label>
                    <select className={lightInput} value={departureId ?? ''} onChange={(event) => { invalidateQuote(); setDepartureId(Number(event.target.value)); }} required>
                      {journeyConfig.schedule.fixedDepartures.map((departure) => <option key={departure.id} value={departure.id}>{departure.startTime}</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className={lightLabel}>{c.flow.preferredDepartureTime}</label>
                    <input type="time" className={lightInput} value={customDepartureTime} onChange={(event) => { invalidateQuote(); setCustomDepartureTime(event.target.value); }} required />
                  </div>
                )}
              </div>

              <div>
                <label className={lightLabel}>{c.flow.travellers}</label>
                {journeyConfig.travellers.limitsApplied ? (
                  <select className={lightInput} value={travellers ?? ''} onChange={(event) => { invalidateQuote(); setTravellers(Number(event.target.value)); }}>
                    {Array.from({ length: travellerSelectionMaximum - journeyConfig.travellers.min + 1 }, (_, index) => journeyConfig.travellers.min + index).map((count) => <option key={count} value={count}>{count} {count === 1 ? c.flow.traveller : c.flow.travellersPlural}</option>)}
                  </select>
                ) : <TravellerCountInput key={`${selectedLocation?.id ?? 'custom'}-${travellerSelectionMaximum}`} value={travellers} minimum={journeyConfig.travellers.min} maximum={travellerSelectionMaximum} onSelect={(value) => { invalidateQuote(); setTravellers(value); }} copy={c.flow} />}
                <p className="mt-1.5 text-xs text-gray-500">{journeyConfig.travellers.limitsApplied ? travellerLimitLabel(journeyConfig.travellers.min, travellerSelectionMaximum, c.flow) : fill(c.flow.travellerSelectRange, { min: journeyConfig.travellers.min, max: travellerSelectionMaximum })}</p>
              </div>

              {turnstileEnabled && (
                <div className="rounded-xl border border-[#eab308]/30 bg-[#fffaf0] px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#59430b]"><ShieldCheck size={15} className="text-[#d99b14]" />{c.flow.security}</div>
                  <div className="mt-2 flex justify-center sm:justify-start"><Turnstile key={`trip-quote-${quoteTurnstileKey}`} onToken={setQuoteTurnstileToken} siteKey={turnstileSiteKey} theme="light" /></div>
                </div>
              )}
              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}
              <div className="flex justify-end pt-1"><button type="submit" disabled={busy || !publicConfigLoaded} className={`${primaryButton} w-full sm:w-auto`}>{busy ? c.flow.checking : publicConfigLoaded ? c.flow.chooseVehicle : c.flow.preparing} {!busy && publicConfigLoaded && <ArrowRight size={16} />}</button></div>
            </form>
          </div>
        )}

        {quote && activeStep === 2 && (
          <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)] md:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="mb-1 text-[13px] font-bold tracking-wider text-[#eab308] md:text-[14px]">{fill(c.flow.step, { step: 2 })}</p><h2 className="font-serif text-3xl font-bold text-[#0f172a] md:text-4xl" style={{ textShadow: '1px 0 0 #0f172a, 0 1px 0 #0f172a' }}>{c.flow.vehicleTitle}</h2><p className="mt-1 text-sm text-gray-500">{c.flow.vehicleIntro}</p></div>
              <div className="flex items-center gap-3"><p className="text-xs font-semibold text-[#536fad]">{fill(c.flow.quoteValidUntil, { date: quoteDateFormatter.format(new Date(quote.expiresAt)) })}</p><button type="button" className={`${secondaryButton} h-9 px-4 text-xs`} onClick={() => setActiveStep(1)}>{c.flow.editJourney}</button></div>
            </div>
            <div className="space-y-3">{quote.offers.map((offer) => <TripVehicleCard key={offer.vehicleId} offer={offer} selected={selectedOfferId === offer.vehicleId} onSelect={() => setSelectedOfferId(offer.vehicleId)} copy={c.offer} />)}</div>
            {quote.offers.length === 0 && <p className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-500">{c.flow.noVehicles}</p>}
            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
              <button type="button" className={`${secondaryButton} w-full sm:w-auto`} onClick={() => setActiveStep(1)}><ArrowLeft size={16} /> {c.flow.changeJourney}</button>
              <button type="button" disabled={!selectedOffer} className={`${primaryButton} w-full sm:w-auto`} onClick={openBookingDetails}>{c.flow.continue} <ArrowRight size={16} /></button>
            </div>
          </div>
        )}

        {quote && selectedOffer && activeStep === 3 && (
          <div className="h-full rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)] md:p-6">
            <CustomerDetailsForm customer={customer} onCustomerChange={setCustomer} flightNumber={flight} onFlightNumberChange={setFlight} paymentMethods={quote.paymentMethods} payment={payment} onPaymentChange={setPayment} turnstileSiteKey={turnstileEnabled ? turnstileSiteKey : undefined} onTurnstileToken={turnstileEnabled ? setBookingTurnstileToken : undefined} turnstileWidgetKey={`trip-booking-${bookingTurnstileKey}`} onSubmit={confirmBooking} onBack={() => setActiveStep(2)} busy={busy} eyebrow={c.flow.finaliseBooking} backLabel={c.flow.backToVehicles} copy={bookingContent.customer} />
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 lg:col-span-4">
        <div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-2 bg-[#0f172a] px-4 py-2.5"><Car className="text-[#eab308]" size={18} /><h3 className="font-serif text-lg font-bold text-white">{c.summary.title}</h3></div>
          <div className="space-y-4 p-4 text-sm">
            {trip.coverUrl && <img src={trip.coverUrl} alt="" className="aspect-[16/8] w-full rounded-xl object-cover" />}
            <div><p className="text-[9px] font-bold uppercase tracking-wider text-[#d99b14]">{trip.region}</p><p className="mt-1 font-serif text-xl font-bold leading-tight text-[#0f172a]">{trip.title}</p>{trip.subtitle && <p className="mt-1 text-xs leading-relaxed text-gray-500">{trip.subtitle}</p>}</div>
            <div className="border-t border-gray-100 pt-3"><p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#0f172a]">{c.summary.journey}</p>{pickup ? <div className="mt-3"><p className="font-semibold text-[#0f172a]">{pickup.name}</p><p className="mt-1.5 flex items-start gap-2 text-xs leading-relaxed text-gray-500"><MapPin size={14} className="mt-0.5 shrink-0 text-[#d99b14]" />{pickup.address}</p>{selectedLocation && journeyConfig.pickup.mode === 'selected' && <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[#8a6505]"><Clock3 size={14} />{fill(c.summary.aboutDuration, { duration: durationLabel(selectedLocation.durationMinutes, c.summary) })}</p>}</div> : <p className="mt-3 text-xs text-gray-500">{c.summary.selectPickup}</p>}</div>
            <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs"><SummaryCell icon={<Calendar size={13} />} label={c.summary.date} value={travelDate} /><SummaryCell icon={<Users size={13} />} label={c.summary.travellers} value={travellers ? String(travellers) : '—'} /></div>
            {selectedOffer && <div className="rounded-xl border border-[#eab308]/25 bg-[#fffaf0] p-3"><p className="text-[9px] font-bold uppercase tracking-wider text-[#8a6505]">{c.summary.selectedVehicle}</p><div className="mt-1 flex items-end justify-between gap-3"><div><p className="font-serif text-lg font-bold text-[#0f172a]">{selectedOffer.vehicle.name}</p>{selectedOffer.vehicle.categoryName && <p className="text-[10px] text-gray-500">{selectedOffer.vehicle.categoryName}</p>}</div><p className="shrink-0 font-serif text-xl font-bold text-[#b77909]">{money(selectedOffer.price.totalMinor)}</p></div></div>}
          </div>
        </div>
      </aside>
    </div>
  );
}

function PickupLocationOption({ location, selected, onSelect, aboutDuration }: { location: TripJourneyConfig['pickup']['locations'][number]; selected: boolean; onSelect: () => void; aboutDuration: string }) {
  return <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition ${selected ? 'border-[#eab308] bg-[#fffaf0] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}><input type="radio" name="pickup" checked={selected} onChange={onSelect} className="h-4 w-4 shrink-0 accent-[#eab308]" /><span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"><span className="min-w-0"><span className="block text-sm font-bold text-[#0f172a]">{location.name}</span><span className="flex min-w-0 items-center gap-1.5 text-xs leading-relaxed text-gray-500"><MapPin size={13} className="shrink-0 text-[#d99b14]" /><span className="truncate">{location.address}</span></span></span><span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#8a6505]"><Clock3 size={13} />{aboutDuration}</span></span></label>;
}

function TripVehicleCard({ offer, selected, onSelect, copy }: { offer: TripVehicleOffer; selected: boolean; onSelect: () => void; copy: TripBookingContent['offer'] }) {
  const capacity = [
    offer.vehicle.passengerCapacity !== null ? fill(copy.passengers, { count: offer.vehicle.passengerCapacity }) : null,
    offer.vehicle.luggageCapacity !== null ? fill(copy.luggage, { count: offer.vehicle.luggageCapacity }) : null,
  ].filter((value): value is string => value !== null).join(' · ');
  return <button type="button" onClick={onSelect} aria-pressed={selected} className={`group flex w-full items-stretch justify-between overflow-hidden rounded-xl border-2 text-left transition-all duration-200 ${selected ? 'border-[#eab308] bg-[#eab308]/5 shadow-sm' : 'border-gray-200 bg-white hover:border-[#eab308]/50 hover:bg-gray-50'}`}><div className="flex min-w-0 flex-1 items-center gap-3 bg-gray-50 sm:gap-5">{offer.vehicle.imageUrl ? <img src={offer.vehicle.imageUrl} alt="" className="h-28 w-32 shrink-0 object-cover sm:h-36 sm:w-52" /> : <div className="flex h-28 w-32 shrink-0 items-center justify-center bg-gray-100 text-gray-400 sm:h-36 sm:w-52"><Car size={28} /></div>}<div className="min-w-0 py-3 sm:py-4">{offer.vehicle.categoryName && <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{offer.vehicle.categoryName}</p>}<h3 className="mt-1 truncate font-sans text-sm font-semibold text-[#0f172a] sm:text-base">{offer.vehicle.name}</h3>{offer.vehicle.modelName && <p className="mt-1 truncate text-xs text-gray-500">{offer.vehicle.modelName}</p>}{capacity && <p className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-600"><Users size={13} />{capacity}</p>}{offer.vehicle.amenities.length > 0 && <p className="mt-1 hidden text-[10px] text-gray-500 sm:block">{offer.vehicle.amenities.join(' · ')}</p>}</div></div><div className="flex shrink-0 items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-5"><div className="text-right"><p className="font-serif text-lg font-bold leading-none text-[#0f172a] sm:text-2xl">{money(offer.price.totalMinor)}</p><p className="mt-1 text-[9px] text-gray-400">{offer.vat.included ? copy.vatIncluded : fill(copy.vatExcluded, { rate: (offer.vat.rateBp / 100).toFixed(2) })}</p></div><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors sm:h-7 sm:w-7 ${selected ? 'border-[#eab308] bg-[#eab308] text-white' : 'border-gray-300 text-transparent group-hover:border-gray-400'}`}><Check size={12} strokeWidth={3} /></span></div></button>;
}

function TravellerCountInput({ value, minimum, maximum, onSelect, copy }: { value: number | null; minimum: number; maximum: number; onSelect: (value: number | null) => void; copy: TripBookingContent['flow'] }) {
  const label = (count: number) => `${count} ${count === 1 ? copy.traveller : copy.travellersPlural}`;
  const [text, setText] = useState(value === null ? '' : label(value));
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const selectedCount = useRef<number | null>(value);
  const suggestions = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index).filter((count) => text.trim() === '' || String(count).startsWith(text.trim()));
  const choose = (count: number) => { selectedCount.current = count; setText(label(count)); setInvalid(false); onSelect(count); setOpen(false); };
  return <div className="relative"><input type="text" inputMode="numeric" autoComplete="off" role="combobox" aria-expanded={open && suggestions.length > 0} className={`${lightInput} ${invalid ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`} value={text} placeholder={fill(copy.travellerPlaceholder, { max: maximum })} onFocus={() => { if (value === null && text === copy.travellerPlaceholder) setText(''); setOpen(true); }} onBlur={() => window.setTimeout(() => { if (selectedCount.current === null) { setText(copy.travellerPlaceholder); setInvalid(true); } setOpen(false); }, 150)} onChange={(event) => { selectedCount.current = null; setText(event.target.value.replace(/\D/g, '').slice(0, 2)); onSelect(null); setInvalid(false); setOpen(true); }} />{open && suggestions.length > 0 && <ul role="listbox" className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">{suggestions.map((count) => <li key={count}><button type="button" role="option" aria-selected={value === count} className="w-full px-4 py-3 text-left text-sm text-[#0f172a] transition hover:bg-[#fffaf0]" onMouseDown={(event) => { event.preventDefault(); choose(count); }}>{label(count)}</button></li>)}</ul>}{invalid && <p className="mt-2 text-xs text-red-600">{copy.travellerNotSelected}</p>}</div>;
}

function SummaryCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-gray-50 p-2 text-[#0f172a]"><span className="shrink-0 text-[#d99b14]">{icon}</span><div className="min-w-0"><p className="text-[8px] font-bold uppercase tracking-wider text-gray-500">{label}</p><p className="truncate text-[10px] font-bold">{value}</p></div></div>;
}
