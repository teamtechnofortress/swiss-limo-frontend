import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Plane, UserRound, Luggage } from 'lucide-react';
import { ButtonLink, Card, Container, Eyebrow, GoldRule, Section, SectionHeading } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Airport transfers',
  description: 'Private airport transfers from Zurich, Geneva and Basel. Share your flight number and your chauffeur plans the pickup.',
};

const AIRPORTS = [
  { name: 'Zurich Airport', code: 'ZRH', query: 'Zurich Airport', note: 'Switzerland’s main international gateway.' },
  { name: 'Geneva Airport', code: 'GVA', query: 'Geneva Airport', note: 'Serving Geneva and the Lake Geneva region.' },
  { name: 'Basel EuroAirport', code: 'BSL', query: 'EuroAirport Basel', note: 'Serving Basel, France and Germany.' },
];

const STEPS = [
  { icon: Plane, title: 'Share your flight', text: 'Add your flight number when you book, so your chauffeur can plan the pickup around your arrival.' },
  { icon: UserRound, title: 'Your chauffeur meets you', text: 'Your chauffeur is ready at the arrivals area with your name, and takes care of your luggage.' },
  { icon: Luggage, title: 'Straight to your destination', text: 'A direct, private journey to your hotel, your office or your home, in the vehicle you chose.' },
];

export default function AirportTransfersPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-20 md:pt-28">
        <div className="absolute inset-0 bg-hero-glow" aria-hidden="true" />
        <Container className="relative">
          <Eyebrow className="mb-6">Airport transfers</Eyebrow>
          <h1 className="max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            Your journey begins <span className="italic text-gold-gradient">the moment you land</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-mute">
            Private transfers to and from Switzerland’s main airports. Fixed, transparent pricing and a chauffeur who knows
            the way.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {AIRPORTS.map((airport) => (
              <Card key={airport.code} className="flex flex-col p-10">
                <p className="font-serif text-lg tracking-[0.3em] text-gold">{airport.code}</p>
                <h2 className="mt-4 text-3xl">{airport.name}</h2>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-mute">{airport.note}</p>
                <GoldRule className="my-8" />
                <div className="flex flex-col gap-3">
                  <ButtonLink href={`/book?from=${encodeURIComponent(airport.query)}`} className="w-full">
                    From {airport.code}
                  </ButtonLink>
                  <ButtonLink href={`/book?to=${encodeURIComponent(airport.query)}`} variant="outline" className="w-full">
                    To {airport.code}
                  </ButtonLink>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-t hairline bg-ink-soft/40">
        <Container>
          <SectionHeading eyebrow="What to expect" title="Calm from the moment you land" />
          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon size={18} />
                </div>
                <h3 className="mt-6 text-2xl">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-mute">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 flex flex-wrap items-center gap-6">
            <ButtonLink href="/book">Book your transfer</ButtonLink>
            <Link href="/fleet" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-ivory/70 hover:text-gold">
              View the fleet <ArrowRight size={14} />
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
