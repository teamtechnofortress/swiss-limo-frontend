import Link from 'next/link';
import {
  ArrowRight, BriefcaseBusiness, CalendarCheck, Car, Check, Clock3, Luggage,
  MapPin, MessageCircle, Plane, Plus, Users,
} from 'lucide-react';
import { AirportQuoteForm } from '@/components/airport/AirportQuoteForm';
import { Container } from '@/components/ui/primitives';
import { getVehicles } from '@/lib/fleet';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';
import type { AirportContent } from '@/content/airport';

const HERO_ICONS = [Plane, Users, Clock3, MapPin];
const BENEFIT_ICONS = [Plane, Users, Clock3, Car, MapPin];
const STEP_ICONS = [CalendarCheck, Plane, Users, Car];
const TRAVELLER_ICONS = [BriefcaseBusiness, Users];
const DESTINATION_IMAGES = [
  '/images/airport-transfer/hero.png',
  '/images/airport-transfer/popular-transfer-places/lucarne.jpg',
  '/images/airport-transfer/popular-transfer-places/interlaken.jpg',
  '/images/airport-transfer/popular-transfer-places/Grindelwald.jpg',
  '/images/airport-transfer/popular-transfer-places/basel.webp',
  '/images/airport-transfer/popular-transfer-places/european-city-skyline.png',
];

