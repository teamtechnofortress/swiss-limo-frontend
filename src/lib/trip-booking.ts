import { api } from './api';

export type TripBookingPickupMode = 'selected' | 'custom';
export type TripBookingScheduleMode = 'fixed' | 'custom';
export type TripBookingPricingMode = 'fixed' | 'route_based' | 'enquiry';
export type TripBookingConfigurationMode = 'fixed' | 'distance' | 'enquiry';
export type TripBookingBlockedReason =
  | 'enquiry_only'
  | 'pickup_configuration_required'
  | 'destination_configuration_required'
  | 'fixed_pricing_configuration_required';

export interface TripBookingConfig {
  trip: {
    slug: string;
    title: string;
    subtitle: string | null;
    summary: string | null;
    region: string | null;
    coverUrl: string | null;
    gallery: Array<{ id: number; url: string }>;
  };
  booking: {
    startBookingAllowed: boolean;
    reason: TripBookingBlockedReason | null;
    pricingMode: TripBookingConfigurationMode;
    pickup: {
      mode: TripBookingPickupMode;
      customAllowed: boolean;
      locations: TripBookingPickupLocation[];
    };
    schedule: {
      mode: TripBookingScheduleMode;
      dateRequired: boolean;
      fixedDepartures: TripBookingDeparture[];
      minNoticeHours: number;
    };
    travellers: {
      selectionRequired: boolean;
      limitsApplied: boolean;
      min: number;
      max: number;
    };
    addons: TripBookingAddon[];
    pricing: {
      mode: TripBookingPricingMode;
      currency: string;
      startingFromPriceMinor: number | null;
      quoteRequired: boolean;
    };
    flow: {
      nextStep: 'quote' | 'enquiry';
      quoteEndpoint: string | null;
      availabilityEndpoint: string | null;
      enquiryEndpoint: string;
    };
  };
}

export interface TripBookingPickupLocation {
  id: number;
  name: string;
  placeId: string;
  address: string;
  durationMinutes: number;
  /** Rappen. Present only for fixed-price trips. */
  startingFromPriceMinor: number | null;
}

export interface TripBookingDeparture {
  id: number;
  startTime: string;
}

export interface TripBookingAddon {
  id: number;
  name: string;
  description: string | null;
  priceMinor: number;
  maxQuantity: number;
}

interface ApiTripBookingConfigResponse {
  data?: unknown;
}

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : null;
}

function nullableString(value: unknown): string | null | undefined {
  if (value === null) return null;
  return typeof value === 'string' ? value : undefined;
}

function nullablePrice(value: unknown): number | null | undefined {
  // Per-pickup prices are intentionally absent for route-based trips.
  if (value === null || value === undefined) return null;
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : undefined;
}

const blockedBookingReasons = new Set<TripBookingBlockedReason>([
  'enquiry_only',
  'pickup_configuration_required',
  'destination_configuration_required',
  'fixed_pricing_configuration_required',
]);

function bookingReasonFromApi(value: unknown): TripBookingBlockedReason | null | undefined {
  if (value === null) return null;
  return blockedBookingReasons.has(value as TripBookingBlockedReason)
    ? value as TripBookingBlockedReason
    : undefined;
}

function positiveInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : undefined;
}

function galleryFromApi(value: unknown): Array<{ id: number; url: string }> | null {
  if (!Array.isArray(value)) return null;

  const gallery: Array<{ id: number; url: string }> = [];
  for (const rawImage of value) {
    const image = record(rawImage);
    const id = positiveInteger(image?.id);
    if (!image || !id || typeof image.url !== 'string') return null;
    gallery.push({ id, url: image.url });
  }

  return gallery;
}

function locationsFromApi(rawLocations: unknown): TripBookingPickupLocation[] | null {
  if (!Array.isArray(rawLocations)) return null;

  const locations: TripBookingPickupLocation[] = [];
  for (const rawLocation of rawLocations) {
    const location = record(rawLocation);
    const id = positiveInteger(location?.id);
    const durationMinutes = positiveInteger(location?.duration_minutes);
    const startingFromPriceMinor = nullablePrice(location?.starting_from_price_minor);
    if (
      !location ||
      !id ||
      !durationMinutes ||
      startingFromPriceMinor === undefined ||
      typeof location.name !== 'string' ||
      typeof location.place_id !== 'string' ||
      typeof location.address !== 'string'
    ) return null;

    locations.push({
      id,
      name: location.name,
      placeId: location.place_id,
      address: location.address,
      durationMinutes,
      startingFromPriceMinor,
    });
  }

  return locations;
}

function departuresFromApi(rawDepartures: unknown): TripBookingDeparture[] | null {
  if (!Array.isArray(rawDepartures)) return null;

  const departures: TripBookingDeparture[] = [];
  for (const rawDeparture of rawDepartures) {
    const departure = record(rawDeparture);
    const id = positiveInteger(departure?.id);
    if (!departure || !id || typeof departure.start_time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(departure.start_time)) {
      return null;
    }
    departures.push({ id, startTime: departure.start_time });
  }

  return departures;
}

