import type { BookingStatus, VehicleCategory } from './types';

const chf = new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' });

/** Converts rappen (integer) to a display string such as "CHF 210.00". */
export function money(rappen: number): string {
  return chf.format(rappen / 100);
}

export function pricePerKm(rappen: number | null): string {
  return rappen === null ? 'On request' : `${money(rappen)} / km`;
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
