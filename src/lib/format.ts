import type { BookingStatus, Vehicle, VehicleCategory } from './types';

const chf = new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' });

/** Converts rappen (integer) to a display string such as "CHF 210.00". */
export function money(rappen: number): string {
  return chf.format(rappen / 100);
}

/** Formats the public vehicle fare contract. Vehicle rates are never exposed per kilometre. */
export function vehiclePriceLabel(vehicle: Pick<Vehicle, 'display_fare_minor' | 'display_fare_type' | 'price_on_request' | 'pricing'>): string {
  if (vehicle.price_on_request) return 'Price on request';
  if (vehicle.display_fare_minor === null) return 'Get a quote';

  const price = money(vehicle.display_fare_minor);
  if (vehicle.display_fare_type === 'base') {
    const distance = vehicle.pricing.base_distance_km;
    return distance ? `Base fare ${price} · includes first ${distance} km` : `Base fare ${price}`;
  }

  return `Minimum fare ${price}`;
}

export type VehicleCardCopy = {
  categories: Record<VehicleCategory, string>;
  viewVehicle: string;
  passengerCapacity: string;
  luggageCapacity: string;
  requestQuote: string;
  bookNow: string;
  pricing: string;
  priceOnRequest: string;
  getQuote: string;
  startingFrom: string;
  baseFare: string;
  baseFareIncludesFirstKm: string;
  minimumFare: string;
};

export const defaultVehicleCardCopy: VehicleCardCopy = {
  categories: {
    executive: 'Executive',
    first_class: 'First class',
    van: 'Vans',
  },
  viewVehicle: 'View {vehicle}',
  passengerCapacity: 'Up to {count}',
  luggageCapacity: '{count} bags',
  requestQuote: 'Request a quote',
  bookNow: 'Book now',
  pricing: 'Pricing',
  priceOnRequest: 'Price on request',
  getQuote: 'Get a quote',
  startingFrom: 'Starting from',
  baseFare: 'Base fare',
  baseFareIncludesFirstKm: 'Base fare · includes first {distance} km',
  minimumFare: 'Minimum fare',
};

function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`));
}

/** Separates the public vehicle fare into card-friendly price and supporting copy. */
export function vehiclePriceSummary(
  vehicle: Pick<Vehicle, 'display_fare_minor' | 'display_fare_type' | 'price_on_request' | 'pricing'>,
  copy: Pick<VehicleCardCopy, 'pricing' | 'priceOnRequest' | 'getQuote' | 'startingFrom' | 'baseFare' | 'baseFareIncludesFirstKm' | 'minimumFare'> = defaultVehicleCardCopy,
) {
  if (vehicle.price_on_request) {
    return { eyebrow: copy.pricing, price: copy.priceOnRequest, detail: null };
  }
  if (vehicle.display_fare_minor === null) {
    return { eyebrow: copy.pricing, price: copy.getQuote, detail: null };
  }

  if (vehicle.display_fare_type === 'base') {
    const distance = vehicle.pricing.base_distance_km;
    return {
      eyebrow: copy.startingFrom,
      price: money(vehicle.display_fare_minor),
      detail: distance ? fillTemplate(copy.baseFareIncludesFirstKm, { distance }) : copy.baseFare,
    };
  }

  return { eyebrow: copy.startingFrom, price: money(vehicle.display_fare_minor), detail: copy.minimumFare };
}

export function vehicleCardTemplate(template: string, values: Record<string, string | number>): string {
  return fillTemplate(template, values);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Zurich',
  }).format(new Date(iso));
}

/**
 * Converts a wall-clock time in Switzerland (date "YYYY-MM-DD", time "HH:MM") to a UTC ISO string.
 * The offset is read from the Europe/Zurich zone, so the result is correct whatever the visitor's clock says.
 */
export function zurichLocalToIso(date: string, time: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const guess = Date.UTC(year, month - 1, day, hour, minute);

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Zurich',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(guess));

  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const zurichWallClockAsUtc = Date.UTC(
    part('year'),
    part('month') - 1,
    part('day'),
    part('hour'),
    part('minute'),
    part('second'),
  );

  const offset = zurichWallClockAsUtc - guess;
  return new Date(guess - offset).toISOString();
}

/** Today's date in Switzerland as "YYYY-MM-DD". */
export function zurichToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(new Date());
}

export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

export const CATEGORY_LABEL: Record<VehicleCategory, string> = {
  executive: 'Executive',
  first_class: 'First class',
  van: 'Vans',
};

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending_payment: 'Awaiting payment',
  pending_verification: 'Awaiting email confirmation',
  confirmed: 'Confirmed',
  needs_review: 'Under review by our team',
  assigned: 'Confirmed, chauffeur assigned',
  in_progress: 'Trip in progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  expired: 'Expired',
  no_show: 'No show',
};

export const AMENITY_LABEL: Record<string, string> = {
  wifi: 'Wi-Fi',
  water: 'Chilled water',
  champagne: 'Champagne service',
  leather: 'Leather seating',
};

export function amenityLabel(key: string): string {
  return AMENITY_LABEL[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}
