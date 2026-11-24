import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight, BadgeInfo, CalendarDays, Car, CalendarClock, Crown, MapPin, MessageCircle,
  Mountain, Plane, Plus, ShieldCheck, TreePine, Users, UsersRound, Clock3,
} from 'lucide-react';
import { WefQuoteForm } from '@/components/wef/WefQuoteForm';
import { Container } from '@/components/ui/primitives';
import { getVehicles } from '@/lib/fleet';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

export const metadata: Metadata = {
  title: { absolute: 'WEF Davos 2027 Chauffeur Transfers | Swiss Aero Transfer' },
  description:
    'Private chauffeur and transfer service for WEF Davos 2027 delegates. Zurich Airport to Davos, St. Moritz transfers and executive vehicles. Request your quote.',
};

const HERO_IMAGE = '/images/wef/WEF-2027-hero.png';
const AIRPORT_IMAGE = '/images/airport-transfer/transfer-wroking-hero.png';

const HERO_POINTS = [
  { icon: Plane, lines: ['Zurich Airport', 'transfers'] },
  { icon: CalendarDays, lines: ['WEF event', 'transportation'] },
  { icon: Car, lines: ['Hourly and', 'standby service'] },
  { icon: UsersRound, lines: ['Executive and', 'group travel'] },
];

const INFO = [
  { icon: CalendarDays, title: 'WEF Annual Meeting 2027', text: '18 to 22 January 2027' },
  { icon: MapPin, title: 'Davos-Klosters', text: 'Switzerland' },
  { icon: Users, title: 'For delegates, executives', text: 'and guests' },
  { icon: BadgeInfo, title: 'All enquiries welcome.', text: 'Availability and pricing on request.' },
];

const SERVICES = [
  { icon: Plane, title: 'Zurich Airport Transfers', text: 'Private transfers from Zurich Airport (ZRH) to Davos, St. Moritz and other destinations.' },
  { icon: Mountain, title: 'Davos Chauffeur Service', text: 'Dedicated transportation in Davos for meetings, hotels and event venues.' },
  { icon: TreePine, title: 'St. Moritz Transfers', text: 'Comfortable private transfers to St. Moritz and nearby resorts.' },
  { icon: CalendarClock, title: 'Hourly Chauffeur Service', text: 'A vehicle with a professional driver at your disposal for meetings and events.' },
  { icon: UsersRound, title: 'Executive and Delegation Travel', text: 'Premium transportation for executives, teams and VIP guests.' },
  { icon: Crown, title: 'Special Event Transportation', text: 'Tailored transfers for WEF events, private dinners and corporate gatherings.' },
];

const WHY = [
  { icon: Plane, title: 'Flight Tracking', text: 'Real-time monitoring for a timely pickup.' },
  { icon: Users, title: 'Meet and Greet', text: 'Personalised airport welcome and assistance.' },
  { icon: ShieldCheck, title: 'Discreet and Professional', text: 'Experienced, professional chauffeurs who understand executive travel.' },
  { icon: CalendarClock, title: 'Flexible and Tailored', text: 'Every enquiry is welcome, with services built around your schedule.' },
];

const FAQS = [
  { q: 'Are you the official transport provider for the World Economic Forum?', a: 'No. Swiss Aero Transfer is an independent transportation provider and is not affiliated with, endorsed by, or an official partner of the World Economic Forum. We offer private chauffeur services to delegates and visitors attending the event.' },
  { q: 'How long does the transfer from Zurich Airport to Davos take?', a: 'The journey takes approximately 2 hours 30 minutes and covers about 150 km. Travel times can vary with traffic and weather, so allow extra time during the event.' },
  { q: 'Can you pick up delegates from St. Moritz or other Swiss destinations?', a: 'Yes. We offer transfers between Zurich Airport, Davos, St. Moritz and other destinations. Contact us with your route for a quote.' },
  { q: 'Do you track flights?', a: 'Yes. We monitor your flight so your chauffeur is ready for an on-time pickup, even if your arrival changes.' },
  { q: 'Can I book a chauffeur for the whole day during the event?', a: 'Yes. Our hourly and standby chauffeur service covers meetings, events and multi-stop schedules.' },
  { q: 'How do I request a quote?', a: 'Complete the quote form on this page with your service, dates, locations, passengers and contact details, or message us on WhatsApp. We will confirm availability and send a tailored quotation.' },
];

