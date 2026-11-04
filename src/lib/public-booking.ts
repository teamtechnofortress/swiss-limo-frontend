import { api } from './api';
import type { PaymentMethodKey } from './types';

export interface PublicBookingRequest {
  quoteToken: string;
  vehicleId: number;
  paymentMethod: PaymentMethodKey;
  customer: { name: string; email: string; phone: string };
  flightNumber?: string | null;
  turnstileToken?: string | null;
}

export interface CreatedPublicBooking {
  reference: string;
  accessToken: string;
  checkoutUrl: string | null;
}

/** Creates a booking from a server-issued quote. All journey and price data stays in the quote token. */
export async function createPublicBooking({
  quoteToken,
  vehicleId,
  paymentMethod,
  customer,
  flightNumber = null,
  turnstileToken = null,
}: PublicBookingRequest): Promise<CreatedPublicBooking> {
  const response = await api<{
    data: { reference: string };
    meta: { access_token: string; checkout_url: string | null };
  }>('/public/bookings', {
    method: 'POST',
    body: JSON.stringify({
      quote_token: quoteToken,
      vehicle_id: vehicleId,
      payment_method: paymentMethod,
      customer,
      ...(flightNumber ? { flight_number: flightNumber } : {}),
      ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
    }),
  });

  return {
    reference: response.data.reference,
    accessToken: response.meta.access_token,
    checkoutUrl: response.meta.checkout_url,
  };
}

/** The initial booking response can omit the checkout URL; request a fresh one with the private customer token. */
export async function resolveCheckoutUrl(booking: CreatedPublicBooking): Promise<string | null> {
  if (booking.checkoutUrl) return booking.checkoutUrl;

  const response = await api<{ data: { checkout_url: string | null } }>(
    `/public/bookings/${encodeURIComponent(booking.reference)}/checkout`,
    { method: 'POST', token: booking.accessToken },
  );

  return response.data.checkout_url;
}
