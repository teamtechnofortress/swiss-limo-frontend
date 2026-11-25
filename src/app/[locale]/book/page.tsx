import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { BookingPage } from '@/components/booking/BookingPage';
import type { BookingContent } from '@/content/booking';

type BookingRouteProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ params }: BookingRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Booking.metadata' });
  return { title: t('title'), description: t('description') };
}

export default async function LocalizedBookPage({ params, searchParams }: BookingRouteProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const messages = await getMessages();

  return <BookingPage content={messages.Booking as unknown as BookingContent} locale={locale} searchParams={query} />;
}
