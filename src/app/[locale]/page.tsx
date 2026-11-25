import type { Metadata } from 'next';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import {
  BenefitsSection,
  FleetSection,
  HomeFaqSection,
  QuoteSection,
  ServicesSection,
} from '@/components/home/HomeSections';
import { TripCarousel } from '@/components/home/TripCarousel';
import type { HomeContent } from '@/content/home';
import { getVehicles } from '@/lib/fleet';
import { getFeaturedTrips } from '@/lib/trips';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

type HomePageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home.metadata' });

  return {
    title: { absolute: t('title') },
    description: t('description'),
  };
}

function whatsappLink(phone: string | null | undefined) {
  const digits = (phone ?? '').replace(/\D/g, '').replace(/^00/, '');
  return digits.length >= 7 ? `https://wa.me/${digits}` : null;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [messages, vehicles, featuredTrips, publicConfig] = await Promise.all([
    getMessages(),
    getVehicles().then((items) => items.slice(0, 3)),
    getFeaturedTrips().catch(() => []),
    getPublicConfig().catch(() => fallbackPublicConfig()),
  ]);
  const content = messages.Home as unknown as HomeContent;
  const whatsappUrl = whatsappLink(publicConfig.site.contact.phone);

  return (
    <>
      <Hero content={content.hero} />
      <ServicesSection content={content.services} />
      {featuredTrips.length > 0 && <TripCarousel trips={featuredTrips} content={content.trips} listingHref={`/${locale}/trips`} />}
      <FleetSection content={content.fleet} vehicleCopy={content.vehicleCard} vehicles={vehicles} />
      <BenefitsSection content={content.benefits} />
      <QuoteSection content={content.quote} whatsappUrl={whatsappUrl} />
      <HomeFaqSection content={content.faqs} />
    </>
  );
}
