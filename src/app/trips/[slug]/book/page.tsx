import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { TripPickupSelection } from '@/components/trips/TripPickupSelection';
import { Container } from '@/components/ui/primitives';
import { getTripJourneyConfig } from '@/lib/trip-journey';
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

  const enquiryHref = `/contact?type=trip&trip=${encodeURIComponent(trip.slug)}`;
  if (!trip.booking.startBookingAllowed || trip.pricingMode === 'enquiry') redirect(enquiryHref);

  let journeyConfig;
  try {
    journeyConfig = await getTripJourneyConfig(trip.slug);
  } catch {
    notFound();
  }

  if (!journeyConfig || !journeyConfig.startBookingAllowed) redirect(enquiryHref);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="relative flex min-h-[150px] w-full items-center overflow-hidden bg-[#0f172a] sm:min-h-[170px]">
        <img src={trip.coverUrl ?? '/images/home/step1.png'} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/65 to-[#0f172a]/20" />
        <Container className="relative z-10 py-8 sm:py-10">
          <Link href={`/trips/${encodeURIComponent(trip.slug)}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 transition hover:text-[#eab308]">
            <ArrowLeft size={14} /> Back to trip
          </Link>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#eab308]">Trip booking</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-white sm:text-4xl" style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor' }}>
            Book your <span className="text-[#eab308]">experience</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">{trip.title}. Choose your pickup and journey details, then reserve the vehicle that suits you.</p>
        </Container>
      </div>

      <Container className="relative z-10 -mt-5 pb-12 pt-0 sm:-mt-7">
        <TripPickupSelection trip={trip} journeyConfig={journeyConfig} />
      </Container>
    </div>
  );
}
