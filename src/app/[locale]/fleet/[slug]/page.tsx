import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { VehicleDetailPage } from '@/components/fleet/VehicleDetailPage';
import type { FleetContent } from '@/content/fleet';
import { getVehicle } from '@/lib/fleet';

type VehicleDetailRouteProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: VehicleDetailRouteProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [vehicle, t] = await Promise.all([
    getVehicle(slug),
    getTranslations({ locale, namespace: 'Fleet.detail.metadata' }),
  ]);

  return vehicle
    ? { title: vehicle.name, description: vehicle.description ?? undefined }
    : { title: t('notFound') };
}

export default async function LocalizedVehicleDetailPage({ params }: VehicleDetailRouteProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [vehicle, messages] = await Promise.all([getVehicle(slug), getMessages()]);
  if (!vehicle) notFound();

  return <VehicleDetailPage vehicle={vehicle} content={messages.Fleet as unknown as FleetContent} locale={locale} />;
}
