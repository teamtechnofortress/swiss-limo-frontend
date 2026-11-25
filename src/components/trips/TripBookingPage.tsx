import { TripPickupSelection } from '@/components/trips/TripPickupSelection';
import { Container } from '@/components/ui/primitives';
import type { BookingContent } from '@/content/booking';
import type { TripBookingContent } from '@/content/trip-booking';
import type { TripJourneyConfig } from '@/lib/trip-journey';
import type { TripDetail } from '@/lib/trips';

export function TripBookingPage({
  trip,
  journeyConfig,
  content,
  bookingContent,
  locale,
}: {
  trip: TripDetail;
  journeyConfig: TripJourneyConfig;
  content: TripBookingContent;
  bookingContent: BookingContent;
  locale: string;
}) {
  const enquiryHref = `/${locale}/contact?type=trip&trip=${encodeURIComponent(trip.slug)}`;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa]">
      <section className="relative flex min-h-[164px] w-full shrink-0 items-center overflow-hidden bg-[#0f172a] pt-16 sm:pt-20 xl:pt-24 md:h-[184px] xl:h-[216px]">
        <img src={trip.coverUrl ?? '/images/home/step1.png'} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/65 to-[#0f172a]/20" />
        <Container className="relative z-10 w-full -translate-y-3">
          <h1 data-header-solid-trigger className="font-serif text-3xl font-bold text-white sm:text-4xl" style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor' }}>
            {content.hero.titleBefore} <span className="text-[#eab308]">{content.hero.titleHighlight}</span>
          </h1>
        </Container>
      </section>

      <Container className="relative z-20 -mt-10 flex-1 pb-12 sm:-mt-12">
        <TripPickupSelection trip={trip} journeyConfig={journeyConfig} content={content} bookingContent={bookingContent} locale={locale} enquiryHref={enquiryHref} />
      </Container>
    </div>
  );
}
