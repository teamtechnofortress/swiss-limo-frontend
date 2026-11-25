import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactPage } from '@/components/contact/ContactPage';
import type { ContactContent } from '@/content/contact';
import { getVehicle } from '@/lib/fleet';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';
import { getTripDetail } from '@/lib/trips';

type ContactRouteProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ trip?: string; vehicle?: string }>;
};

export async function generateMetadata({ params }: ContactRouteProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact.metadata' });
  return { title: t('title'), description: t('description') };
}

export default async function LocalizedContactPage({ params, searchParams }: ContactRouteProps) {
  const [{ locale }, { trip: tripSlug, vehicle: vehicleSlug }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  const [messages, trip, vehicle, publicConfig] = await Promise.all([
    getMessages(),
    tripSlug && tripSlug !== 'custom' ? getTripDetail(tripSlug).catch(() => null) : null,
    vehicleSlug ? getVehicle(vehicleSlug).catch(() => null) : null,
    getPublicConfig().catch(() => fallbackPublicConfig()),
  ]);

  return (
    <ContactPage
      content={messages.Contact as unknown as ContactContent}
      publicConfig={publicConfig}
      trip={trip}
      vehicle={vehicle}
      customTrip={tripSlug === 'custom'}
    />
  );
}