function addonsFromApi(rawAddons: unknown): TripBookingAddon[] | null {
  if (!Array.isArray(rawAddons)) return null;

  const addons: TripBookingAddon[] = [];
  for (const rawAddon of rawAddons) {
    const addon = record(rawAddon);
    const id = positiveInteger(addon?.id);
    const priceMinor = nullablePrice(addon?.price_minor);
    const maxQuantity = positiveInteger(addon?.max_quantity);
    const description = nullableString(addon?.description);
    if (!addon || !id || priceMinor === undefined || priceMinor === null || !maxQuantity || description === undefined || typeof addon.name !== 'string') {
      return null;
    }
    addons.push({ id, name: addon.name, description, priceMinor, maxQuantity });
  }

  return addons;
}

function configFromApi(value: unknown): TripBookingConfig | null {
  const data = record(value);
  const trip = record(data?.trip);
  const booking = record(data?.booking);
  const pickup = record(booking?.pickup);
  const schedule = record(booking?.schedule);
  const travellers = record(booking?.travellers);
  const pricing = record(booking?.pricing);
  const flow = record(booking?.flow);
  const subtitle = nullableString(trip?.subtitle);
  const summary = nullableString(trip?.summary);
  const region = nullableString(trip?.region);
  const coverUrl = nullableString(trip?.cover_url);
  const gallery = galleryFromApi(trip?.gallery);
  const reason = bookingReasonFromApi(booking?.reason);
  const pricingMode = booking?.pricing_mode;
  const locations = locationsFromApi(pickup?.locations);
  const fixedDepartures = departuresFromApi(schedule?.fixed_departures);
  const addons = addonsFromApi(booking?.addons);
  const minTravellers = positiveInteger(travellers?.min);
  const maxTravellers = positiveInteger(travellers?.max);
  // Older published trips may be served while the backend migration is rolling out.
  // Their previous behaviour was always to select travellers and apply the stored range.
  const selectionRequired = travellers?.selection_required === undefined
    ? true
    : typeof travellers.selection_required === 'boolean'
      ? travellers.selection_required
      : undefined;
  const limitsApplied = travellers?.limits_applied === undefined
    ? true
    : typeof travellers.limits_applied === 'boolean'
      ? travellers.limits_applied
      : undefined;
  const minNoticeHours = typeof schedule?.min_notice_hours === 'number' && Number.isInteger(schedule.min_notice_hours) && schedule.min_notice_hours >= 0
    ? schedule.min_notice_hours
    : undefined;
  const startingFromPriceMinor = nullablePrice(pricing?.starting_from_price_minor);

  if (
    !data || !trip || !booking || !pickup || !schedule || !travellers || !pricing || !flow ||
    typeof trip.slug !== 'string' || typeof trip.title !== 'string' ||
    subtitle === undefined || summary === undefined || region === undefined || coverUrl === undefined || !gallery ||
    typeof booking.start_booking_allowed !== 'boolean' || reason === undefined ||
    (pricingMode !== 'fixed' && pricingMode !== 'distance' && pricingMode !== 'enquiry') ||
    (pickup.mode !== 'selected' && pickup.mode !== 'custom') || typeof pickup.custom_allowed !== 'boolean' || !locations ||
    (schedule.mode !== 'fixed' && schedule.mode !== 'custom') || typeof schedule.date_required !== 'boolean' || !fixedDepartures || minNoticeHours === undefined ||
    selectionRequired === undefined || limitsApplied === undefined ||
    !minTravellers || !maxTravellers || maxTravellers < minTravellers || !addons ||
    (pricing.mode !== 'fixed' && pricing.mode !== 'route_based' && pricing.mode !== 'enquiry') || typeof pricing.currency !== 'string' || startingFromPriceMinor === undefined || typeof pricing.quote_required !== 'boolean' ||
    (pricingMode === 'fixed' && pricing.mode !== 'fixed') ||
    (pricingMode === 'distance' && pricing.mode !== 'route_based') ||
    (pricingMode === 'enquiry' && pricing.mode !== 'enquiry') ||
    (flow.next_step !== 'quote' && flow.next_step !== 'enquiry') ||
    (flow.quote_endpoint !== null && typeof flow.quote_endpoint !== 'string') ||
    (flow.availability_endpoint !== null && typeof flow.availability_endpoint !== 'string') ||
    typeof flow.enquiry_endpoint !== 'string'
  ) return null;

  return {
    trip: { slug: trip.slug, title: trip.title, subtitle, summary, region, coverUrl, gallery },
    booking: {
      startBookingAllowed: booking.start_booking_allowed,
      reason,
      pricingMode,
      pickup: { mode: pickup.mode, customAllowed: pickup.custom_allowed, locations },
      schedule: { mode: schedule.mode, dateRequired: schedule.date_required, fixedDepartures, minNoticeHours },
      travellers: {
        selectionRequired,
        limitsApplied,
        min: minTravellers,
        max: maxTravellers,
      },
      addons,
      pricing: {
        mode: pricing.mode,
        currency: pricing.currency,
        startingFromPriceMinor,
        quoteRequired: pricing.quote_required,
      },
      flow: {
        nextStep: flow.next_step,
        quoteEndpoint: flow.quote_endpoint,
        availabilityEndpoint: flow.availability_endpoint,
        enquiryEndpoint: flow.enquiry_endpoint,
      },
    },
  };
}

/** Retrieves the public, trip-specific configuration required before asking for a live quote. */
export async function getTripBookingConfig(slug: string): Promise<TripBookingConfig | null> {
  const response = await api<ApiTripBookingConfigResponse>(`/public/trips/${encodeURIComponent(slug)}/booking-config`, {
    cache: 'no-store',
  });

  return configFromApi(response.data);
}
