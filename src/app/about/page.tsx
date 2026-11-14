import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Car, Clock3, Luggage, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

export async function generateMetadata(): Promise<Metadata> {
  const publicConfig = await getPublicConfig().catch(() => fallbackPublicConfig());

  return {
    title: 'About us',
    description: `Learn about ${publicConfig.site.name}, private chauffeur journeys planned with care and discretion.`,
  };
}

export default async function AboutPage() {
  const publicConfig = await getPublicConfig().catch(() => fallbackPublicConfig());
  const siteName = publicConfig.site.name;

  return (
    <div className="overflow-hidden bg-[#f8f3e9] text-[#0d1b2a]">
      <section className="relative isolate overflow-hidden bg-[#0d1b2a] text-white">
        <div aria-hidden="true" className="absolute inset-0">
          <img src="/images/home/hero2.jpeg" alt="" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,42,0.98)_0%,rgba(13,27,42,0.91)_43%,rgba(13,27,42,0.48)_73%,rgba(13,27,42,0.25)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0d1b2a]/80 to-transparent" />
        </div>

        <Container className="relative py-12 sm:py-14 lg:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-[3px] w-8 bg-[#f1c75b]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f1c75b]">About {siteName}</p>
            </div>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[0.94] tracking-[-0.025em] text-white sm:text-5xl lg:text-6xl">
              Service that feels<br />
              <span className="text-[#f1c75b]">effortless.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              We create private chauffeur journeys with thoughtful planning, calm professionalism and genuine attention to the details that make travel feel easy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/book" className="!px-5 !py-2.5 !text-[12px] !font-bold">Book your ride <ArrowRight size={16} /></ButtonLink>
              <ButtonLink href="/fleet" variant="outline" className="!border-white/45 !px-5 !py-2.5 !text-[12px] !font-bold !text-white hover:!border-white hover:!bg-white/10">Explore the fleet</ButtonLink>
            </div>
          </div>

          <div className="mt-8 flex max-w-3xl flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/20 pt-4 sm:gap-x-8">
            {[
              { icon: ShieldCheck, text: 'Discreet, professional service' },
              { icon: Clock3, text: 'Careful journey planning' },
              { icon: Car, text: 'Comfort-led travel' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2"><Icon size={15} className="text-[#f1c75b]" strokeWidth={1.8} /><p className="text-[11px] font-semibold text-white/85">{text}</p></div>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-3 sm:-mt-5">
        <Container className="pb-14 pt-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12">
          <div className="grid items-center gap-9 rounded-t-2xl border-t border-[#0d1b2a]/15 bg-[#f8f3e9] px-1 pt-7 sm:px-2 sm:pt-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.95fr)] lg:gap-14">
            <div>
              <div className="flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#40516b]">The way we work</p></div>
              <h2 className="mt-3 max-w-xl font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Every detail has a purpose.</h2>
              <div className="mt-5 max-w-xl space-y-4 text-sm leading-relaxed text-slate-600">
                <p>{siteName} provides private transfers, airport journeys and personalised day trips for travellers who value time, comfort and peace of mind.</p>
                <p>We consider the route, timing, luggage and the small practical details before your journey begins—so you can settle in and simply enjoy where you are going.</p>
                <p>Our pricing is clear before you book, with VAT included where it applies and a choice of secure online payment or payment to your chauffeur on arrival.</p>
              </div>
              <Link href="/contact" className="mt-7 inline-flex items-center gap-2 text-[12px] font-bold text-[#0d1b2a] transition hover:text-[#9b7012]">Speak with our team <ArrowRight size={15} /></Link>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#0d1b2a]/10 bg-white p-2 shadow-[0_18px_38px_-26px_rgba(13,27,42,0.52)]">
              <img src="/images/home/service-chauffeur.jpg" alt="Professional chauffeur beside a premium vehicle" className="aspect-[4/3] w-full rounded-xl object-cover" />
              <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/20 bg-[#0d1b2a]/92 px-4 py-3 text-white backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#f1c75b]">A considered experience</p>
                <p className="mt-1 text-[12px] font-semibold leading-relaxed text-white/85">From the first booking detail to the final drop-off.</p>
              </div>
            </div>
          </div>

          <section className="mt-14 sm:mt-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#40516b]">What matters to us</p></div>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Comfort, clarity and care.</h2>
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-3 lg:mt-8 lg:gap-5">
              {[
                { icon: MapPin, title: 'Planned around you', text: 'Your route, timing and travel preferences are considered before the day begins.' },
                { icon: Luggage, title: 'Comfort in the details', text: 'We plan around passengers, luggage and the practical needs of your journey.' },
                { icon: ShieldCheck, title: 'Clear from the start', text: 'You see your pricing before booking, with straightforward payment options.' },
              ].map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-[#0d1b2a]/10 bg-white p-5 shadow-[0_14px_32px_-28px_rgba(13,27,42,0.52)] sm:p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1c75b]/20 text-[#9b7012]"><Icon size={19} strokeWidth={1.7} /></span>
                  <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight text-[#0d1b2a]">{title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="relative mt-14 overflow-hidden rounded-2xl bg-[#0d1b2a] px-6 py-9 text-white shadow-[0_18px_38px_-24px_rgba(13,27,42,0.68)] sm:mt-20 sm:px-10 sm:py-11 lg:px-14">
            <div aria-hidden="true" className="absolute -right-8 -top-16 text-[#f1c75b]/10"><Sparkles size={260} strokeWidth={0.45} /></div>
            <div className="relative flex max-w-4xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#f1c75b]">Your next journey</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight sm:text-4xl">Ready when you are.</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/75">Book your transfer online, or contact our team to plan something more personal.</p>
              </div>
              <ButtonLink href="/book" className="!shrink-0 !px-6 !py-3 !text-[12px] !font-bold">Plan your journey <ArrowRight size={16} /></ButtonLink>
            </div>
          </section>
        </Container>
      </section>
    </div>
  );
}
