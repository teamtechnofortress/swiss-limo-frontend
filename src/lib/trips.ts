import { api } from './api';

export type TripPricingMode = 'fixed' | 'distance' | 'enquiry';
export type TripBookingMode = 'online' | 'enquiry';

export interface Trip {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  region: string;
  coverUrl: string | null;
  pricingMode: TripPricingMode;
  bookingMode: TripBookingMode;
  startingFromPriceMinor: number | null;
}

export interface TripPage {
  data: Trip[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

export interface TripGalleryImage {
  id: number;
  url: string;
}

export interface TripDetail {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  descriptionHtml: string;
  region: string;
  coverUrl: string | null;
  gallery: TripGalleryImage[];
}

export interface TripFilters {
  featured?: boolean;
  region?: string;
  page?: number;
  perPage?: number;
}

interface ApiTrip {
  slug?: unknown;
  title?: unknown;
  subtitle?: unknown;
  summary?: unknown;
  region?: unknown;
  cover_url?: unknown;
  pricing_mode?: unknown;
  booking_mode?: unknown;
  starting_from_price_minor?: unknown;
}

interface ApiTripPage {
  data?: unknown;
  meta?: {
    page?: unknown;
    per_page?: unknown;
    total?: unknown;
    last_page?: unknown;
  };
}

interface ApiTripDetail {
  data?: unknown;
}

interface ApiTripDetailData {
  slug?: unknown;
  title?: unknown;
  subtitle?: unknown;
  summary?: unknown;
  description_html?: unknown;
  region?: unknown;
  cover_url?: unknown;
  gallery?: unknown;
}

const pricingModes = new Set<TripPricingMode>(['fixed', 'distance', 'enquiry']);
const bookingModes = new Set<TripBookingMode>(['online', 'enquiry']);

function positiveInteger(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : fallback;
}

function bookingModeFromApi(value: unknown, pricingMode: TripPricingMode): TripBookingMode {
  if (bookingModes.has(value as TripBookingMode)) return value as TripBookingMode;

  // Keep the customer site compatible with the currently deployed list API.
  // The documented booking_mode is absent there, but its value follows the
  // documented pricing rule.
  return pricingMode === 'enquiry' ? 'enquiry' : 'online';
}

function startingPriceFromApi(value: unknown, pricingMode: TripPricingMode): number | null {
  return pricingMode === 'fixed' && typeof value === 'number' && Number.isInteger(value) && value >= 0
    ? value
    : null;
}

function tripFromApi(value: unknown): Trip | null {
  if (typeof value !== 'object' || value === null) return null;

  const trip = value as ApiTrip;
  const pricingMode = trip.pricing_mode as TripPricingMode;
  if (
    typeof trip.slug !== 'string' ||
    typeof trip.title !== 'string' ||
    typeof trip.subtitle !== 'string' ||
    typeof trip.summary !== 'string' ||
    typeof trip.region !== 'string' ||
    !pricingModes.has(pricingMode)
  ) {
    return null;
  }

  return {
    slug: trip.slug,
    title: trip.title,
    subtitle: trip.subtitle,
    summary: trip.summary,
    region: trip.region,
    coverUrl: typeof trip.cover_url === 'string' && trip.cover_url.length > 0 ? trip.cover_url : null,
    pricingMode,
    bookingMode: bookingModeFromApi(trip.booking_mode, pricingMode),
    startingFromPriceMinor: startingPriceFromApi(trip.starting_from_price_minor, pricingMode),
  };
}

function galleryFromApi(value: unknown): TripGalleryImage[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((image) => {
    if (typeof image !== 'object' || image === null) return [];
    const item = image as { id?: unknown; url?: unknown };
    return typeof item.id === 'number' && Number.isInteger(item.id) && typeof item.url === 'string' && item.url.length > 0
      ? [{ id: item.id, url: item.url }]
      : [];
  });
}

function tripDetailFromApi(value: unknown): TripDetail | null {
  if (typeof value !== 'object' || value === null) return null;

  const trip = value as ApiTripDetailData;
  if (
    typeof trip.slug !== 'string' ||
    typeof trip.title !== 'string' ||
    typeof trip.subtitle !== 'string' ||
    typeof trip.summary !== 'string' ||
    typeof trip.description_html !== 'string' ||
    typeof trip.region !== 'string'
  ) {
    return null;
  }

  return {
    slug: trip.slug,
    title: trip.title,
    subtitle: trip.subtitle,
    summary: trip.summary,
    descriptionHtml: sanitizeTripHtml(trip.description_html),
    region: trip.region,
    coverUrl: typeof trip.cover_url === 'string' && trip.cover_url.length > 0 ? trip.cover_url : null,
    gallery: galleryFromApi(trip.gallery),
  };
}

const allowedTripTags = new Set(['h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'br', 'a']);

/**
 * Public trip copy is maintained in the CMS. Keep its useful structure while
 * allowing only a narrow, safe set of tags and HTTPS, HTTP, mailto, or relative links.
 */
function sanitizeTripHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?[a-zA-Z][^>]*>/g, (tag) => {
      const match = tag.match(/^<\s*(\/)?\s*([a-zA-Z0-9]+)([^>]*)>$/);
      if (!match) return '';

      const [, closing, rawName, attributes] = match;
      const name = rawName.toLowerCase();
      if (!allowedTripTags.has(name)) return '';
      if (closing) return `</${name}>`;
      if (name !== 'a') return `<${name}>`;

      const href = attributes.match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1]?.trim();
      return href && /^(https?:\/\/|mailto:|\/)/i.test(href) ? `<a href="${href.replace(/"/g, '&quot;')}">` : '<a>';
    });
}

function queryForTrips(filters: TripFilters): string {
  const query = new URLSearchParams();

  if (filters.featured) query.set('featured', 'true');
  if (filters.region?.trim()) query.set('region', filters.region.trim());
  query.set('page', String(positiveInteger(filters.page, 1)));
  query.set('per_page', String(Math.min(24, positiveInteger(filters.perPage, 12))));

  return query.toString();
}

/** Retrieves only customer-visible, published trips from the public API. */
export async function getTrips(filters: TripFilters = {}): Promise<TripPage> {
  const response = await api<ApiTripPage>(`/public/trips?${queryForTrips(filters)}`, {
    // Trips can be published or withdrawn at any time; always request the current public catalogue.
    cache: 'no-store',
  });
  const requestedPage = positiveInteger(filters.page, 1);
  const requestedPerPage = Math.min(24, positiveInteger(filters.perPage, 12));

  return {
    data: Array.isArray(response.data)
      ? response.data.map(tripFromApi).filter((trip): trip is Trip => trip !== null)
      : [],
    meta: {
      page: positiveInteger(response.meta?.page, requestedPage),
      perPage: Math.min(24, positiveInteger(response.meta?.per_page, requestedPerPage)),
      total: typeof response.meta?.total === 'number' && response.meta.total >= 0 ? response.meta.total : 0,
      lastPage: positiveInteger(response.meta?.last_page, 1),
    },
  };
}

/** Retrieves the published content for one trip's public page. */
export async function getTripDetail(slug: string): Promise<TripDetail | null> {
  const response = await api<ApiTripDetail>(`/public/trips/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  });

  return tripDetailFromApi(response.data);
}
