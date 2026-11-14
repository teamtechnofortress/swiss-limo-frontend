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
  return <h2 className="mb-5 flex items-center gap-3 font-serif text-3xl font-semibold leading-none tracking-[-0.015em] text-[#0d1b2a] sm:text-[32px]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1c75b]/20 text-[#9b7012]">{icon}</span>{children}</h2>;
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
  const heroImageUrl = trip.heroImageUrl;
  const photos = [
    ...(trip.coverUrl ? [{ id: 'cover', url: trip.coverUrl }] : []),
    ...trip.gallery.map(photo => ({ id: String(photo.id), url: photo.url })),
  ].filter((photo, index, all) => all.findIndex(other => other.url === photo.url) === index);
  const phone = publicConfig.site.contact.phone;
  const whatsappNumber = phone?.replace(/[^0-9]/g, '');

  return (
    <div className="tour-reference-page bg-[#f8f3e9] text-[#0d1b2a]">
      <section className="relative isolate overflow-hidden bg-[#0d1b2a] text-white">
        {heroImageUrl ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <img src={heroImageUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,42,0.98)_0%,rgba(13,27,42,0.91)_43%,rgba(13,27,42,0.46)_72%,rgba(13,27,42,0.16)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d1b2a]/75 to-transparent" />
          </div>
        ) : (
          <div data-trip-hero-image-slot aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] items-center justify-center bg-gradient-to-l from-[#0d1b2a] via-[#0d1b2a]/80 to-transparent lg:flex">
            <Mountain strokeWidth={0.6} className="h-64 w-80 text-[#f1c75b]/10" />
          </div>
        )}
        <Container className="relative py-12 sm:py-14 lg:py-16">
          <div className="max-w-2xl lg:max-w-[60%]">
            <div className="flex items-center gap-3"><span className="h-[3px] w-8 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f1c75b]">Private journey{trip.region ? ` · ${trip.region}` : ''}</p></div>
            <h1 className="mt-4 text-4xl font-semibold leading-[0.96] tracking-[-0.025em] sm:text-5xl lg:text-6xl">{trip.title}</h1>
            {trip.subtitle && <p className="mt-3 font-serif text-xl italic leading-tight text-[#f1c75b] sm:text-2xl">{trip.subtitle}</p>}
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{trip.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={primaryHref} className="!px-5 !py-2.5 !text-[12px] !font-bold">{primaryText}<ArrowRight size={16} /></ButtonLink>
              <a href="#tour-overview" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-5 py-2.5 text-[12px] font-bold text-white transition hover:border-white hover:bg-white/10">Explore the journey <ArrowRight size={15} /></a>
            </div>
          </div>
        </Container>
      </section>

      <Container className="relative z-10 -mt-4 sm:-mt-5">
        <section aria-label="Tour at a glance" className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/20 bg-[#0d1b2a] px-2 py-3 text-white shadow-[0_16px_34px_-22px_rgba(13,27,42,0.65)] md:grid-cols-4">
          {[
            { icon: <Clock3 />, label: 'Duration', value: duration },
            { icon: <MapPin />, label: 'Pickup / Return', value: pickupLabel },
            { icon: <Route />, label: 'Stops', value: content.stopCount ? `${content.stopCount} destinations` : 'Personalised itinerary' },
            { icon: <Globe2 />, label: 'Countries', value: content.countryCount ? `${content.countryCount} ${content.countryCount === 1 ? 'country' : 'countries'}` : trip.region },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex min-w-0 items-center gap-3 px-3 py-2 md:border-r md:border-white/15 md:last:border-r-0 lg:px-5">
              <span className="hidden shrink-0 text-[#f1c75b] sm:block">{icon}</span>
              <div className="min-w-0"><p className="text-[10px] uppercase tracking-[0.12em] text-white/60">{label}</p><p className="mt-1 text-xs font-bold leading-snug text-white sm:text-sm">{value || 'Private experience'}</p></div>
            </div>
          ))}
        </section>
      </Container>

      <Container className="pb-16 pt-10 sm:pb-20 lg:pb-24">
        <div className="grid min-w-0 items-start gap-9 lg:grid-cols-[minmax(0,2.25fr)_minmax(300px,1fr)] lg:gap-10">
          <article className="min-w-0 space-y-10">
            <section id="tour-overview" className="scroll-mt-28">
              <SectionTitle icon={<Mountain size={25} />}>Tour Overview</SectionTitle>
              {content.overview ? <ContentHtml html={content.overview} /> : <p className="text-sm leading-relaxed text-slate-700">{trip.summary}</p>}
            </section>

            {content.countries && <section><SectionTitle icon={<Globe2 size={25} />}>Countries Covered</SectionTitle><ContentHtml html={content.countries} /></section>}

            {content.stops && <section><SectionTitle icon={<MapPin size={25} />}>{content.stopCount ? `The ${content.stopCount} Incredible Stops` : 'The Incredible Stops'}</SectionTitle><ContentHtml html={content.stops} /></section>}

            {photos.length > 0 && <section id="tour-gallery" className="scroll-mt-28"><SectionTitle icon={<Images size={25} />}>Tour Gallery</SectionTitle><TripPhotoGallery photos={photos} title={trip.title} /></section>}

            <div className="grid items-start gap-7 xl:grid-cols-2">
              {content.itinerary && <section className="min-w-0"><SectionTitle icon={<CalendarDays size={25} />}>Your Tour Itinerary</SectionTitle><ContentHtml html={content.itinerary} /></section>}
              {content.inclusions && <section className="min-w-0 rounded-2xl border border-[#0d1b2a]/10 bg-white p-5 shadow-[0_14px_32px_-28px_rgba(13,27,42,0.52)] sm:p-6"><SectionTitle icon={<CheckCircle2 size={20} />}>Good to know</SectionTitle><ContentHtml html={content.inclusions} /></section>}
            </div>
            {content.fallback && <ContentHtml html={content.fallback} className="tour-legacy-copy" />}
          </article>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-24">
            <section className="overflow-hidden rounded-2xl border border-[#0d1b2a]/10 bg-white shadow-[0_18px_38px_-26px_rgba(13,27,42,0.52)] lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <h2 className="flex items-center justify-center gap-2.5 bg-[#0d1b2a] px-4 py-3 font-serif text-xl font-semibold text-white"><CalendarDays size={19} className="text-[#f1c75b]" />Plan this journey</h2>
              {trip.coverUrl && <img src={trip.coverUrl} alt={trip.title} className="h-24 w-full object-cover sm:h-28" />}
              <div className="p-4">
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#40516b]">Private journey{durations.length === 1 ? ` · ${duration}` : ''}</p>
                {startingPrice !== null ? <div className="mt-2 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Starting from</p><p className="mt-0.5 font-serif text-3xl font-semibold tracking-tight text-[#9b7012]">{money(startingPrice)}</p><p className="mt-1 text-[11px] leading-relaxed text-slate-600">Final price depends on pickup, date and vehicle.</p></div>
                  : <div className="mt-2 text-center"><p className="font-serif text-xl font-semibold text-[#9b7012]">{trip.pricingMode === 'distance' ? 'Live route pricing' : 'Price on request'}</p><p className="mt-1 text-[11px] leading-relaxed text-slate-600">{trip.pricingMode === 'distance' ? 'Get a quote for your route, date and vehicle.' : 'Let us prepare a tailored proposal for your trip.'}</p></div>}
                <dl className="my-4 divide-y divide-[#0d1b2a]/10 border-y border-[#0d1b2a]/10 text-[11px]">
                  {[
                    { icon: <MapPin size={18} />, label: 'Pickup / Return', value: pickupLabel },
                    { icon: <Clock3 size={18} />, label: 'Duration', value: duration },
                    ...(content.stopCount ? [{ icon: <Route size={18} />, label: 'Stops', value: `${content.stopCount} destinations` }] : []),
                    ...(content.countryCount ? [{ icon: <Globe2 size={18} />, label: 'Countries', value: `${content.countryCount} countries` }] : []),
                  ].map(({ icon, label, value }) => <div key={label} className="flex items-start justify-between gap-3 py-2"><dt className="flex shrink-0 items-center gap-2 text-slate-600"><span className="text-[#9b7012]">{icon}</span>{label}</dt><dd className="text-right font-bold text-[#0d1b2a]">{value}</dd></div>)}
                </dl>
                {!canBook && trip.booking.reason && <p className="mb-3 rounded-xl bg-[#fffaf0] px-3 py-2 text-[11px] leading-relaxed text-amber-900">{bookingBlockedMessages[trip.booking.reason]}</p>}
                {canBook && <ButtonLink href={bookingHref} className="w-full !px-3 !py-2.5 !text-[12px] !font-bold">Book this journey<ArrowRight size={16} /></ButtonLink>}
                <ButtonLink href={enquiryHref} className={`w-full !px-3 !py-2.5 !text-[12px] !font-bold ${canBook ? 'mt-2.5 !border !border-[#0d1b2a]/25 !bg-white !text-[#0d1b2a] hover:!border-[#0d1b2a] hover:!bg-[#f8f3e9]' : ''}`}>Enquire now<ArrowRight size={16} /></ButtonLink>
               {/**   {whatsappNumber && <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 py-3 text-sm font-bold text-[#0d1b2a] transition hover:bg-slate-50">Chat on WhatsApp <ArrowRight size={16} /></a>} */}
                <div className="mt-4 flex gap-3 border-t border-[#0d1b2a]/10 pt-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1c75b]/20 text-[#9b7012]"><Headphones size={16} /></span><div><h3 className="font-sans text-xs font-bold">Need help?</h3><p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">Our team is here to assist you.</p>{phone ? <a href={`tel:${phone.replace(/[^+0-9]/g, '')}`} className="mt-1 inline-block text-xs font-bold text-[#0d1b2a] hover:text-[#9b7012]">{phone}</a> : <Link href={enquiryHref} className="mt-1 inline-block text-xs font-bold text-[#0d1b2a] underline underline-offset-4 hover:text-[#9b7012]">Contact our team</Link>}</div></div>
              </div>
            </section>
            {pickups.length > 1 && <section className="rounded-2xl border border-[#0d1b2a]/10 bg-white p-5 shadow-[0_14px_32px_-28px_rgba(13,27,42,0.52)]"><h2 className="font-serif text-2xl font-semibold">Available pickup locations</h2><ul className="mt-3 divide-y divide-[#0d1b2a]/10">{pickups.map(location => <li key={location.id} className="py-3"><p className="text-sm font-bold">{location.name}</p><p className="mt-1 text-xs leading-relaxed text-slate-600">{location.address}</p><p className="mt-1 text-xs text-slate-600">{durationLabel(location.durationMinutes)}{location.startingFromPriceMinor !== null ? ` · From ${money(location.startingFromPriceMinor)}` : ''}</p></li>)}</ul></section>}
            {trip.faqs.length > 0 && (
              <section aria-labelledby="tour-faq-heading">
                <h2 id="tour-faq-heading" className="mb-4 flex items-center gap-3 font-serif text-2xl font-semibold text-[#0d1b2a]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1c75b]/20 text-[#9b7012]"><HelpCircle size={19} aria-hidden="true" /></span>Frequently asked questions
                </h2>
                <div className="space-y-2">
                  {trip.faqs.map(faq => (
                    <details key={faq.id} className="group overflow-hidden rounded-xl border border-[#0d1b2a]/10 bg-white shadow-[0_10px_25px_-22px_rgba(13,27,42,0.52)] open:border-[#f1c75b]">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-xs font-bold leading-relaxed text-[#0d1b2a] transition hover:bg-[#fffaf0] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#9b7012] [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0 break-words">{faq.question}</span>
                        <Plus size={18} className="shrink-0 text-[#9b7012] group-open:hidden" aria-hidden="true" />
                        <Minus size={18} className="hidden shrink-0 text-[#9b7012] group-open:block" aria-hidden="true" />
                      </summary>
                      <p className="whitespace-pre-line break-words border-t border-[#0d1b2a]/10 bg-[#fffaf0] px-4 py-3.5 text-xs leading-relaxed text-slate-700">{faq.answer}</p>
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
