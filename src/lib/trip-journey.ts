import { api } from './api';
import type { PaymentMethodKey } from './types';

export type TripJourneyBlockedReason =
  | 'enquiry_only'
  | 'pickup_configuration_required'
  | 'destination_configuration_required'
  | 'fixed_pricing_configuration_required';

export interface TripJourneyConfig {
  startBookingAllowed: boolean;
  reason: TripJourneyBlockedReason | null;
  schedule: {
    mode: 'fixed' | 'custom';
    dateRequired: boolean;
    fixedDepartures: Array<{ id: number; startTime: string }>;
    minNoticeHours: number;
  };
  travellers: {
    selectionRequired: boolean;
    limitsApplied: boolean;
    min: number;
    max: number;
  };
  addons: Array<{
    id: number;
    name: string;
    description: string | null;
    priceMinor: number;
    maxQuantity: number;
  }>;
  pricing: {
    mode: 'fixed' | 'route_based' | 'enquiry';
    currency: string;
    startingFromPriceMinor: number | null;
    quoteRequired: boolean;
  };
  quoteEndpoint: string | null;
  enquiryEndpoint: string;
}

export interface TripVehicleOffer {
  vehicleId: number;
  vehicle: {
    name: string;
    modelName: string | null;
    categoryName: string;
    description: string | null;
    imageUrl: string | null;
    passengerCapacity: number;
    luggageCapacity: number;
    amenities: string[];
  };
  price: {
    baseMinor: number;
    addonsMinor: number;
    subtotalMinor: number;
    totalMinor: number;
  };
  vat: { net: number; vat: number; gross: number; rateBp: number; included: boolean };
}

export interface TripQuote {
  token: string;
  expiresAt: string;
  currency: string;
  passengers: number;
  paymentMethods: PaymentMethodKey[];
  offers: TripVehicleOffer[];
}

interface ApiResponse { data?: unknown }

function object(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : null;
}

function positiveInteger(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
}

