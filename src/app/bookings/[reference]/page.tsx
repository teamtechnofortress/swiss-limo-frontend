import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BookingView } from '@/components/booking/BookingView';
import { Container, Eyebrow } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Your booking',
  robots: { index: false, follow: false },
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  if (!/^LX-[A-Z0-9]{5}$/.test(reference)) {
    notFound();
  }

  return (
    <Container className="pb-32 pt-12 md:pt-20">
      <Eyebrow className="mb-8">Your booking</Eyebrow>
      <Suspense fallback={null}>
        <BookingView reference={reference} />
      </Suspense>
    </Container>
  );
}
