import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { AirportTransfersPage } from '@/components/airport/AirportTransfersPage';
import type { AirportContent } from '@/content/airport';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Airport.metadata' });

  return { title: { absolute: t('title') }, description: t('description') };
}

export default async function LocalizedAirportTransfersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = await getMessages();
  return <AirportTransfersPage content={messages.Airport as unknown as AirportContent} locale={locale} />;
}
