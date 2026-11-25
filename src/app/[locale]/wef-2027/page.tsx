import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { WefPage } from '@/components/wef/WefPage';
import type { WefContent } from '@/content/wef';
import { getVehicles } from '@/lib/fleet';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

type WefPageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: WefPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Wef.metadata' });

  return { title: { absolute: t('title') }, description: t('description') };
}

export default async function LocalizedWefPage({ params }: WefPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [messages, publicConfig, vehicles] = await Promise.all([
    getMessages(),
    getPublicConfig().catch(() => fallbackPublicConfig()),
    getVehicles().then((items) => items.slice(0, 4)).catch(() => []),
  ]);
  const content = messages.Wef as unknown as WefContent;

  return <WefPage content={content} publicConfig={publicConfig} vehicles={vehicles} />;
}

