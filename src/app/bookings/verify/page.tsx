'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { ButtonLink, Card, Container, Eyebrow, GoldRule } from '@/components/ui/primitives';
import { api, ApiError } from '@/lib/api';
import type { PublicBooking } from '@/lib/types';

type VerifyState =
  | { status: 'loading' }
  | { status: 'done'; booking: PublicBooking }
  | { status: 'error'; message: string };

function VerifyContent() {
  const search = useSearchParams();
  const token = search.get('token');
  const [state, setState] = useState<VerifyState>({ status: 'loading' });

  useEffect(() => {
    if (!token || !/^[A-Za-z0-9]{64}$/.test(token)) {
      setState({
        status: 'error',
        message: 'This confirmation link is incomplete. Please use the full link from your email.',
      });
      return;
    }

    let cancelled = false;

    api<{ data: PublicBooking }>(`/public/bookings/verify/${token}`, { cache: 'no-store' })
      .then((res) => {
        if (!cancelled) setState({ status: 'done', booking: res.data });
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            message: e instanceof ApiError ? e.message : 'Something went wrong. Please try again.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-24">
      <Card className="w-full max-w-xl p-12 text-center">
        <Eyebrow className="mb-6">Booking confirmation</Eyebrow>

        {state.status === 'loading' && (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gold" size={24} />
          </div>
        )}

        {state.status === 'done' && (
          <>
            <CheckCircle2 className="mx-auto text-gold" size={40} />
            <h1 className="mt-6 text-4xl">Your booking is confirmed</h1>
            <GoldRule className="mx-auto my-8" />
            <p className="text-mute">
              Reference <span className="text-gold">{state.booking.reference}</span>. Thank you. Your chauffeur will be
              ready for your journey. Use the link in your first email to manage the booking.
            </p>
            <div className="mt-10">
              <ButtonLink href="/">Back to home</ButtonLink>
            </div>
          </>
        )}

        {state.status === 'error' && (
          <>
            <h1 className="mt-2 text-4xl">We could not confirm this booking</h1>
            <GoldRule className="mx-auto my-8" />
            <p className="text-mute">{state.message}</p>
            <div className="mt-10 flex flex-col gap-3">
              <Link href="/contact" className="text-sm uppercase tracking-[0.2em] text-gold hover:underline">
                Contact us for help
              </Link>
            </div>
          </>
        )}
      </Card>
    </Container>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
