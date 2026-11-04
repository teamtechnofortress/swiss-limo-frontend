'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Clock3, MapPin } from 'lucide-react';
import { PlaceField } from '@/components/booking/PlaceField';
import { Button, Card, Eyebrow, Field } from '@/components/ui/primitives';
import { money } from '@/lib/format';
import type { TripDetail } from '@/lib/trips';
import { getPublicConfig } from '@/lib/public-config';
import type { PlaceValue } from '@/lib/types';
import type { TripPickupConfig, TripPickupLocation } from '@/lib/trip-pickup';
import { getTripJourneyConfig, type TripJourneyConfig, type TripVehicleOffer } from '@/lib/trip-journey';
import { TripJourneyVehicles, type SelectedTripPickup } from './TripJourneyVehicles';

function durationLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (hours === 0) return `${remaining} min`;
  return remaining === 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : `${hours}h ${remaining} min`;
}

export function TripPickupSelection({
  trip,
  pickupConfig,
}: {
  trip: TripDetail;
  pickupConfig: TripPickupConfig;
}) {
  const [selectedLocation, setSelectedLocation] = useState<TripPickupLocation | null>(pickupConfig.locations[0] ?? null);
  const [customPickup, setCustomPickup] = useState<PlaceValue | null>(null);
  const [googleBrowserKey, setGoogleBrowserKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedPickup, setSelectedPickup] = useState<SelectedTripPickup | null>(null);
  const [journeyConfig, setJourneyConfig] = useState<TripJourneyConfig | null>(null);
  const [loadingJourney, setLoadingJourney] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [hasQuote, setHasQuote] = useState(false);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<TripVehicleOffer | null>(null);
  const [journeyKey, setJourneyKey] = useState(0);
  const [pickupDirty, setPickupDirty] = useState(false);
  const confirmedLocation = selectedPickup && pickupConfig.mode === 'selected'
    ? pickupConfig.locations.find((location) => location.placeId === selectedPickup.placeId) ?? null
    : null;

  useEffect(() => {
    let active = true;
    getPublicConfig()
      .then((publicConfig) => {
        if (active) setGoogleBrowserKey(publicConfig.googleMapsBrowserKey);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  async function selectPickup(event: FormEvent) {
    event.preventDefault();
    const pickup = pickupConfig.mode === 'selected'
      ? selectedLocation && { id: selectedLocation.id, placeId: selectedLocation.placeId, address: selectedLocation.address, name: selectedLocation.name }
      : customPickup && { placeId: customPickup.placeId, address: customPickup.text, name: customPickup.text };

    if (!pickup) {
      setError(pickupConfig.mode === 'selected'
        ? 'Please select one of the available pickup locations.'
        : 'Please select your pickup address from the suggestions.');
      return;
    }

    const journeyPickup: SelectedTripPickup = {
      placeId: pickup.placeId,
      address: pickup.address,
      name: pickup.name,
    };
    sessionStorage.setItem(`limo:trip-pickup:${trip.slug}`, JSON.stringify({ ...pickup }));
    setError(null);

    if (selectedPickup?.placeId === journeyPickup.placeId && journeyConfig) {
      setPickupDirty(false);
      setActiveStep(2);
      return;
    }

    // A confirmed new pickup changes eligibility and price, so its journey and quote cannot be reused.
    setSelectedPickup(null);
    setJourneyConfig(null);
    setHasQuote(false);
    setHasVehicle(false);
    setSelectedVehicle(null);
    setLoadingJourney(true);
    try {
      const config = await getTripJourneyConfig(trip.slug);
      if (!config) {
        setError('We could not load the journey details for this trip. Please try again.');
        return;
      }
      if (!config.startBookingAllowed) {
        setError('Online booking is no longer available for this trip. Please send us an enquiry instead.');
        return;
      }
      setSelectedPickup(journeyPickup);
      setJourneyConfig(config);
      setHasQuote(false);
      setHasVehicle(false);
      setSelectedVehicle(null);
      setJourneyKey((current) => current + 1);
      setPickupDirty(false);
      setActiveStep(2);
    } catch {
      setError('We could not load the journey details for this trip. Please try again.');
    } finally {
      setLoadingJourney(false);
    }
  }

  function selectStep(step: 1 | 2 | 3 | 4) {
    if (step === 1) {
      setActiveStep(1);
      return;
    }
    if (step === 2 && selectedPickup && journeyConfig && !pickupDirty) {
      setActiveStep(2);
      return;
    }
    if (step === 3 && hasQuote && !pickupDirty) {
      setActiveStep(3);
      return;
    }
    if (step === 4 && hasVehicle && !pickupDirty) setActiveStep(4);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <BookingStepper currentStep={activeStep} hasJourney={Boolean(selectedPickup && journeyConfig) && !pickupDirty} hasQuote={hasQuote && !pickupDirty} hasVehicle={hasVehicle && !pickupDirty} onSelect={selectStep} />

        <form onSubmit={selectPickup} className={activeStep === 1 ? 'mt-8' : 'hidden'}>
          <Card className="p-7 md:p-9">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Step 1 of 4</p>
            <h2 className="mt-3 text-3xl">Choose your pickup</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              {pickupConfig.mode === 'selected'
                ? 'Choose one of the approved starting locations for this experience.'
                : 'Enter the address where you would like your chauffeur to collect you.'}
            </p>

            <div className="mt-8">
              {pickupConfig.mode === 'selected' ? (
                <Field label="Pickup location">
                  <div className="grid gap-3">
                    {pickupConfig.locations.map((location) => (
                      <PickupLocationOption
                        key={location.id}
                        location={location}
                        selected={selectedLocation?.id === location.id}
                        onSelect={() => { setSelectedLocation(location); setPickupDirty(selectedPickup?.placeId !== location.placeId); }}
                      />
                    ))}
                  </div>
                </Field>
              ) : (
                <Field label="Pickup address" hint="Choose an address from the suggestions.">
                  <PlaceField
                    id="trip-pickup"
                    value={customPickup}
                    onChange={(value) => { setCustomPickup(value); setPickupDirty(Boolean(selectedPickup && selectedPickup.placeId !== value?.placeId)); }}
                    placeholder="Address, hotel or airport"
                    googleBrowserKey={googleBrowserKey}
                  />
                </Field>
              )}
            </div>

            {pickupDirty && selectedPickup && <p className="mt-5 rounded-2xl border border-gold/25 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-gold-soft">Continue to update your pickup. We’ll refresh the journey details and vehicle availability for the new location.</p>}
            {error && <p role="alert" className="mt-5 text-sm text-red-300">{error}</p>}
            <Button type="submit" disabled={loadingJourney} className="mt-8 w-full">
              {loadingJourney ? 'Loading journey details…' : 'Continue to journey details'} <ArrowRight size={16} />
            </Button>
          </Card>
        </form>

        {selectedPickup && journeyConfig && (
          <TripJourneyVehicles
            key={journeyKey}
            pickup={selectedPickup}
            config={journeyConfig}
            activeStep={activeStep}
            onQuoteReady={() => { setHasQuote(true); setHasVehicle(false); setSelectedVehicle(null); setActiveStep(3); }}
            onQuoteInvalidated={() => { setHasQuote(false); setHasVehicle(false); setSelectedVehicle(null); }}
            onVehicleSelected={(vehicle) => { setHasVehicle(true); setSelectedVehicle(vehicle); }}
            onProceedToDetails={() => setActiveStep(4)}
            onReturnToJourney={() => setActiveStep(2)}
            onReturnToVehicles={() => setActiveStep(3)}
            enquiryHref={`/contact?trip=${encodeURIComponent(trip.slug)}`}
          />
        )}
      </div>

      <aside className="lg:col-span-5">
        <Card className="sticky top-32 p-8">
          {trip.coverUrl && (
            // Trip imagery is managed by the CMS, so a native image avoids a fixed host allow-list.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={trip.coverUrl} alt="" className="mb-7 aspect-[16/8] w-full rounded-2xl object-cover" />
          )}
          <Eyebrow>{trip.region}</Eyebrow>
          <p className="mt-3 font-serif text-3xl">{trip.title}</p>
          {trip.subtitle && <p className="mt-2 text-sm leading-relaxed text-mute">{trip.subtitle}</p>}
          <p className="mt-4 text-sm leading-relaxed text-ivory/80">{trip.summary}</p>
          <div className="mt-7 border-t hairline pt-6">
            {trip.pricingMode === 'fixed' && trip.booking.startingFromPriceMinor !== null ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.25em] text-mute">Starting from</p>
                <p className="mt-1 font-serif text-3xl text-gold">{money(trip.booking.startingFromPriceMinor)}</p>
              </>
            ) : trip.pricingMode === 'distance' ? (
              <p className="text-sm leading-relaxed text-mute">Your final price is calculated from your journey and available vehicle.</p>
            ) : null}
          </div>
          <div className="mt-7 border-t hairline pt-6">
          <p className="font-serif text-2xl">Your pickup</p>
          {pickupConfig.mode === 'selected' && (confirmedLocation ?? selectedLocation) ? (
            <div className="mt-6">
              <p className="font-medium text-ivory">{(confirmedLocation ?? selectedLocation)!.name}</p>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-mute"><MapPin size={14} className="mt-0.5 shrink-0 text-gold" />{(confirmedLocation ?? selectedLocation)!.address}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-xs text-gold"><Clock3 size={14} />About {durationLabel((confirmedLocation ?? selectedLocation)!.durationMinutes)}</p>
            </div>
          ) : (selectedPickup?.name ?? customPickup?.text) ? (
            <p className="mt-6 text-sm leading-relaxed text-ivory/85">{selectedPickup?.name ?? customPickup?.text}</p>
          ) : (
            <p className="mt-6 text-sm leading-relaxed text-mute">Select your pickup to continue.</p>
          )}
          {selectedPickup && activeStep !== 1 && <Button type="button" variant="outline" className="mt-5" onClick={() => setActiveStep(1)}>Change pickup</Button>}
          </div>
          {selectedVehicle && (
            <div className="mt-7 border-t hairline pt-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Selected vehicle</p>
              <p className="mt-2 font-serif text-2xl">{selectedVehicle.vehicle.name}</p>
              <p className="mt-1 text-sm text-mute">{selectedVehicle.vehicle.categoryName}</p>
              <div className="mt-5 flex items-baseline justify-between"><span className="text-sm text-mute">Total</span><span className="font-serif text-3xl text-gold">{money(selectedVehicle.price.totalMinor)}</span></div>
            </div>
          )}
        </Card>
      </aside>
    </div>
  );
}

function BookingStepper({
  currentStep,
  hasJourney,
  hasQuote,
  hasVehicle,
  onSelect,
}: {
  currentStep: 1 | 2 | 3 | 4;
  hasJourney: boolean;
  hasQuote: boolean;
  hasVehicle: boolean;
  onSelect: (step: 1 | 2 | 3 | 4) => void;
}) {
  const steps: Array<{ id: 1 | 2 | 3 | 4; label: string; enabled: boolean }> = [
    { id: 1, label: 'Pickup', enabled: true },
    { id: 2, label: 'Journey details', enabled: hasJourney },
    { id: 3, label: 'Available vehicles', enabled: hasQuote },
    { id: 4, label: 'Your details', enabled: hasVehicle },
  ];

  return (
    <nav aria-label="Booking progress" className="rounded-3xl border border-line bg-ink-soft p-3 sm:p-4">
      <ol className="grid grid-cols-2 gap-1 sm:grid-cols-4 sm:gap-3">
        {steps.map((step) => {
          const complete = step.id < currentStep;
          const current = step.id === currentStep;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onSelect(step.id)}
                disabled={!step.enabled}
                aria-current={current ? 'step' : undefined}
                className={`flex w-full items-center gap-2 rounded-2xl px-2 py-3 text-left transition sm:px-3 ${current ? 'bg-ink-raised text-ivory shadow-gold' : step.enabled ? 'text-ivory/75 hover:bg-ink-raised' : 'cursor-not-allowed text-mute/60'}`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${complete ? 'border-gold bg-gold-gradient text-ink' : current ? 'border-gold text-gold' : 'border-line text-mute'}`}>
                  {complete ? <Check size={14} /> : step.id}
                </span>
                <span className="min-w-0"><span className="block text-[10px] uppercase tracking-[0.16em] text-mute sm:hidden">Step {step.id}</span><span className="block truncate text-xs font-medium sm:text-sm">{step.label}</span></span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function PickupLocationOption({ location, selected, onSelect }: { location: TripPickupLocation; selected: boolean; onSelect: () => void }) {
  return (
    <label className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition ${selected ? 'border-gold bg-ink-raised' : 'border-line hover:border-gold/50'}`}>
      <input type="radio" name="pickup" checked={selected} onChange={onSelect} className="mt-1 accent-[#c9a96e]" />
      <span>
        <span className="block font-medium text-ivory">{location.name}</span>
        <span className="mt-1 flex items-start gap-2 text-sm text-mute"><MapPin size={14} className="mt-0.5 shrink-0 text-gold" />{location.address}</span>
        <span className="mt-2 inline-flex items-center gap-2 text-xs text-gold"><Clock3 size={14} />About {durationLabel(location.durationMinutes)}</span>
      </span>
    </label>
  );
}
