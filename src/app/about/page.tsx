import type { Metadata } from 'next';
import { ButtonLink, Container, Eyebrow, GoldRule, Section } from '@/components/ui/primitives';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

export async function generateMetadata(): Promise<Metadata> {
  const publicConfig = await getPublicConfig().catch(() => fallbackPublicConfig());

  return {
    title: 'About us',
    description: `About ${publicConfig.site.name}, a private chauffeur service in Switzerland.`,
  };
}

export default async function AboutPage() {
  const publicConfig = await getPublicConfig().catch(() => fallbackPublicConfig());

  return (
    <Section className="pt-20 md:pt-28">
      <Container className="max-w-4xl">
        <Eyebrow className="mb-6">About us</Eyebrow>
        <h1 className="text-5xl leading-tight md:text-7xl">
          Discreet service, <span className="italic text-gold-gradient">precisely delivered</span>
        </h1>
        <GoldRule className="my-12" />

        <div className="space-y-8 text-lg leading-relaxed text-mute">
          <p>
            {publicConfig.site.name} provides private chauffeur transfers, airport journeys and tours across Switzerland. We
            believe travel should feel calm from the first moment to the last.
          </p>
          <p>
            Our chauffeurs are professionals who plan every journey carefully: route, timing, luggage and the small
            details that make a trip feel effortless. Our vehicles are kept immaculate and chosen to suit every kind of
            traveller.
          </p>
          <p>
            Prices are shown clearly before you book, per kilometre with a minimum fare, including VAT where it applies.
            Pay securely online, or choose to pay your chauffeur in cash on arrival.
          </p>
        </div>

        <div className="mt-16">
          <ButtonLink href="/fleet">Explore the fleet</ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
