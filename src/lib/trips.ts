import { api } from './api';
import { tripFaqsFromApi, type TripFaq } from './trip-faqs';

export type TripPricingMode = 'fixed' | 'distance' | 'enquiry';
export type TripBookingMode = 'online' | 'enquiry';
export type TripBookingBlockedReason =
  | 'enquiry_only'
  | 'pickup_configuration_required'
  | 'destination_configuration_required'
  | 'fixed_pricing_configuration_required';

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

/** The lightweight public payload used by the homepage featured-trip carousel. */
export interface FeaturedTrip {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  descriptionHtml: string | null;
  region: string;
  pricingMode: TripPricingMode;
  startingFromPriceMinor: number | null;
  /** Small, efficient image for the carousel's thumbnail rail. */
  thumbnailUrl: string | null;
  /** Full-resolution image for the animated full-bleed carousel backdrop. */
  originalCoverUrl: string | null;
  /** Legacy full-resolution cover; retained as a safe image fallback. */
  coverUrl: string | null;
}

export interface TripGalleryImage {
  id: number;
  url: string;
}

export interface TripDetail {
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  descriptionHtml: string;
  region: string;
  heroImageUrl: string | null;
  coverUrl: string | null;
  gallery: TripGalleryImage[];
  faqs: TripFaq[];
  pricingMode: TripPricingMode;
  booking: TripBooking;
}

export interface TripBooking {
  startBookingAllowed: boolean;
  reason: TripBookingBlockedReason | null;
  pickupLocationsOnly: boolean;
  /** Rappen. The lowest eligible price across all configured departure locations. */
  startingFromPriceMinor: number | null;
  departureLocations: TripDepartureLocation[];
}

export interface TripDepartureLocation {
  id: number;
  name: string;
  placeId: string;
  address: string;
  durationMinutes: number;
  /** Rappen. Present only for fixed-price trips. */
  startingFromPriceMinor: number | null;
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
  hero_image_url?: unknown;
  cover_url?: unknown;
  gallery?: unknown;
  faqs?: unknown;
  pricing_mode?: unknown;
  booking?: unknown;
}

interface ApiFeaturedTrip {
  slug?: unknown;
  title?: unknown;
  subtitle?: unknown;
  summary?: unknown;
  description_html?: unknown;
  region?: unknown;
  pricing_mode?: unknown;
  starting_from_price_minor?: unknown;
  thumbnail_url?: unknown;
  original_cover_url?: unknown;
  cover_url?: unknown;
}

const pricingModes = new Set<TripPricingMode>(['fixed', 'distance', 'enquiry']);
const bookingModes = new Set<TripBookingMode>(['online', 'enquiry']);
const blockedBookingReasons = new Set<TripBookingBlockedReason>([
  'enquiry_only',
  'pickup_configuration_required',
  'destination_configuration_required',
  'fixed_pricing_configuration_required',
]);

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

