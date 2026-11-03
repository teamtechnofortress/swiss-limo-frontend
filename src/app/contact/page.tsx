import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Card, Container, Eyebrow, GoldRule, Section } from '@/components/ui/primitives';
import { getTripDetail } from '@/lib/trips';
import { getVehicle } from '@/lib/fleet';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact our team for enquiries, custom tours and bespoke journeys.',
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ trip?: string; vehicle?: string }>;
}) {
  const { trip: tripSlug, vehicle: vehicleSlug } = await searchParams;

  const [trip, vehicle, publicConfig] = await Promise.all([
    tripSlug && tripSlug !== 'custom' ? getTripDetail(tripSlug).catch(() => null) : null,
    vehicleSlug ? getVehicle(vehicleSlug) : null,
    getPublicConfig().catch(() => fallbackPublicConfig()),
  ]);

  const subject = trip
    ? `Enquiry: ${trip.title}`
    : vehicle
      ? `Price request: ${vehicle.name}`
      : tripSlug === 'custom'
        ? 'Custom trip enquiry'
        : 'Enquiry';

  const { email, phone, address } = publicConfig.site.contact;
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : null;

  return (
    <Section className="pt-20 md:pt-28">
      <Container className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Eyebrow className="mb-6">Contact</Eyebrow>
          <h1 className="text-5xl leading-tight md:text-7xl">We would love to hear from you</h1>
          <GoldRule className="my-10" />
          <p className="max-w-md leading-relaxed text-mute">
            For custom journeys, group travel, corporate accounts or any question about your booking, write to us or
            call.
          </p>

          <ul className="mt-12 space-y-6">
            {email && (
              <li className="flex items-center gap-4">
                <Mail className="text-gold" size={18} />
                <a href={mailto ?? undefined} className="text-lg hover:text-gold">{email}</a>
              </li>
            )}
            {phone && (
              <li className="flex items-center gap-4">
                <Phone className="text-gold" size={18} />
                <span className="text-lg">{phone}</span>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-4">
                <MapPin className="mt-1 shrink-0 text-gold" size={18} />
                <span className="text-lg leading-relaxed">{address}</span>
              </li>
            )}
          </ul>
        </div>

        <Card className="p-10 lg:col-span-6">
          <p className="font-serif text-3xl">{subject}</p>
          <p className="mt-5 text-sm leading-relaxed text-mute">
            Write to us with your preferred dates, the number of passengers and anything else we should know. We reply
            within one working day.
          </p>
          {mailto ? (
            <a
              href={mailto}
              className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-medium tracking-wide text-ink transition hover:-translate-y-0.5 hover:shadow-gold"
            >
              Write an email
            </a>
          ) : (
            <p className="mt-10 text-sm text-mute">Our contact details will be available shortly.</p>
          )}
        </Card>
      </Container>
    </Section>
  );
}
