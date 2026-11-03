import type { Metadata } from 'next';
import { BookingFlow } from '@/components/booking/BookingFlow';
import { Container, Eyebrow, Section } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Book a journey',
  description: 'Plan your private chauffeur journey: choose your route, your vehicle and pay securely.',
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const passengers = Number(params.passengers);

  return (
    <Section className="pt-16 md:pt-24">
      <Container>
        <header className="mb-14 max-w-2xl">
          <Eyebrow className="mb-5">Booking</Eyebrow>
          <h1 className="text-5xl leading-tight md:text-6xl">Plan your journey</h1>
          <p className="mt-5 text-mute">
            Choose your addresses and time. You will see every available vehicle with its price before you pay.
          </p>
        </header>

        <BookingFlow
          from={params.from}
          to={params.to}
          date={params.date}
          time={params.time}
          passengers={Number.isInteger(passengers) && passengers > 0 ? passengers : undefined}
          vehicle={params.vehicle}
        />
      </Container>
    </Section>
  );
}
