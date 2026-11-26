import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { PriceEstimatePage } from '@/components/estimate/PriceEstimatePage';
import type { PriceEstimateContent } from '@/content/price-estimate';

type PriceEstimateRouteProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PriceEstimateRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PriceEstimate.metadata' });
  return { title: { absolute: t('title') }, description: t('description') };
}

export default async function LocalizedPriceEstimatePage({ params }: PriceEstimateRouteProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return <PriceEstimatePage content={messages.PriceEstimate as unknown as PriceEstimateContent} locale={locale} />;
}
