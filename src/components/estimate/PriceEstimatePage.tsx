'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowRight, Briefcase, Car, Gauge, Loader2, MapPin, Sparkles, Users } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { Container } from '@/components/ui/primitives';
import type { PriceEstimateContent } from '@/content/price-estimate';
import type { VehiclePriceEstimateResponse } from '@/lib/types';

const heroImage = '/images/limousine-price-estimator/hero.png';

function messageOf(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

function optionalInteger(value: string) {
  return value === '' ? null : Number(value);
}

export function PriceEstimatePage({ content, locale }: { content: PriceEstimateContent; locale: string }) {
  const [distance, setDistance] = useState('');
  const [passengers, setPassengers] = useState('');
  const [luggage, setLuggage] = useState('');
  const [result, setResult] = useState<VehiclePriceEstimateResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function getEstimate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const distanceKm = Number(distance);
    if (!Number.isFinite(distanceKm) || distanceKm <= 0 || distanceKm > 1_000_000) {
      setError(content.form.distanceError);
      return;
    }

    const passengerCount = optionalInteger(passengers);
    const luggageCount = optionalInteger(luggage);
    const query = new URLSearchParams({ distance_km: String(distanceKm) });
    if (passengerCount !== null) query.set('passengers', String(passengerCount));
    if (luggageCount !== null) query.set('luggage', String(luggageCount));

    setLoading(true);
    try {
      const response = await api<VehiclePriceEstimateResponse>(`/public/vehicle-price-estimates?${query.toString()}`);
      setResult(response.data);
    } catch (requestError) {
      setError(messageOf(requestError, content.form.fallbackError));
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const vehicleCount = result?.vehicles.length ?? 0;

  return (
    <div className="overflow-hidden bg-[#fbf8f2] text-[#0d1b2a]">
      <section className="relative isolate flex min-h-[340px] items-center bg-[#071e32] text-white sm:min-h-[360px] md:h-[450px] xl:h-[470px]">
        <div className="absolute inset-0" role="img" aria-label={content.hero.imageAlt}>
          <Image src={heroImage} alt="" fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,30,50,.97)_0%,rgba(7,30,50,.86)_42%,rgba(7,30,50,.35)_72%,rgba(7,30,50,.2)_100%)] max-md:bg-[linear-gradient(180deg,rgba(7,30,50,.94)_0%,rgba(7,30,50,.76)_100%)]" />
        </div>
        <Container className="relative w-full max-w-[1240px] pt-16 sm:pt-20 xl:pt-16">
          <div className="max-w-2xl">
            <p data-header-solid-trigger className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.22em] text-white/90"><span className="h-[2px] w-8 bg-[#f1c75b]" />{content.hero.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl font-serif text-[2.5rem] font-bold leading-[.98] tracking-[-.02em] sm:text-[3.25rem] lg:text-[3.7rem]">
              {content.hero.titleBefore} <span className="text-[#f1c75b]">{content.hero.titleHighlight}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-white/90 sm:text-[15px]">{content.hero.description}</p>
          </div>
        </Container>
      </section>

      <section className="relative z-10 -mt-12 pb-14 sm:-mt-16 sm:pb-16 md:-mt-[72px]">
        <Container className="max-w-[1240px]">
          <form onSubmit={getEstimate} className="rounded-3xl bg-white p-5 shadow-[0_24px_60px_-30px_rgba(7,30,50,.55)] sm:p-7">
            <div className="flex flex-col gap-2 border-b border-[#0d1b2a]/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#a06b09]"><Gauge size={15} /> {content.form.title}</p>
                <p className="mt-1 text-[13px] font-medium text-slate-600">{content.form.description}</p>
              </div>
              <p className="text-[11px] font-semibold text-slate-500"><span className="text-[#a06b09]">*</span> {content.form.distanceHint}</p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.14em] text-[#0d1b2a]">{content.form.distance} <span className="text-[#a06b09]">*</span></span>
                <div className="relative"><Gauge size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a06b09]" /><input type="number" inputMode="decimal" min="0.1" max="1000000" step="0.1" value={distance} onChange={(event) => setDistance(event.target.value)} placeholder={content.form.distancePlaceholder} required className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-14 text-sm font-semibold text-[#0d1b2a] outline-none transition placeholder:text-slate-400 focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/20" /><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase text-slate-500">km</span></div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.14em] text-[#0d1b2a]">{content.form.passengers} <span className="font-medium normal-case tracking-normal text-slate-400">({content.form.optional})</span></span>
                <div className="relative"><Users size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a06b09]" /><select value={passengers} onChange={(event) => setPassengers(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold text-[#0d1b2a] outline-none transition focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/20"><option value="">{content.form.passengersHint}</option>{Array.from({ length: 99 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}</option>)}</select></div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.14em] text-[#0d1b2a]">{content.form.luggage} <span className="font-medium normal-case tracking-normal text-slate-400">({content.form.optional})</span></span>
                <div className="relative"><Briefcase size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a06b09]" /><select value={luggage} onChange={(event) => setLuggage(event.target.value)} className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold text-[#0d1b2a] outline-none transition focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/20"><option value="">{content.form.luggageHint}</option>{Array.from({ length: 100 }, (_, index) => index).map((count) => <option key={count} value={count}>{count}</option>)}</select></div>
              </label>
              <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-6 text-[13px] font-bold text-[#0d1b2a] transition hover:bg-[#e6b941] disabled:cursor-wait disabled:opacity-60">{loading ? <Loader2 size={17} className="animate-spin" /> : <Car size={17} />}{loading ? content.form.loading : content.form.submit}</button>
            </div>
            {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
          </form>
        </Container>
      </section>

      <section className="pb-16 sm:pb-20">
        <Container className="grid max-w-[1240px] gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div><p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#a06b09]"><span className="h-[2px] w-7 bg-[#f1c75b]" />{content.results.eyebrow}</p><h2 className="mt-2 font-serif text-[2rem] font-bold leading-tight sm:text-[2.35rem]">{content.results.title}</h2><p className="mt-2 max-w-2xl text-[14px] font-medium leading-relaxed text-slate-600">{content.results.description}</p></div>
              {result && <p className="rounded-full bg-[#f1c75b]/20 px-3 py-1.5 text-[12px] font-bold text-[#785000]">{content.results.vehicleCount.replace('{count}', String(vehicleCount))}</p>}
            </div>

            {!result && !loading && !error && <EmptyState icon={<Sparkles size={26} />} title={content.results.waitingTitle} description={content.results.waitingDescription} />}
            {loading && <EmptyState icon={<Loader2 size={26} className="animate-spin" />} title={content.form.loading} description={content.results.description} />}
            {result && vehicleCount === 0 && <EmptyState icon={<Car size={26} />} title={content.results.noResultsTitle} description={content.results.noResultsDescription} />}

            {result && vehicleCount > 0 && <div className="mt-6 space-y-4">
              {result.vehicles.map((vehicle) => (
                <article key={vehicle.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_36px_-26px_rgba(13,27,42,.6)] transition hover:shadow-[0_20px_42px_-24px_rgba(13,27,42,.65)] sm:flex">
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#efe9dc] sm:w-52"><img src={vehicle.thumbnail_url ?? '/images/fleet/listinghero.png'} alt={vehicle.name} className="h-full w-full object-cover" /><span className="absolute left-3 top-3 rounded-full bg-[#071e32]/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-white">{vehicle.category.name}</span></div>
                  <div className="flex min-w-0 flex-1 flex-col p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a06b09]">{content.results.category}</p><h3 className="mt-1 font-serif text-2xl font-bold leading-tight">{vehicle.name}</h3><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] font-semibold text-slate-600"><span className="inline-flex items-center gap-1.5"><Users size={15} className="text-[#a06b09]" />{content.results.seats.replace('{count}', String(vehicle.capacity.passengers))}</span><span className="inline-flex items-center gap-1.5"><Briefcase size={15} className="text-[#a06b09]" />{content.results.bags.replace('{count}', String(vehicle.capacity.luggage))}</span></div></div><div className="shrink-0 rounded-xl bg-[#fff8e8] px-4 py-3 sm:text-right"><p className="text-[9px] font-bold uppercase tracking-[.13em] text-[#8a6109]">{content.results.estimatedFare}</p><p className="mt-1 text-2xl font-bold tracking-tight text-[#0d1b2a]">{vehicle.formatted_amount}</p></div></div><div className="mt-4 flex flex-col gap-3 border-t border-[#0d1b2a]/10 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-[11px] font-medium leading-snug text-slate-500">{content.results.estimateNote}</p><Link href={`/${locale}/book?vehicle=${encodeURIComponent(vehicle.slug)}`} className="inline-flex shrink-0 items-center justify-center gap-1.5 text-[12px] font-bold text-[#9a6700] transition hover:text-[#0d1b2a]">{content.results.bookVehicle} <ArrowRight size={15} /></Link></div></div>
                </article>
              ))}
            </div>}
          </div>

          <aside className="rounded-3xl bg-[#071e32] p-6 text-white shadow-[0_24px_50px_-30px_rgba(7,30,50,.85)] lg:sticky lg:top-24">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#f1c75b]"><MapPin size={15} />{content.customQuote.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">{content.customQuote.title}</h2>
            <p className="mt-3 text-[14px] font-medium leading-relaxed text-white/80">{content.customQuote.description}</p>
            <Link href={`/${locale}/contact`} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-5 text-[13px] font-bold text-[#0d1b2a] transition hover:bg-[#e6b941]">{content.customQuote.action} <ArrowRight size={16} /></Link>
            <p className="mt-4 border-t border-white/10 pt-4 text-[11px] font-medium leading-relaxed text-white/65">{content.customQuote.reassurance}</p>
          </aside>
        </Container>
      </section>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#0d1b2a]/20 bg-white px-6 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1c75b]/20 text-[#9a6700]">{icon}</span><h3 className="mt-4 font-serif text-2xl font-bold">{title}</h3><p className="mt-2 max-w-md text-[13px] font-medium leading-relaxed text-slate-600">{description}</p></div>;
}
