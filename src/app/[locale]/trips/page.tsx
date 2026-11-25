import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { TripsPage } from '@/components/trips/TripsPage';
import type { TripsContent } from '@/content/trips';
import { getTrips } from '@/lib/trips';

type TripsRouteProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

function pageFromSearchParam(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ params }: TripsRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Trips.metadata' });

  return { title: t('title'), description: t('description') };
}

export default async function LocalizedTripsPage({ params, searchParams }: TripsRouteProps) {
  const [{ locale }, { page: requestedPage }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  const [messages, trips] = await Promise.all([
    getMessages(),
    getTrips({ page: pageFromSearchParam(requestedPage), perPage: 24 }).catch(() => null),
  ]);
  const content = messages.Trips as unknown as TripsContent;

  return <TripsPage content={content} locale={locale} trips={trips} />;
}
