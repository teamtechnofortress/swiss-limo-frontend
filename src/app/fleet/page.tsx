import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Car, Luggage, ShieldCheck, Users } from 'lucide-react';
import { VehicleCard } from '@/components/fleet/VehicleCard';
import { CategoryTabs } from '@/components/fleet/CategoryTabs';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { getVehicles } from '@/lib/fleet';

export const metadata: Metadata = {
  title: 'Our fleet',
  description: 'Executive, first class and van chauffeur vehicles. Transparent per-kilometre pricing.',
};

const CATEGORIES = ['executive', 'first_class', 'van'] as const;

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = CATEGORIES.find((item) => item === category) ?? '';
  const vehicles = await getVehicles(active || undefined);

  return (
    <div className="overflow-hidden bg-[#f8f3e9] text-[#0d1b2a]">
      <section className="relative isolate overflow-hidden bg-[#0d1b2a] text-white">
        <div aria-hidden="true" className="absolute inset-0">
          <img src="/images/home/homepage_fleet_background.png" alt="" className="h-full w-full object-cover object-center opacity-70" />
          <img src="/images/fleet/listinghero.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,42,0.98)_0%,rgba(13,27,42,0.91)_43%,rgba(13,27,42,0.48)_73%,rgba(13,27,42,0.18)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d1b2a]/80 to-transparent" />
        </div>

        <Container className="relative pb-12 pt-28 sm:pb-14 sm:pt-32 lg:pb-16 lg:pt-32 xl:pt-40">
          <div className="max-w-2xl">
            <div data-header-solid-trigger className="flex items-center gap-3"><span className="h-[3px] w-8 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f1c75b]">Our fleet</p></div>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[0.94] tracking-[-0.025em] text-white sm:text-5xl lg:text-6xl">A fleet chosen for<br /><span className="text-[#f1c75b]">every journey.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">From refined executive saloons to spacious vans, choose the vehicle that gives your journey the right balance of comfort, space and presence.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#vehicles" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-5 py-2.5 text-[12px] font-bold text-[#0d1b2a] transition hover:bg-[#e0b54a]">Explore the fleet <ArrowRight size={16} /></a>
              <ButtonLink href="/book" variant="outline" className="!border-white/45 !px-5 !py-2.5 !text-[12px] !font-bold !text-white hover:!border-white hover:!bg-white/10">Book your ride</ButtonLink>
            </div>
          </div>

          <div className="mt-8 flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/20 pt-4 sm:gap-x-8">
            {[
              { icon: Car, text: 'Executive & first class' },
              { icon: Users, text: 'Options for every group' },
              { icon: Luggage, text: 'Luggage capacity shown' },
            ].map(({ icon: Icon, text }) => <div key={text} className="flex items-center gap-2"><Icon size={15} className="text-[#f1c75b]" strokeWidth={1.8} /><p className="text-[11px] font-semibold text-white/85">{text}</p></div>)}
          </div>
        </Container>
      </section>

      <section id="vehicles" className="relative z-10 -mt-3 scroll-mt-24 sm:-mt-5">
        <Container className="pb-14 pt-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
          <div className="rounded-t-2xl border-t border-[#0d1b2a]/15 bg-[#f8f3e9] px-1 pt-7 sm:px-2 sm:pt-8">
            <div className="flex flex-col gap-5 border-b border-[#0d1b2a]/15 pb-7 md:flex-row md:items-end md:justify-between md:pb-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#40516b]">Choose your vehicle</p></div>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Comfort, matched to your plans.</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">Compare capacity and pricing, then choose the vehicle that works best for your party and luggage.</p>
              </div>
              <p className="shrink-0 text-[12px] font-medium text-slate-500"><span className="font-bold text-[#0d1b2a]">{vehicles.length}</span> {vehicles.length === 1 ? 'vehicle available' : 'vehicles available'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:mt-7 sm:flex-row sm:items-center sm:justify-between">
            <CategoryTabs active={active} />
            {active && <Link href="/fleet" className="inline-flex w-fit items-center gap-1.5 text-[11px] font-bold text-[#0d1b2a] underline underline-offset-4 transition hover:text-[#9b7012]">View all vehicles <ArrowRight size={13} /></Link>}
          </div>

          {vehicles.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[#0d1b2a]/10 bg-white px-6 py-12 text-center shadow-[0_14px_32px_-28px_rgba(13,27,42,0.52)] sm:px-10">
              <p className="font-serif text-3xl font-semibold text-[#0d1b2a]">No vehicles are available in this category.</p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">Please choose another category to explore the fleet.</p>
              <ButtonLink href="/fleet" className="mt-7 !px-6 !py-3 !text-[12px] !font-bold">View all vehicles <ArrowRight size={16} /></ButtonLink>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-9 lg:grid-cols-3 lg:gap-6">
              {vehicles.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}
            </div>
          )}

          <section className="relative mt-14 overflow-hidden rounded-2xl bg-[#0d1b2a] px-6 py-9 text-white shadow-[0_18px_38px_-24px_rgba(13,27,42,0.68)] sm:mt-20 sm:px-10 sm:py-11 lg:px-14">
            <div aria-hidden="true" className="absolute -right-8 -top-16 text-[#f1c75b]/10"><ShieldCheck size={260} strokeWidth={0.45} /></div>
            <div className="relative flex max-w-4xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#f1c75b]">Not sure which vehicle is right?</p><h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">Start with your journey.</h2><p className="mt-3 text-sm leading-relaxed text-white/75">Enter your route, party size and luggage, then view the vehicles available for your plans.</p></div>
              <ButtonLink href="/book" className="!shrink-0 !px-6 !py-3 !text-[12px] !font-bold">Find your vehicle <ArrowRight size={16} /></ButtonLink>
            </div>
          </section>
        </Container>
      </section>
    </div>
  );
}
