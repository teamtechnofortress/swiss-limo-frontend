import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowRight, BriefcaseBusiness, CalendarCheck, Car, Clock3, Luggage, MapPin, Plane, ShieldCheck, UserRound } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Zurich Airport transfers',
  description: 'Private chauffeur transfers to and from Zurich Airport (ZRH). Book a calm, comfortable airport journey.',
};

const ZURICH_AIRPORT = 'Zurich Airport (ZRH)';
const fromAirportHref = `/book?from=${encodeURIComponent(ZURICH_AIRPORT)}`;
const toAirportHref = `/book?to=${encodeURIComponent(ZURICH_AIRPORT)}`;

export default function AirportTransfersPage() {
  return (
    <div className="overflow-hidden bg-[#f8f3e9] text-[#0d1b2a]">
      <section className="relative isolate overflow-hidden bg-[#0d1b2a] text-white">
        <div aria-hidden="true" className="absolute inset-0">
          <img src="/images/airport-transfer/hero.png" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,42,0.98)_0%,rgba(13,27,42,0.91)_45%,rgba(13,27,42,0.18)_74%,rgba(13,27,42,0.24)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d1b2a]/80 to-transparent" />
        </div>

        <Container className="relative py-12 sm:py-14 lg:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3"><span className="h-[3px] w-8 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f1c75b]">Zurich Airport transfers</p></div>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[0.94] tracking-[-0.025em] text-white sm:text-5xl lg:text-6xl">
              A calm start.<br />
              <span className="text-[#f1c75b]">A smooth arrival.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">Private chauffeur transfers to and from Zurich Airport. We take care of the route and timing, so you can travel comfortably from the moment you land—or leave.</p>
            <a href="#transfer-direction" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-5 py-2.5 text-[12px] font-bold text-[#0d1b2a] transition hover:bg-[#e0b54a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b2a]">
              Choose your transfer <ArrowDown size={16} strokeWidth={2.4} />
            </a>
          </div>

          <div className="mt-7 flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/20 pt-4 sm:gap-x-8">
            {[
              { icon: Plane, text: 'Zurich Airport (ZRH)' },
              { icon: UserRound, text: 'Private chauffeur' },
              { icon: Luggage, text: 'Luggage considered' },
            ].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-2"><Icon size={15} className="text-[#f1c75b]" strokeWidth={1.8} /><p className="text-[11px] font-semibold text-white/85">{text}</p></div>)}
          </div>
        </Container>
      </section>

      <section id="transfer-direction" className="relative z-10 -mt-3 scroll-mt-24 sm:-mt-5">
        <Container className="pb-14 pt-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
          <div className="rounded-t-2xl border-t border-[#0d1b2a]/15 bg-[#f8f3e9] px-1 pt-7 sm:px-2 sm:pt-8">
            <div className="flex flex-col gap-4 border-b border-[#0d1b2a]/15 pb-7 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#40516b]">Choose your direction</p></div>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Your Zurich Airport journey.</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">Select where your journey begins. Zurich Airport is added to your booking form automatically.</p>
              </div>
              <p className="text-[12px] font-medium text-slate-500">Private transfers, planned around you.</p>
            </div>
          </div>

          <div className="mt-7 grid gap-5 md:mt-8 md:grid-cols-2 md:gap-6">
            <article className="group relative overflow-hidden rounded-2xl border border-[#0d1b2a]/10 bg-white p-6 shadow-[0_16px_34px_-26px_rgba(13,27,42,0.52)] sm:p-7">
              <div aria-hidden="true" className="absolute -right-6 -top-8 text-[#f1c75b]/15"><Plane size={170} strokeWidth={0.55} /></div>
              <div className="relative max-w-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1c75b]/20 text-[#9b7012]"><Plane size={21} strokeWidth={1.7} /></span>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b7012]">Arrival transfer</p>
                <h3 className="mt-3 font-serif text-3xl font-semibold leading-[0.98] text-[#0d1b2a]">From Zurich Airport</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-600">Arriving at ZRH? Book your private transfer from the airport to your hotel, home, meeting or next destination.</p>
                <ButtonLink href={fromAirportHref} className="mt-7 !px-5 !py-2.5 !text-[12px] !font-bold">Book an arrival transfer <ArrowRight size={16} /></ButtonLink>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-2xl border border-[#0d1b2a]/10 bg-[#0d1b2a] p-6 text-white shadow-[0_16px_34px_-26px_rgba(13,27,42,0.62)] sm:p-7">
              <div aria-hidden="true" className="absolute -right-6 -top-8 text-[#f1c75b]/10"><Car size={170} strokeWidth={0.55} /></div>
              <div className="relative max-w-md">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a]"><Car size={21} strokeWidth={1.7} /></span>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1c75b]">Departure transfer</p>
                <h3 className="mt-3 font-serif text-3xl font-semibold leading-[0.98] text-white">To Zurich Airport</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-white/75">Heading to ZRH? Travel comfortably from your address to the terminal in the vehicle that suits your journey.</p>
                <Link href={toAirportHref} className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-white/45 px-5 py-2.5 text-[12px] font-bold text-white transition hover:border-white hover:bg-white/10">Book a departure transfer <ArrowRight size={16} /></Link>
              </div>
            </article>
          </div>

          <section className="mt-14 grid items-center gap-9 sm:mt-20 lg:grid-cols-[minmax(320px,.92fr)_minmax(0,1.08fr)] lg:gap-14">
            <div className="relative overflow-hidden rounded-2xl border border-[#0d1b2a]/10 bg-white p-2 shadow-[0_18px_38px_-26px_rgba(13,27,42,0.52)]">
              <img src="/images/home/zurich-airport.jpg" alt="Private chauffeur vehicle at Zurich Airport" className="aspect-[4/3] w-full rounded-xl object-cover" />
              <div className="absolute bottom-6 left-6 rounded-xl bg-[#0d1b2a]/92 px-4 py-3 text-white backdrop-blur-sm"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#f1c75b]">One simple journey</p><p className="mt-1 text-[12px] font-semibold">From terminal to destination.</p></div>
            </div>
            <div>
              <div className="flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#40516b]">What to expect</p></div>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Everything considered before you arrive.</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">A good airport transfer should feel uncomplicated. We plan the important details ahead, so your journey feels clear, comfortable and well timed.</p>
              <div className="mt-7 space-y-4">
                {[
                  { icon: CalendarCheck, title: 'Book ahead', text: 'Choose your pickup, destination, time and vehicle in a few simple steps.' },
                  { icon: Plane, title: 'Share your flight details', text: 'Add a flight number when booking so your airport pickup can be planned around your arrival.' },
                  { icon: Luggage, title: 'Travel comfortably', text: 'Choose a vehicle with the passenger and luggage space your journey needs.' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-4 border-b border-[#0d1b2a]/10 pb-4 last:border-b-0 last:pb-0"><span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1c75b]/20 text-[#9b7012]"><Icon size={17} strokeWidth={1.7} /></span><div><h3 className="text-sm font-bold text-[#0d1b2a]">{title}</h3><p className="mt-1 text-[12px] leading-relaxed text-slate-600">{text}</p></div></div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 sm:mt-20">
            <div className="max-w-2xl"><div className="flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#40516b]">Travel made easy</p></div><h2 className="mt-3 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">A transfer built around your plans.</h2></div>
            <div className="mt-7 grid gap-4 sm:grid-cols-3 lg:mt-8 lg:gap-5">
              {[
                { icon: BriefcaseBusiness, title: 'Business travel', text: 'Arrive prepared, with a private transfer that works around your schedule.' },
                { icon: MapPin, title: 'Hotels & homes', text: 'Travel directly between Zurich Airport and the address that matters to you.' },
                { icon: Clock3, title: 'Clear timing', text: 'Choose your preferred pickup time and let your chauffeur take care of the route.' },
              ].map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-[#0d1b2a]/10 bg-white p-5 shadow-[0_14px_32px_-28px_rgba(13,27,42,0.52)] sm:p-6"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1c75b]/20 text-[#9b7012]"><Icon size={19} strokeWidth={1.7} /></span><h3 className="mt-5 font-serif text-2xl font-semibold leading-tight text-[#0d1b2a]">{title}</h3><p className="mt-2 text-[13px] leading-relaxed text-slate-600">{text}</p></article>
              ))}
            </div>
          </section>

          <section className="relative mt-14 overflow-hidden rounded-2xl bg-[#0d1b2a] px-6 py-9 text-white shadow-[0_18px_38px_-24px_rgba(13,27,42,0.68)] sm:mt-20 sm:px-10 sm:py-11 lg:px-14">
            <div aria-hidden="true" className="absolute -right-8 -top-16 text-[#f1c75b]/10"><Plane size={270} strokeWidth={0.45} /></div>
            <div className="relative flex max-w-4xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#f1c75b]">Zurich Airport, made simple</p><h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">Ready to plan your transfer?</h2><p className="mt-3 text-sm leading-relaxed text-white/75">Choose whether you are travelling from or to Zurich Airport, then select the details that suit your journey.</p></div><ButtonLink href={fromAirportHref} className="!shrink-0 !px-6 !py-3 !text-[12px] !font-bold">Book from ZRH <ArrowRight size={16} /></ButtonLink></div>
          </section>
        </Container>
      </section>
    </div>
  );
}
