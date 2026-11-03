import { CalendarDays, CreditCard, MapPin, Plane, ShieldCheck, Clock, Receipt } from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { VehicleCard } from '@/components/fleet/VehicleCard';
import { ButtonLink, Card, Container, Eyebrow, GoldRule, Section, SectionHeading } from '@/components/ui/primitives';
import { TripCard } from '@/components/trips/TripCard';
import { getVehicles } from '@/lib/fleet';
import { getTrips } from '@/lib/trips';

const TRUST = [
  { icon: Receipt, title: 'Transparent pricing', text: 'A clear rate per kilometre, with VAT shown on every quote. No surprises at the end of the journey.' },
  { icon: ShieldCheck, title: 'Secure online payment', text: 'Pay by card or Apple Pay in a secure checkout, or choose to pay your chauffeur in cash on arrival.' },
  { icon: Clock, title: 'Punctual and discreet', text: 'Professional chauffeurs who plan every journey around your time, your luggage and your comfort.' },
];

const STEPS = [
  { n: '01', title: 'Choose your journey', text: 'Enter pickup, destination, date and time. Add a return if you need one.' },
  { n: '02', title: 'Select your vehicle', text: 'Compare the cars available for your party and see the full price instantly.' },
  { n: '03', title: 'Confirm and ride', text: 'Pay securely, receive your confirmation, and your chauffeur is ready for you.' },
];

export default async function HomePage() {
  const [vehicles, trips] = await Promise.all([
    getVehicles().then((items) => items.slice(0, 3)),
    getTrips({ featured: true, perPage: 3 }).catch(() => null),
  ]);

  return (
    <>
      <Hero />

      <section className="relative overflow-hidden border-y border-gold/25 bg-[#f8f3e9] py-20 text-ink md:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" aria-hidden="true" />
        <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border border-gold/15" aria-hidden="true" />
        <div className="absolute -right-24 top-16 h-56 w-56 rounded-full border border-gold/15" aria-hidden="true" />

        <Container className="relative">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-gold-deep">The Swiss standard</p>
            <h2 className="mt-5 text-4xl leading-tight text-ink md:text-5xl">Every detail, quietly taken care of</h2>
            <div className="mx-auto mt-8 flex items-center justify-center gap-3" aria-hidden="true">
              <span className="h-px w-12 bg-gold-deep/50" />
              <span className="text-lg text-gold-deep">✦</span>
              <span className="h-px w-12 bg-gold-deep/50" />
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-ink/65 md:text-lg">
              More than a transfer: a considered service designed to make every mile feel effortless.
            </p>
          </header>

          <div className="mt-12 grid gap-5 md:gap-6 md:grid-cols-3">
            {TRUST.map(({ icon: Icon, title, text }, index) => (
              <article
                key={title}
                className="group relative flex min-h-[252px] flex-col rounded-2xl border border-gold/25 bg-white p-7 shadow-[0_12px_34px_rgba(59,41,15,0.08)] transition duration-500 hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_20px_44px_rgba(59,41,15,0.14)] md:p-8"
              >
                <span className="absolute right-7 top-7 font-serif text-5xl leading-none text-gold/15 md:right-8 md:top-8">0{index + 1}</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-deep bg-gold-deep text-ivory shadow-[0_6px_14px_rgba(91,62,22,0.2)]">
                  <Icon size={21} strokeWidth={1.5} />
                </div>
                <h3 className="mt-7 max-w-[15rem] text-3xl leading-tight text-ink">{title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/65">{text}</p>
                <div className="mt-auto flex items-center gap-3 border-t border-gold/20 pt-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-deep">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-deep" /> Always included
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="The fleet" title="Chosen for every kind of journey" subtitle="From a single executive traveller to a party of seven, there is a vehicle made for it." />
            <ButtonLink href="/fleet" variant="outline">View full fleet</ButtonLink>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        </Container>
      </Section>

      <section className="relative overflow-hidden border-y hairline bg-ink-soft/40 py-24 md:py-32">
        <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden="true" />
        <Container className="relative grid items-center gap-16 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-5">Airport transfers</Eyebrow>
            <h2 className="text-4xl leading-tight md:text-5xl">
              From the runway to your door, <span className="italic text-gold-gradient">without the queue</span>
            </h2>
            <GoldRule className="mt-8" />
            <p className="mt-8 max-w-lg leading-relaxed text-mute">
              Zurich, Geneva and Basel airports. Share your flight number and your chauffeur plans the pickup around
              your arrival.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/airport-transfers">Airport transfers</ButtonLink>
              <ButtonLink href="/book?from=Zurich%20Airport" variant="outline">Book from Zurich Airport</ButtonLink>
            </div>
          </div>
          <div className="grid gap-5">
            {[
              { icon: Plane, name: 'Zurich Airport', code: 'ZRH' },
              { icon: MapPin, name: 'Geneva Airport', code: 'GVA' },
              { icon: MapPin, name: 'Basel EuroAirport', code: 'BSL' },
            ].map(({ icon: Icon, name, code }) => (
              <Card key={code} className="flex items-center justify-between p-7">
                <div className="flex items-center gap-4">
                  <Icon className="text-gold" size={20} />
                  <span className="font-serif text-2xl">{name}</span>
                </div>
                <span className="font-serif text-lg tracking-[0.3em] text-gold">{code}</span>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="Private trips" title="Switzerland, at your own pace" subtitle="Lakes, peaks and old towns, with a chauffeur who knows the roads and waits while you explore." />
            <ButtonLink href="/trips" variant="outline">All trips</ButtonLink>
          </div>
          {trips && trips.data.length > 0 ? (
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {trips.data.map((trip) => <TripCard key={trip.slug} trip={trip} />)}
            </div>
          ) : (
            <p className="mt-12 text-mute">Our featured trips will be available shortly.</p>
          )}
        </Container>
      </Section>

      <Section className="bg-ink-soft/40">
        <Container>
          <SectionHeading eyebrow="How it works" title="Three steps to your journey" align="center" />
          <div className="mt-20 grid gap-12 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="text-center">
                <p className="font-serif text-6xl text-gold-gradient">{step.n}</p>
                <h3 className="mt-6 text-2xl">{step.title}</h3>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-mute">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 flex justify-center gap-6 text-xs uppercase tracking-[0.25em] text-mute">
            <span className="inline-flex items-center gap-2"><CalendarDays size={14} className="text-gold" />Book ahead</span>
            <span className="inline-flex items-center gap-2"><CreditCard size={14} className="text-gold" />Pay securely</span>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/25 bg-ink-soft px-8 py-20 text-center md:px-20">
            <div className="absolute inset-0 bg-hero-glow" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl">Your next journey starts here</h2>
              <p className="mx-auto mt-6 max-w-xl text-mute">Check availability and see your price in under a minute.</p>
              <div className="mt-12">
                <ButtonLink href="/book">Plan a journey</ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
