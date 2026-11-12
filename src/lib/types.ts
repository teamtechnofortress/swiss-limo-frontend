export type VehicleCategory = 'executive' | 'first_class' | 'van';

/** Publicly managed vehicle media. `thumbnail_url` is preferred for small previews. */
export interface VehicleMediaImage {
  id: number;
  url: string;
  thumbnail_url: string | null;
  alt: string | null;
}

export interface VehicleMedia {
  cover: VehicleMediaImage | null;
  gallery: VehicleMediaImage[];
}

export type PaymentMethodKey = 'online' | 'cash_on_arrival';

export type BookingStatus =
  | 'pending_payment'
  | 'pending_verification'
  | 'confirmed'
  | 'needs_review'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'no_show';

export interface Vehicle {
  id?: number;
  slug: string;
  name: string;
  model_name: string | null;
  category: VehicleCategory;
  description: string | null;
  passenger_capacity: number;
  luggage_capacity: number;
  /** Rappen per kilometre. Null means price on request. */
  price_per_km: number | null;
  /** Rappen. */
  minimum_fare: number | null;
  amenities: string[];
  media: VehicleMedia;
  /** Legacy flattened image URLs retained for existing callers. New UI should use `media`. */
  images: string[];
}

export interface RouteMetrics {
  distance_m: number;
  duration_s: number;
  distance_km: number;
  duration_minutes: number;
}

export interface QuoteLeg {
  direction: 'outbound' | 'return';
  pickup: string;
  dropoff: string;
  starts_at: string;
  route: RouteMetrics;
}

export interface QuoteOffer {
  vehicle_id: number;
  slug?: string;
  name: string;
  category: VehicleCategory | string;
  passenger_capacity: number;
  luggage_capacity: number;
  /** Vehicle cover image prepared by the quotes API; absent when no fleet image exists. */
  thumbnail_url: string | null;
  price: { legs: Record<string, number>; discount: number; subtotal: number };
  vat: { net: number; vat: number; gross: number; rate_bp: number; included: boolean };
}

export interface Quote {
  token: string;
  expires_at: string;
  currency: string;
  passengers: number;
  luggage: number;
  legs: QuoteLeg[];
  route_summary: RouteMetrics;
  offers: QuoteOffer[];
  payment_methods: PaymentMethodKey[];
}

export interface BookingLeg {
  direction: 'outbound' | 'return';
  pickup: string | null;
  dropoff: string | null;
  starts_at: string;
  distance_km: number;
  duration_minutes: number;
  amount: number;
}

export interface PublicBooking {
  reference: string;
  status: BookingStatus;
  payment_method: PaymentMethodKey;
  payment_status: string | null;
  vehicle: { id: number | null; name: string | null };
  passengers: number;
  luggage: number;
  price: {
    currency: string;
    net: number;
    vat_rate_bp: number;
    vat: number;
    total: number;
    vat_included: boolean;
    vat_registration_number: string | null;
  };
  legs: BookingLeg[];
  hold_expires_at: string | null;
  cancellation_requested_at: string | null;
}

export interface PlaceValue {
  placeId: string;
  text: string;
}
