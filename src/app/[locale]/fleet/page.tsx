import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { FleetPage } from '@/components/fleet/FleetPage';
import type { FleetContent } from '@/content/fleet';
import { getVehicles } from '@/lib/fleet';

const CATEGORIES = ['executive', 'first_class', 'van'] as const;

type FleetRouteProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: FleetRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Fleet.metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocalizedFleetPage({ params, searchParams }: FleetRouteProps) {
  const [{ locale }, { category }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  const active = CATEGORIES.find((item) => item === category) ?? '';
  const [messages, vehicles] = await Promise.all([
    getMessages(),
    getVehicles(active || undefined),
  ]);
  const content = messages.Fleet as unknown as FleetContent;

  return <FleetPage content={content} locale={locale} active={active} vehicles={vehicles} />;
}
