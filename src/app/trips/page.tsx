import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Compass, MapPin, Route, Sparkles } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { TripCard } from '@/components/trips/TripCard';
import { getTrips } from '@/lib/trips';

export const metadata: Metadata = {
  title: 'Day trips & tours',
  description: 'Private chauffeur-driven day trips, tours and tailored journeys across Europe.',
};

type SearchParams = Promise<{ page?: string }>;

function pageFromSearchParam(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function TripsPage({ searchParams }: { searchParams: SearchParams }) {
  const { page: requestedPage } = await searchParams;
  const page = pageFromSearchParam(requestedPage);
  const trips = await getTrips({ page, perPage: 24 }).catch(() => null);
  // This listing has its own art direction; it does not inherit an arbitrary trip cover.
  const heroImage = '/images/trips/listinghero.jpeg';
  const previousPage = trips && trips.meta.page > 1 ? trips.meta.page - 1 : null;
  const nextPage = trips && trips.meta.page < trips.meta.lastPage ? trips.meta.page + 1 : null;

  return (
    <div className="overflow-hidden bg-[#f8f3e9] text-[#0d1b2a]">
      <section className="relative isolate overflow-hidden bg-[#0d1b2a] text-white">
        <div aria-hidden="true" className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,42,0.98)_0%,rgba(13,27,42,0.92)_42%,rgba(13,27,42,-0.5)_72%,rgba(13,27,42,0.2)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d1b2a]/80 to-transparent" />
        </div>

        <Container className="relative py-11 sm:py-12 lg:py-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-8 bg-[#f1c75b]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f1c75b]">Private day trips &amp; tours</p>
            </div>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[0.94] tracking-[-0.025em] text-white sm:text-5xl lg:text-6xl">
              Your journey,<br />
              <span className="text-[#f1c75b]">your way.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Explore the places you care about, from iconic cities to alpine landscapes and cross-border escapes. Your private chauffeur takes care of the road while you enjoy the day your way.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#journeys" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-5 py-2.5 text-[12px] font-bold text-[#0d1b2a] transition hover:bg-[#e0b54a]">
                Explore our journeys <ArrowRight size={16} />
              </a>
              <ButtonLink href="/contact?trip=custom" variant="outline" className="!border-white/45 !px-5 !py-2.5 !text-[12px] !font-bold !text-white hover:!border-white hover:!bg-white/10">
                Plan a custom day
              </ButtonLink>
            </div>
          </div>

          <div className="mt-7 flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/20 pt-4 sm:gap-x-8">
            {[
              { icon: MapPin, title: 'Private chauffeur' },
              { icon: Compass, title: 'Flexible itinerary' },
              { icon: CalendarDays, title: 'Tailored planning' },
            ].map(({ icon: Icon, title }) => (
              <div key={title} className="flex items-center gap-2">
                <Icon size={15} className="text-[#f1c75b]" strokeWidth={1.8} />
                <p className="text-[11px] font-semibold text-white/85">{title}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <main id="journeys" className="relative z-10 -mt-3 scroll-mt-24 sm:-mt-5">
        <Container className="pb-14 pt-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
          <div className="rounded-t-2xl border-t border-[#0d1b2a]/15 bg-[#f8f3e9] px-1 pt-7 sm:px-2 sm:pt-8">
            <div className="flex flex-col gap-4 border-b border-[#0d1b2a]/15 pb-7 sm:flex-row sm:items-end sm:justify-between sm:pb-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="h-[3px] w-7 bg-[#f1c75b]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#40516b]">Curated journeys</p>
                </div>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Find the journey that fits your day.</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">Explore our private experiences, then personalise the route and details with our team.</p>
              </div>
              {trips && trips.data.length > 0 && (
                <p className="shrink-0 text-[12px] font-medium text-slate-500"><span className="font-bold text-[#0d1b2a]">{trips.meta.total}</span> {trips.meta.total === 1 ? 'journey available' : 'journeys available'}</p>
              )}
            </div>
          </div>

          {!trips ? (
            <div className="mt-10 rounded-2xl border border-[#0d1b2a]/15 bg-white px-6 py-12 text-center shadow-[0_14px_35px_-28px_rgba(13,27,42,0.55)] sm:px-10">
              <p className="font-serif text-3xl font-semibold text-[#0d1b2a]">Journeys are currently unavailable.</p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">Our team can still help you arrange a private day around your plans.</p>
              <ButtonLink href="/contact?trip=custom" className="mt-7 !px-6 !py-3 !text-[12px] !font-bold">Plan a custom trip <ArrowRight size={16} /></ButtonLink>
            </div>
          ) : trips.data.length > 0 ? (
            <>
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6">
                {trips.data.map((trip) => <TripCard key={trip.slug} trip={trip} />)}
              </div>

              {trips.meta.lastPage > 1 && (
                <nav className="mt-12 flex items-center justify-center gap-4 sm:gap-6" aria-label="Trip pages">
                  {previousPage ? <ButtonLink href={`/trips?page=${previousPage}`} variant="outline" className="!border-[#0d1b2a]/25 !px-5 !py-2.5 !text-[12px] !font-bold !text-[#0d1b2a] hover:!border-[#0d1b2a] hover:!bg-[#0d1b2a]/5">Previous</ButtonLink> : <span className="w-[93px]" />}
                  <span className="text-[12px] font-medium text-slate-500">Page {trips.meta.page} of {trips.meta.lastPage}</span>
                  {nextPage ? <ButtonLink href={`/trips?page=${nextPage}`} variant="outline" className="!border-[#0d1b2a]/25 !px-5 !py-2.5 !text-[12px] !font-bold !text-[#0d1b2a] hover:!border-[#0d1b2a] hover:!bg-[#0d1b2a]/5">Next</ButtonLink> : <span className="w-[93px]" />}
                </nav>
              )}
            </>
          ) : (
            <div className="mt-10 rounded-2xl border border-[#0d1b2a]/15 bg-white px-6 py-12 text-center shadow-[0_14px_35px_-28px_rgba(13,27,42,0.55)] sm:px-10">
              <p className="font-serif text-3xl font-semibold text-[#0d1b2a]">More journeys are on their way.</p>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">Tell us where you would like to go and we will create a private journey around your plans.</p>
              <ButtonLink href="/contact?trip=custom" className="mt-7 !px-6 !py-3 !text-[12px] !font-bold">Ask for a custom trip <ArrowRight size={16} /></ButtonLink>
            </div>
          )}

          <section className="relative mt-14 overflow-hidden rounded-2xl bg-[#0d1b2a] px-6 py-9 text-white shadow-[0_18px_38px_-24px_rgba(13,27,42,0.68)] sm:mt-20 sm:px-10 sm:py-11 lg:px-14">
            <div aria-hidden="true" className="absolute -right-8 -top-16 text-[#f1c75b]/10"><Route size={270} strokeWidth={0.45} /></div>
            <div className="relative flex max-w-4xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3"><Sparkles size={16} className="text-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#f1c75b]">A day designed around you</p></div>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">Have somewhere else in mind?</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/75">Share your plans and we’ll help arrange a private journey that suits your timing, interests and group.</p>
              </div>
              <Link href="/contact?trip=custom" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-6 py-3 text-[12px] font-bold text-[#0d1b2a] transition hover:bg-[#e0b54a]">
                Start planning <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