function nonNegativeInteger(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function nullableString(value: unknown): string | null | undefined {
  if (value === null || value === undefined) return null;
  return typeof value === 'string' ? value : undefined;
}

const reasons = new Set<TripJourneyBlockedReason>([
  'enquiry_only',
  'pickup_configuration_required',
  'destination_configuration_required',
  'fixed_pricing_configuration_required',
]);

function journeyConfigFromApi(value: unknown): TripJourneyConfig | null {
  const config = object(value);
  const schedule = object(config?.schedule);
  const travellers = object(config?.travellers);
  const pricing = object(config?.pricing);
  if (!config || !schedule || !travellers || !pricing || !Array.isArray(schedule.fixed_departures) || !Array.isArray(config.addons)) return null;

  const fixedDepartures = schedule.fixed_departures.flatMap((raw) => {
    const departure = object(raw);
    const id = positiveInteger(departure?.id);
    return id && typeof departure?.start_time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(departure.start_time)
      ? [{ id, startTime: departure.start_time }]
      : [];
  });
  if (fixedDepartures.length !== schedule.fixed_departures.length) return null;

  const addons = config.addons.flatMap((raw) => {
    const addon = object(raw);
    const id = positiveInteger(addon?.id);
    const priceMinor = nonNegativeInteger(addon?.price_minor);
    const maxQuantity = positiveInteger(addon?.max_quantity);
    const description = nullableString(addon?.description);
    return id && priceMinor !== null && maxQuantity && description !== undefined && typeof addon?.name === 'string'
      ? [{ id, name: addon.name, description, priceMinor, maxQuantity }]
      : [];
  });
  if (addons.length !== config.addons.length) return null;

  const reason = config.reason === null
    ? null
    : reasons.has(config.reason as TripJourneyBlockedReason)
      ? config.reason as TripJourneyBlockedReason
      : undefined;
  const min = positiveInteger(travellers.min);
  const max = positiveInteger(travellers.max);
  const startingFromPriceMinor = pricing.starting_from_price_minor === null
    ? null
    : nonNegativeInteger(pricing.starting_from_price_minor);
  const minNoticeHours = nonNegativeInteger(schedule.min_notice_hours);

  if (
    typeof config.start_booking_allowed !== 'boolean' || reason === undefined ||
    (schedule.mode !== 'fixed' && schedule.mode !== 'custom') || typeof schedule.date_required !== 'boolean' || minNoticeHours === null ||
    typeof travellers.selection_required !== 'boolean' || typeof travellers.limits_applied !== 'boolean' || !min || !max || max < min ||
    (pricing.mode !== 'fixed' && pricing.mode !== 'route_based' && pricing.mode !== 'enquiry') || typeof pricing.currency !== 'string' || startingFromPriceMinor === null && pricing.starting_from_price_minor !== null || typeof pricing.quote_required !== 'boolean' ||
    (config.quote_endpoint !== null && typeof config.quote_endpoint !== 'string') || typeof config.enquiry_endpoint !== 'string'
  ) return null;

  return {
    startBookingAllowed: config.start_booking_allowed,
    reason,
    schedule: { mode: schedule.mode, dateRequired: schedule.date_required, fixedDepartures, minNoticeHours },
    travellers: { selectionRequired: travellers.selection_required, limitsApplied: travellers.limits_applied, min, max },
    addons,
    pricing: { mode: pricing.mode, currency: pricing.currency, startingFromPriceMinor, quoteRequired: pricing.quote_required },
    quoteEndpoint: config.quote_endpoint,
    enquiryEndpoint: config.enquiry_endpoint,
  };
}

function quoteFromApi(value: unknown): TripQuote | null {
  const quote = object(value);
  if (!quote || typeof quote.token !== 'string' || typeof quote.expires_at !== 'string' || typeof quote.currency !== 'string') return null;
  const passengers = positiveInteger(quote.passengers);
  const offersRecord = object(quote.offers);
  if (!passengers || !offersRecord) return null;
  const paymentMethods = Array.isArray(quote.payment_methods)
    ? quote.payment_methods.filter((method): method is PaymentMethodKey => method === 'online' || method === 'cash_on_arrival')
    : ['online', 'cash_on_arrival'] as PaymentMethodKey[];
  if (paymentMethods.length === 0) return null;

  const offers = Object.values(offersRecord).flatMap((rawOffer) => {
    const offer = object(rawOffer);
    const vehicle = object(offer?.vehicle);
    const category = object(vehicle?.category);
    const image = object(vehicle?.image);
    const price = object(offer?.price);
    const vat = object(offer?.vat);
    const vehicleId = positiveInteger(offer?.vehicle_id);
    const baseMinor = nonNegativeInteger(price?.base_minor);
    const addonsMinor = nonNegativeInteger(price?.addons_minor);
    const subtotalMinor = nonNegativeInteger(price?.subtotal_minor);
    const totalMinor = nonNegativeInteger(price?.total_minor);
    const net = nonNegativeInteger(vat?.net);
    const vatAmount = nonNegativeInteger(vat?.vat);
    const gross = nonNegativeInteger(vat?.gross);
    const rateBp = nonNegativeInteger(vat?.rate_bp);
    const passengerCapacity = positiveInteger(vehicle?.passenger_capacity);
    const luggageCapacity = nonNegativeInteger(vehicle?.luggage_capacity);
    const modelName = nullableString(vehicle?.model_name);
    const description = nullableString(vehicle?.description);
    const imageUrl = nullableString(image?.url);
    if (
      !offer || !vehicle || !category || !price || !vat || !vehicleId ||
      typeof vehicle.name !== 'string' || typeof category.name !== 'string' || modelName === undefined || description === undefined || imageUrl === undefined ||
      !passengerCapacity || luggageCapacity === null || !Array.isArray(vehicle.amenities) || !vehicle.amenities.every((amenity) => typeof amenity === 'string') ||
      baseMinor === null || addonsMinor === null || subtotalMinor === null || totalMinor === null || net === null || vatAmount === null || gross === null || rateBp === null || typeof vat.included !== 'boolean'
    ) return [];

    return [{
      vehicleId,
      vehicle: {
        name: vehicle.name,
        modelName,
        categoryName: category.name,
        description,
        imageUrl,
        passengerCapacity,
        luggageCapacity,
        amenities: vehicle.amenities as string[],
      },
      price: { baseMinor, addonsMinor, subtotalMinor, totalMinor },
      vat: { net, vat: vatAmount, gross, rateBp, included: vat.included },
    }];
  });

  return offers.length === Object.keys(offersRecord).length
    ? { token: quote.token, expiresAt: quote.expires_at, currency: quote.currency, passengers, paymentMethods, offers }
    : null;
}

export async function getTripJourneyConfig(slug: string): Promise<TripJourneyConfig | null> {
  const response = await api<ApiResponse>(`/public/trips/${encodeURIComponent(slug)}/journey-config`, { cache: 'no-store' });
  return journeyConfigFromApi(response.data);
}

export async function getTripQuote(path: string, body: Record<string, unknown>): Promise<TripQuote | null> {
  const apiPath = path.startsWith('/api/') ? path.slice(4) : path;
  const response = await api<ApiResponse>(apiPath, { method: 'POST', body: JSON.stringify(body) });
  return quoteFromApi(response.data);
}