function SectionHeading({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) {
  return <h2 className={`font-serif text-[1.9rem] font-bold leading-[1.05] tracking-[-.015em] text-[#0d1b2a] sm:text-[2.2rem] ${centered ? 'text-center' : ''}`}>{children}</h2>;
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 text-[14px] font-semibold text-[#0d1b2a]">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a]"><Check size={14} strokeWidth={3} /></span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function whatsappLink(phone: string | null | undefined) {
  const digits = (phone ?? '').replace(/\D/g, '').replace(/^00/, '');
  return digits.length >= 7 ? `https://wa.me/${digits}` : null;
}

export async function AirportTransfersPage({ content, locale }: { content: AirportContent; locale: string }) {
  const publicConfig = await getPublicConfig().catch(() => fallbackPublicConfig());
  const whatsappUrl = whatsappLink(publicConfig.site.contact.phone);
  const vehicles = await getVehicles().then((items) => items.slice(0, 4)).catch(() => []);
  const fleetHref = `/${locale}/fleet`;
  const bookingHref = '/book?from=Zurich%20Airport%20(ZRH)';

  return (
    <div className="overflow-hidden bg-[#fbf8f2] text-[#0d1b2a]">
      <section className="relative isolate bg-[#071e32] text-white">
        <div className="absolute inset-0" role="img" aria-label={content.hero.imageAlt}>
          <div className="absolute inset-0 bg-cover bg-[70%_center] bg-no-repeat" style={{ backgroundImage: "url('/images/airport-transfer/hero.png')" }} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,30,50,.97)_0%,rgba(7,30,50,.9)_36%,rgba(7,30,50,.35)_66%,rgba(7,30,50,.08)_100%)] max-md:bg-[linear-gradient(180deg,rgba(7,30,50,.94)_0%,rgba(7,30,50,.82)_100%)]" />
        </div>
        <Container className="relative max-w-[1240px] pb-28 pt-28 sm:pb-32 sm:pt-32 lg:pt-32 xl:pt-40">
          <div className="max-w-[640px]">
            <p data-header-solid-trigger className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90"><span className="h-[2px] w-8 bg-[#f1c75b]" />{content.hero.eyebrow}</p>
            <h1 className="mt-4 font-serif text-[2.7rem] font-bold leading-[.98] tracking-[-.02em] sm:text-[3.4rem] lg:text-[4rem]">{content.hero.title}</h1>
            <p className="mt-3 font-serif text-[1.45rem] font-semibold italic leading-tight text-[#f1c75b] sm:text-[1.7rem]">{content.hero.tagline}</p>
            <p className="mt-5 max-w-[34rem] text-[15px] leading-relaxed text-white/90">{content.hero.description}</p>
            <ul className="mt-7 grid max-w-[40rem] grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-5">
              {content.hero.points.map(({ lines }, index) => {
                const Icon = HERO_ICONS[index]!;
                return <li key={lines.join(' ')} className="flex items-center gap-3"><Icon size={34} strokeWidth={1.7} className="shrink-0 text-[#f1c75b]" /><span className="text-[14px] font-bold leading-[1.2] text-white">{lines.map((line) => <span key={line} className="block whitespace-nowrap">{line}</span>)}</span></li>;
              })}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#f1c75b] px-6 text-[13px] font-bold text-[#0d1b2a] shadow-[0_10px_24px_-12px_rgba(241,199,91,.9)] transition hover:bg-[#e6b941]">{content.hero.book} <ArrowRight size={16} strokeWidth={2.5} /></a>
              {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/70 px-5 text-[13px] font-bold text-white transition hover:bg-white/10"><MessageCircle size={18} className="text-[#25D366]" strokeWidth={2.2} />{content.hero.whatsapp}</a>}
            </div>
          </div>
        </Container>
      </section>

      <section id="quote" className="relative z-10 -mt-[72px] scroll-mt-28 sm:-mt-[80px]"><AirportQuoteForm copy={content.quoteForm} /></section>

      <section className="pb-14 pt-14 sm:pt-16">
        <Container className="max-w-[1240px]"><SectionHeading centered>{content.benefits.title}</SectionHeading><p className="mx-auto mt-3 max-w-2xl text-center text-[14px] font-medium text-slate-600">{content.benefits.description}</p><div className="mt-8 grid overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-28px_rgba(13,27,42,.5)] sm:grid-cols-2 lg:grid-cols-5">{content.benefits.items.map(({ title, text }, index) => { const Icon = BENEFIT_ICONS[index]!; return <article key={title} className="border-b border-[#0d1b2a]/[.07] px-5 py-6 text-center last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"><Icon size={30} strokeWidth={1.5} className="mx-auto text-[#b27a0b]" /><h3 className="mt-3 font-serif text-[19px] font-bold leading-tight text-[#0d1b2a]">{title}</h3><p className="mx-auto mt-2 max-w-[14rem] text-[12.5px] font-medium leading-[1.5] text-slate-600">{text}</p></article>; })}</div></Container>
      </section>

      <section className="pb-14"><Container className="grid max-w-[1240px] items-stretch gap-6 lg:grid-cols-[.95fr_1.05fr]"><div className="relative min-h-[220px] overflow-hidden rounded-2xl bg-[#071e32]"><img src="/images/airport-transfer/why-choose-us/arrivals.png" alt={content.howItWorks.imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /><div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,30,50,.78)_0%,transparent_55%)]" /><p className="absolute bottom-5 left-6 font-serif text-[1.6rem] font-semibold italic text-white">{content.howItWorks.imageCaption}</p></div><div className="flex flex-col justify-center"><SectionHeading>{content.howItWorks.title}</SectionHeading><ol className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-[0_18px_40px_-28px_rgba(13,27,42,.5)] sm:grid-cols-4">{content.howItWorks.steps.map(({ title, text }, index) => { const Icon = STEP_ICONS[index]!; return <li key={title} className="relative px-2 py-2 text-center sm:px-3"><Icon size={26} strokeWidth={1.6} className="mx-auto text-[#b27a0b]" /><h3 className="mt-2 font-serif text-[16px] font-bold leading-tight">{title}</h3><p className="mt-1.5 text-[12px] font-medium leading-snug text-slate-600">{text}</p>{index < content.howItWorks.steps.length - 1 && <ArrowRight aria-hidden="true" size={16} className="absolute -right-2.5 top-3 hidden text-[#b27a0b] sm:block" />}</li>; })}</ol></div></Container></section>

      <section id="airport-services" className="pb-14"><Container className="max-w-[1240px]"><div className="flex items-end justify-between gap-4"><div><SectionHeading>{content.fleet.title}</SectionHeading><p className="mt-3 max-w-3xl text-[14px] font-medium leading-relaxed text-slate-600">{content.fleet.description}</p></div><Link href={fleetHref} className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-[#9a6700] transition hover:text-[#0d1b2a]">{content.fleet.viewAll} <ArrowRight size={15} /></Link></div>{vehicles.length > 0 ? <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{vehicles.map((vehicle) => { const cover = vehicle.media.cover; const image = cover?.url ?? cover?.thumbnail_url ?? vehicle.images[0]; return <Link key={vehicle.slug} href={`/fleet/${vehicle.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_40px_-28px_rgba(13,27,42,.5)] transition hover:shadow-[0_22px_44px_-26px_rgba(13,27,42,.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f1c75b]"><div className="aspect-[16/10] w-full overflow-hidden bg-[#efe9dc]">{image ? <img src={image} alt={cover?.alt ?? vehicle.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-[#b27a0b]"><Car size={34} /></div>}</div><div className="px-4 pb-4 pt-3 text-center"><h3 className="font-sans text-[14px] font-extrabold text-[#0d1b2a]">{vehicle.name}</h3><p className="mt-2 flex items-center justify-center gap-4 text-[12px] font-semibold text-slate-600"><span className="inline-flex items-center gap-1.5"><Users size={14} className="text-[#b27a0b]" />{content.fleet.passengers.replace('{count}', String(vehicle.passenger_capacity))}</span><span className="inline-flex items-center gap-1.5"><Luggage size={14} className="text-[#b27a0b]" />{content.fleet.luggage.replace('{count}', String(vehicle.luggage_capacity))}</span></p></div></Link>; })}</div> : <div className="mt-6 rounded-2xl border border-dashed border-[#0d1b2a]/20 bg-white px-6 py-10 text-center"><Car className="mx-auto text-[#b27a0b]" size={34} /><p className="mt-3 text-sm font-bold">{content.fleet.empty.title}</p><Link href={bookingHref} className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#9a6700] hover:text-[#0d1b2a]">{content.fleet.empty.action} <ArrowRight size={14} /></Link></div>}</Container></section>

      <section className="pb-14"><Container className="max-w-[1240px]"><div className="flex items-end justify-between gap-4"><div><SectionHeading>{content.destinations.title}</SectionHeading><p className="mt-3 max-w-3xl text-[14px] font-medium leading-relaxed text-slate-600">{content.destinations.description}</p></div><a href="#quote" className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-[#9a6700] transition hover:text-[#0d1b2a]">{content.destinations.viewAll} <ArrowRight size={15} /></a></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{content.destinations.items.map(({ name, time, imageAlt }, index) => <a key={name} href="#quote" className="group relative flex min-h-[150px] items-end overflow-hidden rounded-xl bg-[#0d2b49] p-3.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f1c75b]"><img src={DESTINATION_IMAGES[index]} alt={imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,26,45,0)_35%,rgba(6,26,45,.92)_100%)]" /><div className="relative"><h3 className="font-sans text-[14px] font-extrabold leading-tight">{name}</h3><p className="mt-0.5 text-[11px] font-semibold text-white/85">{time}</p></div></a>)}</div></Container></section>

      <section className="pb-14"><Container className="grid max-w-[1240px] items-stretch gap-8 lg:grid-cols-[1fr_.9fr_1.1fr]"><div className="flex flex-col justify-center"><SectionHeading>{content.meetAndGreet.title}</SectionHeading><p className="mt-3 text-[14px] font-medium leading-relaxed text-slate-600">{content.meetAndGreet.description}</p><div className="mt-5"><CheckList items={content.meetAndGreet.checklist} /></div></div><div className="relative min-h-[240px] overflow-hidden rounded-2xl bg-[#071e32] shadow-[0_18px_40px_-28px_rgba(13,27,42,.6)]"><img src="/images/airport-transfer/why-choose-us/arrivals.png" alt={content.meetAndGreet.imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /></div><div><h2 className="font-serif text-[1.6rem] font-bold leading-tight text-[#0d1b2a] sm:text-[1.8rem]">{content.travellers.title}</h2><div className="mt-4 grid gap-3">{content.travellers.items.map(({ title, text }, index) => { const Icon = TRAVELLER_ICONS[index]!; return <article key={title} className="flex items-center gap-4 rounded-xl bg-white p-3.5 shadow-[0_14px_30px_-24px_rgba(13,27,42,.55)]"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1c75b]/20 text-[#986600]"><Icon size={20} /></span><div className="min-w-0 flex-1"><h3 className="font-sans text-[14px] font-extrabold">{title}</h3><p className="mt-0.5 text-[12px] font-medium leading-relaxed text-slate-600">{text}</p></div></article>; })}</div></div></Container></section>

      <section className="pb-14"><Container className="max-w-[1240px]"><div className="flex items-end justify-between gap-4"><SectionHeading>{content.faq.title}</SectionHeading><Link href="/contact" className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-[#9a6700] transition hover:text-[#0d1b2a]">{content.faq.contact} <ArrowRight size={15} /></Link></div><div className="mt-6 grid items-start gap-3 md:grid-cols-2">{content.faq.items.map(({ question, answer }) => <details key={question} className="group rounded-xl bg-white shadow-[0_12px_28px_-24px_rgba(13,27,42,.55)]"><summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13px] font-bold leading-snug marker:hidden [&::-webkit-details-marker]:hidden"><span>{question}</span><Plus size={18} className="shrink-0 text-[#b27a0b] transition-transform duration-200 group-open:rotate-45" /></summary><p className="border-t border-[#0d1b2a]/[.08] px-4 py-3 text-[13px] font-medium leading-relaxed text-slate-600">{answer}</p></details>)}</div></Container></section>

      <section className="relative isolate bg-[#0d2b49] text-white"><img src="/images/airport-transfer/popular-transfer-places/interlaken.jpg" alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_70%]" /><div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,30,50,.95)_0%,rgba(7,30,50,.82)_55%,rgba(7,30,50,.6)_100%)]" /><Container className="flex max-w-[1240px] flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-serif text-[1.9rem] font-bold leading-tight sm:text-[2.3rem]">{content.cta.titleBefore} <span className="text-[#f1c75b]">{content.cta.titleHighlight}</span> {content.cta.titleAfter}</h2><p className="mt-2 text-[14px] font-medium text-white/85">{content.cta.description}</p></div><div className="flex flex-wrap gap-3"><Link href={bookingHref} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#f1c75b] px-6 text-[13px] font-bold text-[#0d1b2a] transition hover:bg-[#e6b941]">{content.cta.action} <ArrowRight size={16} strokeWidth={2.5} /></Link>{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2.5 rounded-full border border-white/70 px-5 text-[13px] font-bold transition hover:bg-white/10"><MessageCircle size={18} className="text-[#25D366]" />{content.cta.whatsapp}</a>}</div></Container></section>
    </div>
  );
}
