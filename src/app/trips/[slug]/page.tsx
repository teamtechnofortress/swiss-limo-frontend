import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Globe2, Headphones, HelpCircle, Images, MapPin, Minus, Mountain, Plus, Route } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { TripPhotoGallery } from '@/components/trips/TripPhotoGallery';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';
import { money } from '@/lib/format';
import { tripContentSections } from '@/lib/trip-content';
import { getTripDetail, type TripBookingBlockedReason } from '@/lib/trips';
import './tour-detail.css';

type Params = Promise<{ slug: string }>;

function durationLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours === 0 ? `${remaining} min` : `${hours} ${hours === 1 ? 'hour' : 'hours'}${remaining ? ` ${remaining} min` : ''}`;
}

const bookingBlockedMessages: Record<TripBookingBlockedReason, string> = {
  enquiry_only: 'This experience is arranged personally by our team.',
  pickup_configuration_required: 'Our team can help arrange your pickup and this experience.',
  destination_configuration_required: 'Our team can help arrange this experience.',
  fixed_pricing_configuration_required: 'Contact our team for a tailored proposal.',
};

function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <h2 className="mb-4 flex items-center gap-3 font-sans text-xl font-bold tracking-tight text-[#0d1b2a] sm:text-2xl"><span className="shrink-0 text-[#bf8b16]">{icon}</span>{children}</h2>;
}

