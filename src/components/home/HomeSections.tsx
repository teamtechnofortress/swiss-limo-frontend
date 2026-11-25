import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Briefcase, Car, Clock, Gem, Mail, MapPin, MessageSquare, Plane, Plus, ShieldCheck, Users } from 'lucide-react';
import { VehicleCard } from '@/components/fleet/VehicleCard';
import { ButtonLink, Container } from '@/components/ui/primitives';
import type { HomeContent, HomeIcon } from '@/content/home';
import type { VehicleCardCopy } from '@/lib/format';
import type { Vehicle } from '@/lib/types';

const icons: Record<HomeIcon, typeof Plane> = {
  plane: Plane,
  briefcase: Briefcase,
  car: Car,
  clock: Clock,
  gem: Gem,
  mapPin: MapPin,
  shieldCheck: ShieldCheck,
  users: Users,
};

export function ServicesSection({ content }: { content: HomeContent['services'] }) {
  const airport = content.airport;

  return (
    <section className="relative overflow-hidden bg-[#f8f3e9] pb-6 pt-24 text-[#0d1b2a] md:pb-8 md:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] overflow-hidden" aria-hidden="true">
        <div className="absolute -right-20 top-10 opacity-[0.06] text-[#0d1b2a]">
          <svg width="600" height="600" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
        </div>
        <div className="absolute -left-10 top-20 opacity-[0.04] text-[#0d1b2a]">
          <svg width="500" height="500" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" /></svg>
        </div>
      </div>

      <Container className="relative z-10">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3"><span className="h-[3px] w-8 bg-[#f1c75b] shadow-[0_0_2px_#f1c75b]" /><p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0d1b2a]">{content.eyebrow}</p></div>
            <h2 className="font-serif text-3xl font-bold text-[#0d1b2a] md:text-4xl lg:text-5xl" style={{ textShadow: '0.75px 0 0 currentColor, -0.75px 0 0 currentColor, 0 0.75px 0 currentColor, 0 -0.75px 0 currentColor' }}>{content.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{content.description}</p>
          </div>
          <span className="mt-1 min-h-[40px] w-px shrink-0 bg-gray-400/60" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((service) => {
            const Icon = icons[service.icon];
            return (
              <div key={service.title} className="group relative rounded-xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative h-44 w-full overflow-visible rounded-t-xl"><div className="absolute inset-0 overflow-hidden rounded-t-xl"><Image src={service.image} alt={service.imageAlt} fill className="object-cover" /></div><div className="absolute -bottom-5 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a] shadow-md ring-2 ring-white"><Icon size={18} strokeWidth={2.5} /></div></div>
                <div className="p-4 pt-7"><div className="flex items-start justify-between gap-2"><h3 className="font-sans text-[15px] font-bold leading-tight text-black">{service.title}</h3><ArrowRight size={16} className="mt-1 shrink-0 text-[#f1c75b]" /></div><p className="mt-2 font-sans text-[12px] leading-relaxed text-black">{service.text}</p></div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-black/5 bg-[#f3eee5] shadow-sm">
          <div className="grid items-stretch gap-6 p-4 md:grid-cols-12 md:p-6">
            <div className="relative min-h-[220px] w-full overflow-hidden rounded-xl shadow-[0_5px_15px_rgba(19,38,56,0.15)] md:col-span-7 md:min-h-[280px]"><Image src="/images/home/zurich-airport.jpg" alt={airport.imageAlt} fill className="object-cover object-center" /></div>
            <div className="flex flex-col justify-center py-2 md:col-span-5">
              <h2 className="font-serif text-2xl font-bold text-[#0d1b2a] md:text-3xl" style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor' }}>{airport.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">{airport.description}</p>
              <div className="mb-4 mt-4 grid grid-cols-4 gap-2">{airport.features.map((feature, index) => { const Icon = icons[feature.icon]; return <div key={feature.text} className={`flex items-center gap-2 ${index !== airport.features.length - 1 ? 'border-r border-[#d2c9bc] pr-2' : ''}`}><Icon size={22} className="shrink-0 text-[#c88d22]" strokeWidth={1.5} /><span className="whitespace-pre-line text-[9px] font-bold leading-tight text-[#0d1b2a]">{feature.text}</span></div>; })}</div>
              <ButtonLink href="/book?from=Zurich%20Airport" className="w-fit !rounded-full !border-none !bg-[#f1c75b] !px-4 !py-2.5 !text-[11px] !font-bold !text-[#111e29] hover:!bg-[#e0b54a]"><Car size={14} className="mr-1.5" />{airport.action}</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FleetSection({ content, vehicleCopy, vehicles }: { content: HomeContent['fleet']; vehicleCopy: VehicleCardCopy; vehicles: Vehicle[] }) {
  return <section className="relative overflow-hidden bg-[#f8f3e9] pb-12 pt-8 md:pb-16 md:pt-12"><Container className="relative z-10"><div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-3"><span className="h-[3px] w-6 bg-[#f1c75b]" /><p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0d1b2a]">{content.eyebrow}</p></div><h2 className="font-serif text-3xl font-bold text-[#0d1b2a] md:text-4xl lg:text-5xl">{content.title}</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{content.description}</p></div><Link href="/fleet" className="flex items-center gap-1.5 rounded-full border border-[#0d1b2a]/20 bg-transparent px-5 py-2.5 text-[11px] font-bold text-[#0d1b2a] transition hover:border-[#0d1b2a] hover:bg-[#0d1b2a]/5">{content.viewAll} <ArrowRight size={14} /></Link></div><div className="grid gap-4 md:grid-cols-3">{vehicles.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} copy={vehicleCopy} />)}</div></Container></section>;
}

export function BenefitsSection({ content }: { content: HomeContent['benefits'] }) {
  return <section className="relative bg-[#071e32] py-10 text-white"><Container><div className="mb-7 max-w-2xl"><h2 className="font-serif text-3xl font-bold md:text-4xl">{content.title}</h2><p className="mt-2 text-sm leading-relaxed text-white/75">{content.description}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{content.items.map((item) => { const Icon = item.icon === 'swiss' ? null : icons[item.icon]; return <div key={item.title} className="flex gap-3 rounded-xl border border-white/15 bg-white/[0.03] p-4">{item.icon === 'swiss' ? <SwissIcon /> : Icon && <Icon size={28} className="shrink-0 text-[#f1c75b]" strokeWidth={1.5} />}<div><h3 className="text-sm font-bold leading-tight">{item.title}</h3><p className="mt-1 text-[11px] leading-relaxed text-white/70">{item.text}</p></div></div>; })}</div></Container></section>;
}

function SwissIcon() {
  return <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-sm"><svg viewBox="0 0 32 32" className="h-full w-full"><rect width="32" height="32" fill="#d52b1e" /><path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" /></svg></span>;
}

export function QuoteSection({ content, whatsappUrl }: { content: HomeContent['quote']; whatsappUrl: string | null }) {
  return <section className="relative overflow-hidden bg-[#0d1b2a]"><div className="absolute inset-0 bg-cover bg-top bg-no-repeat" style={{ backgroundImage: "url('/images/home/swit.jpg')" }} aria-hidden="true" /><div className="absolute inset-0 bg-[#03192e]/50" aria-hidden="true" /><Container className="relative flex min-h-[130px] flex-col items-center justify-between gap-6 py-8 md:flex-row"><div><h2 className="font-serif text-3xl font-bold text-white md:text-4xl">{content.title}</h2><p className="mt-1 text-sm text-gray-200">{content.description}</p></div><div className="flex flex-wrap items-center gap-3"><ButtonLink href="/contact" className="!rounded-full !border-none !bg-[linear-gradient(135deg,#f8d77a,#e7a91f)] !px-6 !py-3 !text-[12px] !font-bold !text-[#111e29] hover:!bg-[#e0b54a]"><Mail size={16} className="mr-2" />{content.request}<ArrowRight size={16} className="ml-1" /></ButtonLink>{whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12px] font-bold text-[#0d1b2a] transition hover:bg-gray-100"><MessageSquare size={16} className="text-[#25D366]" />{content.whatsapp}</a>}</div></Container></section>;
}

export function HomeFaqSection({ content }: { content: HomeContent['faqs'] }) {
  const midpoint = Math.ceil(content.items.length / 2);
  const columns = [content.items.slice(0, midpoint), content.items.slice(midpoint)].filter((items) => items.length > 0);

  return (
    <section className="bg-[#fcf8fc] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] text-[#0d1b2a] sm:text-5xl">{content.title}</h2>
        </div>

        <div className={`mx-auto mt-9 grid max-w-5xl gap-4 ${columns.length > 1 ? 'md:grid-cols-2 md:gap-5' : ''}`}>
          {columns.map((items, columnIndex) => (
            <div key={columnIndex} className="divide-y divide-[#dce3f2] rounded-2xl border border-[#dce3f2] bg-white px-5 shadow-[0_12px_30px_-26px_rgba(13,27,42,0.32)] sm:px-6">
              {items.map(({ question, answer }) => (
                <details key={question} className="group py-4 sm:py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[14px] font-bold leading-snug text-[#0d1b2a] marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b27a0b] [&::-webkit-details-marker]:hidden">
                    <span>{question}</span>
                    <Plus size={18} className="shrink-0 text-[#a57717] transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                  </summary>
                  <p className="pb-1 pt-3 text-[13px] font-medium leading-relaxed text-slate-600">{answer}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