function urlOrNull(value: unknown): string | null | undefined {
  if (value === null || value === undefined) return null;
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function featuredTripFromApi(value: unknown): FeaturedTrip | null {
  if (typeof value !== 'object' || value === null) return null;

  const trip = value as ApiFeaturedTrip;
  const pricingMode = trip.pricing_mode as TripPricingMode;
  const startingFromPriceMinor = priceMinorFromApi(trip.starting_from_price_minor);
  const thumbnailUrl = urlOrNull(trip.thumbnail_url);
  const originalCoverUrl = urlOrNull(trip.original_cover_url);
  const coverUrl = urlOrNull(trip.cover_url);

  if (
    typeof trip.slug !== 'string' ||
    typeof trip.title !== 'string' ||
    typeof trip.subtitle !== 'string' ||
    typeof trip.summary !== 'string' ||
    typeof trip.region !== 'string' ||
    !pricingModes.has(pricingMode) ||
    startingFromPriceMinor === undefined ||
    thumbnailUrl === undefined ||
    originalCoverUrl === undefined ||
    coverUrl === undefined ||
    (trip.description_html !== undefined && trip.description_html !== null && typeof trip.description_html !== 'string')
  ) return null;

  return {
    slug: trip.slug,
    title: trip.title,
    subtitle: trip.subtitle,
    summary: trip.summary,
    descriptionHtml: typeof trip.description_html === 'string' ? trip.description_html : null,
    region: trip.region,
    pricingMode,
    startingFromPriceMinor: pricingMode === 'fixed' ? startingFromPriceMinor : null,
    thumbnailUrl,
    originalCoverUrl,
    coverUrl,
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

function priceMinorFromApi(value: unknown): number | null | undefined {
  if (value === null || value === undefined) return null;
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : undefined;
}

function bookingReasonFromApi(value: unknown): TripBookingBlockedReason | null | undefined {
  if (value === null) return null;
  return blockedBookingReasons.has(value as TripBookingBlockedReason)
    ? value as TripBookingBlockedReason
    : undefined;
}

function departureLocationsFromApi(value: unknown, pricingMode: TripPricingMode): TripDepartureLocation[] | null {
  if (!Array.isArray(value)) return null;

  const locations: TripDepartureLocation[] = [];
  for (const location of value) {
    if (typeof location !== 'object' || location === null) return null;

    const item = location as {
      id?: unknown;
      name?: unknown;
      place_id?: unknown;
      address?: unknown;
      duration_minutes?: unknown;
      starting_from_price_minor?: unknown;
    };
    const startingFromPriceMinor = priceMinorFromApi(item.starting_from_price_minor);

    if (
      typeof item.id !== 'number' ||
      !Number.isInteger(item.id) ||
      typeof item.name !== 'string' ||
      typeof item.place_id !== 'string' ||
      typeof item.address !== 'string' ||
      typeof item.duration_minutes !== 'number' ||
      !Number.isInteger(item.duration_minutes) ||
      item.duration_minutes < 0 ||
      startingFromPriceMinor === undefined
    ) {
      return null;
    }

    locations.push({
      id: item.id,
      name: item.name,
      placeId: item.place_id,
      address: item.address,
      durationMinutes: item.duration_minutes,
      startingFromPriceMinor: pricingMode === 'fixed' ? startingFromPriceMinor : null,
    });
  }

  return locations;
}

function tripBookingFromApi(value: unknown, pricingMode: TripPricingMode): TripBooking | null {
  if (typeof value !== 'object' || value === null) return null;

  const booking = value as {
    start_booking_allowed?: unknown;
    reason?: unknown;
    pickup_locations_only?: unknown;
    starting_from_price_minor?: unknown;
    departure_locations?: unknown;
  };
  const startingFromPriceMinor = priceMinorFromApi(booking.starting_from_price_minor);
  const reason = bookingReasonFromApi(booking.reason);
  const departureLocations = departureLocationsFromApi(booking.departure_locations, pricingMode);
  if (
    typeof booking.start_booking_allowed !== 'boolean' ||
    typeof booking.pickup_locations_only !== 'boolean' ||
    reason === undefined ||
    startingFromPriceMinor === undefined ||
    !departureLocations
  ) return null;

  return {
    startBookingAllowed: booking.start_booking_allowed,
    reason,
    pickupLocationsOnly: booking.pickup_locations_only,
    startingFromPriceMinor: pricingMode === 'fixed' ? startingFromPriceMinor : null,
    departureLocations,
  };
}

function tripDetailFromApi(value: unknown): TripDetail | null {
  if (typeof value !== 'object' || value === null) return null;

  const trip = value as ApiTripDetailData;
  const pricingMode = trip.pricing_mode as TripPricingMode;
  const booking = tripBookingFromApi(trip.booking, pricingMode);
  if (
    typeof trip.slug !== 'string' ||
    typeof trip.title !== 'string' ||
    (typeof trip.subtitle !== 'string' && trip.subtitle !== null) ||
    typeof trip.summary !== 'string' ||
    typeof trip.description_html !== 'string' ||
    typeof trip.region !== 'string' ||
    !pricingModes.has(pricingMode) ||
    !booking
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
    heroImageUrl: typeof trip.hero_image_url === 'string' && trip.hero_image_url.length > 0 ? trip.hero_image_url : null,
    coverUrl: typeof trip.cover_url === 'string' && trip.cover_url.length > 0 ? trip.cover_url : null,
    gallery: galleryFromApi(trip.gallery),
    faqs: tripFaqsFromApi(trip.faqs),
    pricingMode,
    booking,
  };
}

const allowedTripTags = new Set(['section', 'article', 'div', 'span', 'img', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'br', 'a']);
const allowedTripClasses = new Set([
  'tour-overview-section', 'tour-countries-section', 'tour-stops-section',
  'tour-itinerary-section', 'tour-comfort-section', 'tour-inclusions-section',
  'section-title', 'section-text', 'country-flags-list', 'country-pill', 'flag-icon',
  'stops-grid', 'stop-card', 'stop-number', 'stop-image', 'stop-city', 'stop-country',
  'itinerary-timeline', 'itinerary-item', 'itinerary-time', 'itinerary-desc',
  'comfort-car', 'comfort-features', 'included-list', 'included-title',
  'not-included-list', 'not-included-title',
]);

function htmlAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Public trip copy is maintained in the CMS. Keep its useful structure while
 * allowing only a narrow, safe set of tags and HTTPS, HTTP, mailto, or relative links.
 */
export function sanitizeTripHtml(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?[a-zA-Z][^>]*>/g, (tag) => {
      const match = tag.match(/^<\s*(\/)?\s*([a-zA-Z0-9]+)([^>]*)>$/);
      if (!match) return '';

      const [, closing, rawName, attributes] = match;
      const name = rawName.toLowerCase();
      if (!allowedTripTags.has(name)) return '';
      if (closing) return `</${name}>`;
      const attribute = (key: string) => attributes.match(new RegExp(`(?:^|\\s)${key}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'))?.slice(1).find(value => value !== undefined);
      const classes = (attribute('class') ?? '').split(/\s+/).filter(value => allowedTripClasses.has(value));
      const classAttribute = classes.length ? ` class="${classes.join(' ')}"` : '';
      if (name === 'img') {
        const src = attribute('src')?.trim();
        if (!src || !/^(https?:\/\/|\/(?!\/))/i.test(src) || /[\\\u0000-\u001f\u007f]/.test(src)) return '';
        // Preserve existing entity escapes while escaping literal attribute delimiters.
        const safeSrc = src.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<img src="${safeSrc}" alt="${htmlAttribute(attribute('alt') ?? '')}" loading="lazy"${classAttribute}>`;
      }
      if (name !== 'a') return `<${name}${classAttribute}>`;
      const href = attribute('href')?.trim();
      return href && /^(https?:\/\/|mailto:|\/(?!\/))/i.test(href) && !/[\\\u0000-\u001f\u007f]/.test(href)
        ? `<a href="${htmlAttribute(href)}">` : '<a>';
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

/** Retrieves the CMS-managed trips selected for the homepage. */
export async function getFeaturedTrips(): Promise<FeaturedTrip[]> {
  const response = await api<{ data?: unknown }>('/public/trips/featured', { cache: 'no-store' });
  return Array.isArray(response.data)
    ? response.data.map(featuredTripFromApi).filter((trip): trip is FeaturedTrip => trip !== null)
    : [];
}

/** Retrieves the published content for one trip's public page. */
export async function getTripDetail(slug: string): Promise<TripDetail | null> {
  const response = await api<ApiTripDetail>(`/public/trips/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  });

  return tripDetailFromApi(response.data);
}