function ContentHtml({ html, className = '' }: { html: string; className?: string }) {
  return <div className={`tour-cms ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const trip = await getTripDetail(slug);
    return trip ? { title: trip.title, description: trip.summary } : { title: 'Trip not found' };
  } catch {
    return { title: 'Private trips' };
  }
}

export default async function TripPage({ params }: { params: Params }) {
  const { slug } = await params;
  const trip = await getTripDetail(slug).catch(() => null);
  if (!trip) notFound();
  const publicConfig = await getPublicConfig().catch(() => fallbackPublicConfig());
  const content = tripContentSections(trip.descriptionHtml);
  const canBook = trip.booking.startBookingAllowed && trip.pricingMode !== 'enquiry';
  const enquiryHref = `/contact?type=trip&trip=${encodeURIComponent(trip.slug)}`;
  const bookingHref = `/trips/${encodeURIComponent(trip.slug)}/book`;
  const primaryHref = canBook ? bookingHref : enquiryHref;
  const primaryText = canBook ? 'Book this tour' : 'Enquire about this tour';
  const startingPrice = trip.pricingMode === 'fixed' ? trip.booking.startingFromPriceMinor : null;
  const pickups = trip.booking.pickupLocationsOnly ? trip.booking.departureLocations : [];
  const durations = [...new Set(pickups.map(location => location.durationMinutes))].sort((a, b) => a - b);
  const duration = durations.length === 0 ? 'Confirmed with your route'
    : durations.length === 1 ? durationLabel(durations[0])
    : `${durationLabel(durations[0])} – ${durationLabel(durations[durations.length - 1])}`;
  const pickupLabel = pickups.length === 1 ? pickups[0].name : pickups.length > 1 ? `${pickups.length} pickup locations` : 'Choose your pickup';
  const photos = [
    ...(trip.coverUrl ? [{ id: 'cover', url: trip.coverUrl }] : []),
    ...trip.gallery.map(photo => ({ id: String(photo.id), url: photo.url })),
  ].filter((photo, index, all) => all.findIndex(other => other.url === photo.url) === index);
  const phone = publicConfig.site.contact.phone;
  const whatsappNumber = phone?.replace(/[^0-9]/g, '');

  return (
    <div className="tour-reference-page bg-[#faf8f4] text-[#0d1b2a]">
      <section className="relative isolate overflow-hidden bg-[#052940] text-white">
        {/* Reserved for a future tour hero image. Existing CMS photos stay in the gallery. */}
        <div data-trip-hero-image-slot aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] items-center justify-center bg-gradient-to-l from-[#174963] via-[#0d354e] to-transparent lg:flex">
          <Mountain strokeWidth={0.6} className="h-64 w-80 text-white/10" />
        </div>
        <Container className="relative pb-16 pt-5 sm:pb-20 lg:pt-6">
          <div className="max-w-2xl lg:max-w-[60%]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f1c75b]">Private tour{trip.region ? ` · ${trip.region}` : ''}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-[52px]">{trip.title}</h1>
            {trip.subtitle && <p className="mt-3 font-serif text-2xl italic leading-tight text-[#f1c75b] sm:text-3xl">{trip.subtitle}</p>}
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90">{trip.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={primaryHref} className="!rounded-xl !font-bold">{primaryText}<ArrowRight size={18} /></ButtonLink>
              <a href="#tour-overview" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/50 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">Explore the tour <ArrowRight size={16} /></a>
            </div>
          </div>
        </Container>
      </section>

      <Container className="relative z-10 -mt-7">
        <section aria-label="Tour at a glance" className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/40 bg-[#062b43] px-2 py-3 text-white shadow-lg md:grid-cols-4">
          {[
            { icon: <Clock3 />, label: 'Duration', value: duration },
            { icon: <MapPin />, label: 'Pickup / Return', value: pickupLabel },
            { icon: <Route />, label: 'Stops', value: content.stopCount ? `${content.stopCount} destinations` : 'Personalised itinerary' },
            { icon: <Globe2 />, label: 'Countries', value: content.countryCount ? `${content.countryCount} ${content.countryCount === 1 ? 'country' : 'countries'}` : trip.region },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex min-w-0 items-center gap-3 px-3 py-2 md:border-r md:border-white/20 md:last:border-r-0 lg:px-5">
              <span className="hidden shrink-0 text-[#f1c75b] sm:block">{icon}</span>
              <div className="min-w-0"><p className="text-[11px] text-white/75">{label}</p><p className="mt-0.5 text-xs font-bold leading-snug sm:text-sm">{value || 'Private experience'}</p></div>
            </div>
          ))}
        </section>
      </Container>

      <Container className="pb-14 pt-8">
        <div className="grid min-w-0 items-start gap-7 lg:grid-cols-[minmax(0,2.25fr)_minmax(280px,1fr)]">
          <article className="min-w-0 space-y-7">
            <section id="tour-overview" className="scroll-mt-28">
              <SectionTitle icon={<Mountain size={25} />}>Tour Overview</SectionTitle>
              {content.overview ? <ContentHtml html={content.overview} /> : <p className="text-sm leading-relaxed text-slate-700">{trip.summary}</p>}
            </section>

            {content.countries && <section><SectionTitle icon={<Globe2 size={25} />}>Countries Covered</SectionTitle><ContentHtml html={content.countries} /></section>}

            {content.stops && <section><SectionTitle icon={<MapPin size={25} />}>{content.stopCount ? `The ${content.stopCount} Incredible Stops` : 'The Incredible Stops'}</SectionTitle><ContentHtml html={content.stops} /></section>}

            {photos.length > 0 && <section id="tour-gallery" className="scroll-mt-28"><SectionTitle icon={<Images size={25} />}>Tour Gallery</SectionTitle><TripPhotoGallery photos={photos} title={trip.title} /></section>}

            <div className="grid items-start gap-6 xl:grid-cols-2">
              {content.itinerary && <section className="min-w-0"><SectionTitle icon={<CalendarDays size={25} />}>Your Tour Itinerary</SectionTitle><ContentHtml html={content.itinerary} /></section>}
              {content.inclusions && <section className="min-w-0 rounded-2xl border border-[#e8e1d5] bg-white p-4 shadow-sm sm:p-5"><SectionTitle icon={<CheckCircle2 size={23} />}>Good to know</SectionTitle><ContentHtml html={content.inclusions} /></section>}
            </div>
            {content.fallback && <ContentHtml html={content.fallback} className="tour-legacy-copy" />}
          </article>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-24">
            <section className="overflow-hidden rounded-2xl border border-[#e5ded1] bg-white shadow-[0_8px_24px_-12px_rgba(8,42,72,0.3)]">
              <h2 className="flex items-center justify-center gap-3 bg-[#052940] px-4 py-4 font-sans text-xl font-bold text-[#f1c75b]"><CalendarDays size={25} />Book This Tour</h2>
              {trip.coverUrl && <img src={trip.coverUrl} alt={trip.title} className="h-32 w-full object-cover" />}
              <div className="p-5">
                <p className="text-center text-xs font-bold uppercase tracking-wider">Private tour{durations.length === 1 ? ` · ${duration}` : ''}</p>
                {startingPrice !== null ? <div className="mt-3 text-center"><p className="text-[11px] uppercase tracking-wider text-slate-500">Starting from</p><p className="mt-1 font-sans text-4xl font-bold tracking-tight text-[#9b7012]">{money(startingPrice)}</p><p className="mt-2 text-xs leading-relaxed text-slate-600">Final price depends on pickup, date and vehicle.</p></div>
                  : <div className="mt-3 text-center"><p className="text-2xl font-bold text-[#9b7012]">{trip.pricingMode === 'distance' ? 'Live route pricing' : 'Price on request'}</p><p className="mt-2 text-xs leading-relaxed text-slate-600">{trip.pricingMode === 'distance' ? 'Get a quote for your route, date and vehicle.' : 'Let us prepare a tailored proposal for your trip.'}</p></div>}
                <dl className="my-5 divide-y divide-gray-100 border-y border-gray-100 text-xs">
                  {[
                    { icon: <MapPin size={18} />, label: 'Pickup / Return', value: pickupLabel },
                    { icon: <Clock3 size={18} />, label: 'Duration', value: duration },
                    ...(content.stopCount ? [{ icon: <Route size={18} />, label: 'Stops', value: `${content.stopCount} destinations` }] : []),
                    ...(content.countryCount ? [{ icon: <Globe2 size={18} />, label: 'Countries', value: `${content.countryCount} countries` }] : []),
                  ].map(({ icon, label, value }) => <div key={label} className="flex items-start justify-between gap-3 py-3"><dt className="flex shrink-0 items-center gap-2"><span className="text-[#bf8b16]">{icon}</span>{label}</dt><dd className="text-right font-bold">{value}</dd></div>)}
                </dl>
                {!canBook && trip.booking.reason && <p className="mb-4 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">{bookingBlockedMessages[trip.booking.reason]}</p>}
                {canBook && <ButtonLink href={bookingHref} className="w-full !rounded-xl !px-3 !font-bold">Book this tour<ArrowRight size={17} /></ButtonLink>}
                <ButtonLink href={enquiryHref} className={`w-full !rounded-xl !px-3 !font-bold ${canBook ? 'mt-3 !border !border-gray-300 !bg-white !text-[#0d1b2a] hover:!bg-slate-50' : ''}`}>Enquire now<ArrowRight size={17} /></ButtonLink>
               {/**   {whatsappNumber && <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 py-3 text-sm font-bold text-[#0d1b2a] transition hover:bg-slate-50">Chat on WhatsApp <ArrowRight size={16} /></a>} */}
                <div className="mt-5 flex gap-3 border-t border-gray-100 pt-5"><Headphones size={28} className="shrink-0 text-[#bf8b16]" /><div><h3 className="font-sans text-sm font-bold">Need Help?</h3><p className="mt-1 text-xs leading-relaxed text-slate-600">Our team is here to assist you.</p>{phone ? <a href={`tel:${phone.replace(/[^+0-9]/g, '')}`} className="mt-2 inline-block text-sm font-bold">{phone}</a> : <Link href={enquiryHref} className="mt-2 inline-block text-sm font-bold underline underline-offset-4">Contact our team</Link>}</div></div>
              </div>
            </section>
            {pickups.length > 1 && <section className="rounded-2xl border border-[#e5ded1] bg-white p-5"><h2 className="font-sans text-sm font-bold">Available pickup locations</h2><ul className="mt-3 divide-y divide-gray-100">{pickups.map(location => <li key={location.id} className="py-3"><p className="text-sm font-bold">{location.name}</p><p className="mt-1 text-xs leading-relaxed text-slate-600">{location.address}</p><p className="mt-1 text-xs text-slate-600">{durationLabel(location.durationMinutes)}{location.startingFromPriceMinor !== null ? ` · From ${money(location.startingFromPriceMinor)}` : ''}</p></li>)}</ul></section>}
            {trip.faqs.length > 0 && (
              <section aria-labelledby="tour-faq-heading">
                <h2 id="tour-faq-heading" className="mb-3 flex items-center gap-2 font-sans text-base font-bold text-[#0d1b2a]">
                  <HelpCircle size={23} className="shrink-0 text-[#bf8b16]" aria-hidden="true" />Frequently Asked Questions
                </h2>
                <div className="space-y-2">
                  {trip.faqs.map(faq => (
                    <details key={faq.id} className="group overflow-hidden rounded-xl border border-[#e5ded1] bg-white shadow-sm open:border-[#d4b568]">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-xs font-bold leading-relaxed text-[#0d1b2a] transition hover:bg-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#986b00] [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0 break-words">{faq.question}</span>
                        <Plus size={18} className="shrink-0 text-[#bf8b16] group-open:hidden" aria-hidden="true" />
                        <Minus size={18} className="hidden shrink-0 text-[#bf8b16] group-open:block" aria-hidden="true" />
                      </summary>
                      <p className="whitespace-pre-line break-words border-t border-[#eee7da] bg-[#fffcf5] px-3 py-3 text-xs leading-relaxed text-slate-700">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}
