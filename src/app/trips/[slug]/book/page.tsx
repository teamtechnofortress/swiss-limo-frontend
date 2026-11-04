import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { TripPickupSelection } from '@/components/trips/TripPickupSelection';
import { ButtonLink, Container, Eyebrow, Section } from '@/components/ui/primitives';
import { getTripPickupConfig } from '@/lib/trip-pickup';
import { getTripDetail } from '@/lib/trips';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const trip = await getTripDetail(slug);
    return trip ? { title: `Book ${trip.title}`, description: trip.summary } : { title: 'Trip not found' };
  } catch {
    return { title: 'Book a trip' };
  }
}

export default async function TripBookingPage({ params }: { params: Params }) {
  const { slug } = await params;
  let trip;

  try {
    trip = await getTripDetail(slug);
  } catch {
    notFound();
  }

  if (!trip) notFound();

  const enquiryHref = `/contact?trip=${encodeURIComponent(trip.slug)}`;
  if (!trip.booking.startBookingAllowed || trip.pricingMode === 'enquiry') redirect(enquiryHref);

  let pickupConfig;
  try {
    pickupConfig = await getTripPickupConfig(trip.slug);
  } catch {
    notFound();
  }

  if (!pickupConfig) notFound();

  return (
    <Section className="pt-16 md:pt-24">
      <Container>
        <ButtonLink href={`/trips/${encodeURIComponent(trip.slug)}`} variant="ghost" className="-ml-7">
          <ArrowLeft size={16} /> Back to trip
        </ButtonLink>

        <header className="mb-14 mt-10 max-w-3xl">
          <Eyebrow className="mb-5">Trip booking</Eyebrow>
          <h1 className="text-5xl leading-tight md:text-6xl">Book your experience</h1>
          <p className="mt-5 text-mute">
            {trip.title}. Choose your pickup and journey details, then reserve the vehicle that suits you.
          </p>
        </header>

        <TripPickupSelection trip={trip} pickupConfig={pickupConfig} />
      </Container>
    </Section>
  );
}
