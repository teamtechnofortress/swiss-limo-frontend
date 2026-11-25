import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { TripDetailPage } from '@/components/trips/TripDetailPage';
import type { TripDetailContent } from '@/content/trip-detail';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';
import { getTripDetail } from '@/lib/trips';
import '../../../trips/[slug]/tour-detail.css';

type TripDetailRouteProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: TripDetailRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [trip, messages] = await Promise.all([getTripDetail(slug).catch(() => null), getMessages()]);
  const content = messages.TripDetail as unknown as TripDetailContent;
  return trip ? { title: trip.title, description: trip.summary } : { title: content.metadata.notFound };
}

export default async function LocalizedTripDetailPage({ params }: TripDetailRouteProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [trip, messages, publicConfig] = await Promise.all([
    getTripDetail(slug).catch(() => null),
    getMessages(),
    getPublicConfig().catch(() => fallbackPublicConfig()),
  ]);
  if (!trip) notFound();

  return <TripDetailPage trip={trip} content={messages.TripDetail as unknown as TripDetailContent} locale={locale} publicConfig={publicConfig} />;
}