function whatsappLink(phone: string | null | undefined) {
  const digits = (phone ?? '').replace(/\D/g, '').replace(/^00/, '');
  return digits.length >= 7 ? `https://wa.me/${digits}` : null;
}

function WhatsAppButton({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/70 px-5 text-[13px] font-bold text-white transition hover:bg-white/10">
      <MessageCircle size={18} className="text-[#25D366]" strokeWidth={2.2} />
      Chat on WhatsApp
    </a>
  );
}

export default async function Wef2027Page() {
  const [publicConfig, vehicles] = await Promise.all([
    getPublicConfig().catch(() => fallbackPublicConfig()),
    getVehicles().then((items) => items.slice(0, 4)).catch(() => []),
  ]);
  const whatsappUrl = whatsappLink(publicConfig.site.contact.phone);

  return (
    <div className="overflow-hidden bg-[#fbf8f2] text-[#0d1b2a]">
      {/* HERO */}
      <section className="relative isolate bg-[#071e32] text-white">
        <div
          className="absolute inset-0"
          role="img"
          aria-label="Chauffeur in a dark uniform opening the rear door of a black Mercedes-Benz at Zurich Airport"
        >
          <div className="absolute inset-0 bg-cover bg-[70%_center]" style={{ backgroundImage: `url('${HERO_IMAGE}')` }} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,30,50,.97)_0%,rgba(7,30,50,.9)_38%,rgba(7,30,50,.4)_68%,rgba(7,30,50,.1)_100%)] max-md:bg-[linear-gradient(180deg,rgba(7,30,50,.94)_0%,rgba(7,30,50,.82)_100%)]" />
        </div>
        <Container className="relative max-w-[1240px] pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pt-32 xl:pt-40">
          <div className="max-w-[660px]">
            <p data-header-solid-trigger className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.16em]">
              <span className="h-[2px] w-9 bg-[#f1c75b]" />World Economic Forum<span className="h-[2px] w-9 bg-[#f1c75b]" />
            </p>
            <h1 className="mt-4 font-serif text-[2.6rem] font-bold leading-[1] tracking-[-.02em] sm:text-[3.3rem] lg:text-[3.8rem]">
              WEF Davos 2027 Chauffeur and Transfer Service
            </h1>
            <p className="mt-5 max-w-[34rem] text-[16px] leading-relaxed text-white/95">
              Private, reliable and discreet transportation for delegates, executives and visitors attending the World Economic Forum Annual Meeting in Davos.
            </p>

            <ul className="mt-7 grid max-w-[40rem] grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-y-0">
              {HERO_POINTS.map(({ icon: Icon, lines }) => (
                <li key={lines.join(' ')} className="flex flex-col items-center gap-2 px-2 text-center sm:border-l sm:border-white/20 sm:first:border-l-0">
                  <Icon size={28} strokeWidth={1.6} className="text-[#f1c75b]" />
                  <span className="text-[12px] font-bold leading-tight">
                    {lines.map((line) => <span key={line} className="block">{line}</span>)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#f1c75b] px-6 text-[13px] font-bold text-[#0d1b2a] shadow-[0_10px_24px_-12px_rgba(241,199,91,.9)] transition hover:bg-[#e6b941]">
                Request Your WEF 2027 Quote <ArrowRight size={16} strokeWidth={2.5} />
              </a>
              {whatsappUrl && <WhatsAppButton href={whatsappUrl} />}
            </div>
          </div>
        </Container>
      </section>

      {/* EVENT INFO BAR */}
      <section className="relative z-10 -mt-12">
        <Container className="max-w-[1240px]">
          <ul className="grid rounded-2xl bg-white p-2 shadow-[0_22px_50px_-24px_rgba(7,30,50,.5)] sm:grid-cols-2 lg:grid-cols-4">
            {INFO.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-4 px-5 py-4 lg:border-l lg:border-[#0d1b2a]/10 lg:first:border-l-0">
                <Icon size={30} strokeWidth={1.5} className="shrink-0 text-[#b27a0b]" />
                <p className="text-[13px] font-bold leading-snug">{title}<span className="block font-medium text-slate-600">{text}</span></p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* SERVICES + QUOTE FORM */}
      <section className="py-14">
        <Container className="grid max-w-[1240px] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_500px] xl:grid-cols-[minmax(0,1fr)_540px]">
          <div>
            <h2 className="font-serif text-[2rem] font-bold leading-tight sm:text-[2.3rem]">Our WEF 2027 Transfer Services</h2>
            <p className="mt-3 max-w-xl text-[14.5px] font-medium leading-relaxed text-slate-600">
              Flexible and tailored chauffeur solutions for the World Economic Forum, with service options to suit individual, corporate and delegation needs.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {SERVICES.map(({ icon: Icon, title, text }) => (
                <a key={title} href="#quote" className="group flex flex-col rounded-2xl bg-white p-4 shadow-[0_16px_36px_-26px_rgba(13,27,42,.55)] transition hover:shadow-[0_20px_40px_-24px_rgba(13,27,42,.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f1c75b]">
                  <Icon size={30} strokeWidth={1.5} className="text-[#b27a0b]" />
                  <h3 className="mt-3 font-serif text-[18px] font-bold leading-tight">{title}</h3>
                  <p className="mt-1.5 flex-1 text-[12.5px] font-medium leading-[1.5] text-slate-600">{text}</p>
                  <span className="ml-auto mt-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a] transition group-hover:translate-x-0.5"><ArrowRight size={14} strokeWidth={2.6} /></span>
                </a>
              ))}
            </div>

            <div className="relative mt-5 flex min-h-[210px] items-end overflow-hidden rounded-2xl bg-[#071e32] p-5 text-white sm:p-6">
              <img src={AIRPORT_IMAGE} alt="Black Mercedes-Benz chauffeur car at Zurich Airport at dusk" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,30,50,.92)_0%,rgba(7,30,50,.35)_70%,rgba(7,30,50,.15)_100%)]" />
              <div className="relative flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-md">
                  <h3 className="font-serif text-[1.7rem] font-bold leading-tight">Zurich Airport to Davos</h3>
                  <p className="mt-1.5 text-[13.5px] font-medium leading-snug text-white/90">A seamless and comfortable journey from Zurich Airport to Davos for the WEF Annual Meeting. The drive takes about 2 hours 30 minutes and covers approximately 150 km.</p>
                  <a href="#quote" className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#f1c75b] transition hover:text-white">
                    Request a Transfer Quote <ArrowRight size={14} />
                  </a>
                </div>
                <div className="flex gap-2.5">
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-[#071e32]/70 px-3.5 py-2.5 backdrop-blur-sm">
                    <Clock3 size={20} className="text-[#f1c75b]" />
                    <p className="text-[12px] font-bold leading-tight">Approximately<span className="block font-medium text-white/75">2 hours 30 minutes</span></p>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/20 bg-[#071e32]/70 px-3.5 py-2.5 backdrop-blur-sm">
                    <MapPin size={20} className="text-[#f1c75b]" />
                    <p className="text-[12px] font-bold leading-tight">Approximately<span className="block font-medium text-white/75">150 km</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside id="quote" className="scroll-mt-28 rounded-3xl bg-[#071e32] p-6 text-white shadow-[0_30px_60px_-28px_rgba(7,30,50,.8)] sm:p-8">
            <div className="border-b border-white/10 pb-5">
              <div className="mb-2 flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">Quote request</p></div>
              <h2 className="font-serif text-3xl font-bold leading-tight text-white">Request Your WEF 2027 Quote</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/85">Share your travel details and our team will get back to you with a tailored offer and availability.</p>
            </div>
            <WefQuoteForm turnstileEnabled={publicConfig.turnstileEnabled} turnstileSiteKey={publicConfig.turnstileSiteKey} />
          </aside>
        </Container>
      </section>

      {/* FLEET + WHY */}
      <section className="pb-14">
        <Container className="grid max-w-[1240px] items-start gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-[1.9rem] font-bold leading-tight sm:text-[2.1rem]">Our Executive Fleet</h2>
              <Link href="/fleet" className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-[#9a6700] transition hover:text-[#0d1b2a]">View All Vehicles <ArrowRight size={15} /></Link>
            </div>
            <p className="mt-2 text-[14px] font-medium text-slate-600">Travel in comfort, privacy and style with our premium vehicles, ideal for business travel and WEF delegates.</p>
            {vehicles.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {vehicles.map((vehicle) => {
                  const cover = vehicle.media.cover;
                  const image = cover?.url ?? cover?.thumbnail_url ?? vehicle.images[0];
                  return (
                    <Link key={vehicle.slug} href={`/fleet/${vehicle.slug}`} className="group overflow-hidden rounded-xl bg-white shadow-[0_14px_30px_-24px_rgba(13,27,42,.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f1c75b]">
                      <div className="aspect-[16/10] overflow-hidden bg-[#efe9dc]">
                        {image ? <img src={image} alt={cover?.alt ?? vehicle.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-[#b27a0b]"><Car size={28} /></div>}
                      </div>
                      <div className="px-3 pb-3 pt-2.5">
                        <h3 className="text-[12.5px] font-extrabold leading-tight">{vehicle.name}</h3>
                        <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600"><Users size={13} className="text-[#b27a0b]" />Up to {vehicle.passenger_capacity} passengers</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="mt-5 rounded-xl border border-dashed border-[#0d1b2a]/20 bg-white px-5 py-8 text-center text-sm font-bold">Our vehicle selection will appear here shortly.</p>
            )}
          </div>

          <div>
            <h2 className="font-serif text-[1.9rem] font-bold leading-tight sm:text-[2.1rem]">Why Choose Swiss Aero Transfer?</h2>
            <p className="mt-2 text-[14px] font-medium text-slate-600">A trusted partner for executive transportation during WEF.</p>
            <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-[#0d1b2a]/[.08] shadow-[0_14px_30px_-24px_rgba(13,27,42,.55)] sm:grid-cols-2">
              {WHY.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3 bg-white p-4">
                  <Icon size={28} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#b27a0b]" />
                  <p className="text-[13.5px] font-bold leading-tight">{title}<span className="mt-1 block text-[12px] font-medium leading-snug text-slate-600">{text}</span></p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-[#071e32] py-12 text-white">
        <Container className="max-w-[1240px]">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-[1.9rem] font-bold leading-tight sm:text-[2.2rem]">Frequently Asked Questions</h2>
            <Link href="/contact" className="hidden shrink-0 items-center gap-1.5 text-[13px] font-bold text-[#f1c75b] transition hover:text-white sm:inline-flex">Ask us something else <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-6 grid items-start gap-3 md:grid-cols-2">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-white/15 bg-white/[.04]">
                <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13.5px] font-bold leading-snug marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{q}</span>
                  <Plus size={18} className="shrink-0 text-[#f1c75b] transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="border-t border-white/10 px-4 py-3 text-[13px] font-medium leading-relaxed text-white/85">{a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative isolate bg-[#0d2b49] text-white">
        <img src="/images/wef/davos-snowy-landscape.png" alt="Snow-covered Davos mountain landscape" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_70%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,30,50,.95)_0%,rgba(7,30,50,.82)_55%,rgba(7,30,50,.6)_100%)]" />
        <Container className="flex max-w-[1240px] flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-serif text-[1.9rem] font-bold leading-tight sm:text-[2.3rem]">Plan Your <span className="text-[#f1c75b]">WEF 2027</span> Transportation Today</h2>
            <p className="mt-2 max-w-xl text-[14px] font-medium leading-relaxed text-white/85">Contact Swiss Aero Transfer for a tailored offer, availability and transport arrangements for Davos, St. Moritz and beyond.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#quote" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#f1c75b] px-6 text-[13px] font-bold text-[#0d1b2a] transition hover:bg-[#e6b941]">Request a Quote <ArrowRight size={16} strokeWidth={2.5} /></a>
            {whatsappUrl && <WhatsAppButton href={whatsappUrl} />}
          </div>
        </Container>
      </section>

      <p className="bg-[#071e32] px-6 py-4 text-center text-[11.5px] font-medium italic text-white/70">
        Swiss Aero Transfer is an independent transportation provider and is not affiliated with, endorsed by, or an official partner of the World Economic Forum.
      </p>
    </div>
  );
}
