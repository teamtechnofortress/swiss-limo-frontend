'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { Button, Card, Field, GoldRule, inputClass } from '@/components/ui/primitives';
import { api, ApiError } from '@/lib/api';
import { formatDateTime, money, STATUS_LABEL } from '@/lib/format';
import type { PublicBooking } from '@/lib/types';

function messageOf(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
}

export function BookingView({ reference }: { reference: string }) {
  const search = useSearchParams();
  const paymentFlag = search.get('payment');
  const storageKey = `limo:access:${reference}`;

  const [token, setToken] = useState<string | null>(null);
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [reason, setReason] = useState('');
  const [cancelSent, setCancelSent] = useState(false);

  const load = useCallback(
    async (accessToken: string) => {
      try {
        const res = await api<{ data: PublicBooking }>(`/public/bookings/${reference}`, {
          token: accessToken,
          cache: 'no-store',
        });
        setBooking(res.data);
        setError(null);
      } catch (e) {
        setError(
          e instanceof ApiError && e.status === 404
            ? 'We could not find this booking with the link you used.'
            : 'We could not load your booking. Please refresh the page.',
        );
      } finally {
        setLoading(false);
      }
    },
    [reference],
  );

  // Read the access token from the email link, or from this tab, then remove it from the address bar.
  useEffect(() => {
    const fromUrl = search.get('token');
    const accessToken = fromUrl ?? sessionStorage.getItem(storageKey);

    if (fromUrl) {
      sessionStorage.setItem(storageKey, fromUrl);
      const keep = paymentFlag ? `?payment=${paymentFlag}` : '';
      window.history.replaceState(null, '', `${window.location.pathname}${keep}`);
    }

    setToken(accessToken);

    if (!accessToken) {
      setLoading(false);
      setError('Open the link from your confirmation email to view this booking.');
      return;
    }

    load(accessToken);
    // Runs once per booking reference. The search params are read at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, load]);

  // After a successful card payment, the webhook may take a few seconds. Refresh until it lands.
  useEffect(() => {
    if (!token || !booking || booking.status !== 'pending_payment' || paymentFlag !== 'success') return;

    const timer = setInterval(() => load(token), 3000);
    return () => clearInterval(timer);
  }, [token, booking, paymentFlag, load]);

  async function payNow() {
    if (!token) return;
    setPaying(true);
    setError(null);

    try {
      const res = await api<{ data: { checkout_url: string } }>(`/public/bookings/${reference}/checkout`, {
        method: 'POST',
        token,
      });
      window.location.assign(res.data.checkout_url);
    } catch (e) {
      setError(messageOf(e));
      setPaying(false);
    }
  }

  async function requestCancellation(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    try {
      await api(`/public/bookings/${reference}/cancel-request`, {
        method: 'POST',
        token,
        body: JSON.stringify({ reason: reason.trim() }),
      });
      setCancelSent(true);
    } catch (e) {
      setError(messageOf(e));
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-mute">
        <Loader2 className="animate-spin text-gold" size={22} />
      </div>
    );
  }

  if (!booking) {
    return (
      <Card className="mx-auto max-w-xl p-10 text-center">
        <p className="font-serif text-2xl">Booking unavailable</p>
        <p className="mt-4 text-sm leading-relaxed text-mute">{error}</p>
      </Card>
    );
  }

  const canCancel = ['confirmed', 'assigned'].includes(booking.status) && !booking.cancellation_requested_at;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-8 lg:col-span-7">
        {paymentFlag === 'success' && booking.status === 'pending_payment' && (
          <p className="rounded-2xl border border-gold/30 bg-ink-raised px-5 py-4 text-sm text-gold-soft">
            Thank you. We are confirming your payment. This page updates automatically.
          </p>
        )}
        {paymentFlag === 'cancelled' && (
          <p className="rounded-2xl border border-line px-5 py-4 text-sm text-mute">
            Payment was not completed. You can pay now while your reservation is held.
          </p>
        )}

        <Card className="p-10">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Booking reference</p>
          <h1 className="mt-4 text-5xl tracking-wide">{booking.reference}</h1>
          <GoldRule className="my-8" />
          <div className="flex items-center gap-4">
            {booking.status === 'confirmed' || booking.status === 'assigned' ? (
              <CheckCircle2 className="text-gold" size={22} />
            ) : null}
            <p className="font-serif text-2xl">{STATUS_LABEL[booking.status]}</p>
          </div>

          {booking.status === 'pending_payment' && booking.payment_method === 'online' && (
            <div className="mt-8">
              <Button onClick={payNow} disabled={paying}>
                <CreditCard size={16} /> {paying ? 'Opening secure payment…' : 'Pay now'}
              </Button>
              {booking.hold_expires_at && (
                <p className="mt-4 text-xs text-mute">
                  Your car is held until {formatDateTime(booking.hold_expires_at)}.
                </p>
              )}
            </div>
          )}

          {booking.status === 'pending_verification' && (
            <p className="mt-6 text-sm leading-relaxed text-mute">
              Please open the confirmation link in your email to confirm this booking.
            </p>
          )}
        </Card>

        <Card className="p-10">
          <p className="mb-6 font-serif text-2xl">Journey</p>
          <div className="space-y-6">
            {booking.legs.map((leg) => (
              <div key={`${leg.direction}-${leg.starts_at}`} className="border-l border-gold/50 pl-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{leg.direction === 'outbound' ? 'Outbound' : 'Return'}</p>
                <p className="mt-2 text-ivory/90">{leg.pickup ?? '—'}</p>
                <p className="mt-1 text-sm text-mute">to {leg.dropoff ?? '—'}</p>
                <p className="mt-2 text-sm text-mute">
                  {formatDateTime(leg.starts_at)} · {leg.distance_km} km · about {leg.duration_minutes} min
                </p>
              </div>
            ))}
          </div>
        </Card>

        {canCancel && (
          <Card className="p-10">
            <p className="font-serif text-2xl">Request a cancellation</p>
            {cancelSent ? (
              <p className="mt-4 text-sm text-mute">Your request has been received. We will be in touch shortly.</p>
            ) : (
              <form onSubmit={requestCancellation} className="mt-6 space-y-5">
                <Field label="Reason">
                  <textarea
                    className={`${inputClass} min-h-[110px]`}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    minLength={3}
                    maxLength={500}
                    required
                  />
                </Field>
                <p className="text-xs text-mute">Cancellations are reviewed by our team. Refunds follow our cancellation policy.</p>
                <Button type="submit" variant="outline">Send request</Button>
              </form>
            )}
          </Card>
        )}
      </div>

      <aside className="lg:col-span-5">
        <Card className="sticky top-32 p-8">
          <p className="font-serif text-2xl">Summary</p>
          <dl className="mt-6 space-y-4 text-sm">
            <Row label="Vehicle" value={booking.vehicle.name ?? '—'} />
            <Row label="Passengers" value={String(booking.passengers)} />
            <Row label="Luggage" value={String(booking.luggage)} />
            <Row label="Payment" value={booking.payment_method === 'online' ? 'Online' : 'Pay on arrival'} />
          </dl>
          <div className="mt-8 space-y-2 border-t hairline pt-6 text-sm">
            <Row label="Net" value={money(booking.price.net)} />
            <Row label={`VAT ${(booking.price.vat_rate_bp / 100).toFixed(2)}%`} value={money(booking.price.vat)} />
            <div className="flex items-baseline justify-between pt-3">
              <span className="text-mute">Total</span>
              <span className="font-serif text-3xl text-gold">{money(booking.price.total)}</span>
            </div>
          </div>
          {booking.price.vat_registration_number && (
            <p className="mt-6 text-xs text-mute">VAT no. {booking.price.vat_registration_number}</p>
          )}
        </Card>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <dt className="text-mute">{label}</dt>
      <dd className="text-right text-ivory/90">{value}</dd>
    </div>
  );
}
