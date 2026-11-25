import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { TripBookingPage } from '@/components/trips/TripBookingPage';
import type { BookingContent } from '@/content/booking';
import type { TripBookingContent } from '@/content/trip-booking';
import { getTripJourneyConfig } from '@/lib/trip-journey';
import { getTripDetail } from '@/lib/trips';

type TripBookingRouteProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: TripBookingRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [trip, t] = await Promise.all([
    getTripDetail(slug).catch(() => null),
    getTranslations({ locale, namespace: 'TripBooking.metadata' }),
  ]);

  return trip
    ? { title: t('title', { trip: trip.title }), description: t('description') }
    : { title: t('title', { trip: '' }) };
}

export default async function LocalizedTripBookingPage({ params }: TripBookingRouteProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [trip, messages] = await Promise.all([getTripDetail(slug).catch(() => null), getMessages()]);
  if (!trip) notFound();

  const enquiryHref = `/${locale}/contact?type=trip&trip=${encodeURIComponent(trip.slug)}`;
  if (!trip.booking.startBookingAllowed || trip.pricingMode === 'enquiry') redirect(enquiryHref);

  const journeyConfig = await getTripJourneyConfig(trip.slug).catch(() => null);
  if (!journeyConfig || !journeyConfig.startBookingAllowed) redirect(enquiryHref);

  return <TripBookingPage trip={trip} journeyConfig={journeyConfig} content={messages.TripBooking as unknown as TripBookingContent} bookingContent={messages.Booking as unknown as BookingContent} locale={locale} />;
}
