import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Accessibility, Armchair, ArrowRight, Baby, BatteryCharging, GlassWater, Check, EyeOff, Luggage, MessageCircle, Snowflake, Users, Wifi, Wine } from 'lucide-react';
import { VehicleGallery } from '@/components/fleet/VehicleGallery';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { getVehicle } from '@/lib/fleet';
import { amenityLabel, CATEGORY_LABEL, vehiclePriceSummary } from '@/lib/format';

type Params = Promise<{ slug: string }>;

function amenityIcon(amenity: string) {
  const key = amenity.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (key.includes('child') || key.includes('baby')) return Baby;
  if (key.includes('climate') || key.includes('airconditioning')) return Snowflake;
  if (key.includes('leather')) return Armchair;
  if (key.includes('wifi')) return Wifi;
  if (key.includes('water')) return GlassWater;
  if (key.includes('charg')) return BatteryCharging;
  if (key.includes('privacy')) return EyeOff;
  if (key.includes('wheelchair')) return Accessibility;
  if (key.includes('champagne')) return Wine;
  return Check;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  return vehicle ? { title: vehicle.name, description: vehicle.description ?? undefined } : { title: 'Vehicle not found' };
}

export default async function VehiclePage({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) notFound();
  const priceOnRequest = vehicle.price_on_request;
  const price = vehiclePriceSummary(vehicle);
  const enquiryUrl = `/contact?type=vehicle&vehicle=${encodeURIComponent(vehicle.slug)}`;
  const category = CATEGORY_LABEL[vehicle.category] ?? vehicle.category;

  return (
    <div className="min-h-screen bg-[#f8f3e9] text-[#0d1b2a]">
      <Container className="py-9 sm:py-11 lg:pb-16">
        <header className="mb-7 max-w-3xl sm:mb-9">
          <div className="flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#986b00]">{category}</p></div>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[0.95] tracking-[-0.025em] sm:text-5xl lg:text-6xl">{vehicle.name}</h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-[#40516b] sm:text-base">{vehicle.model_name ?? 'Private chauffeur travel for airport transfers, business trips and personal journeys.'}</p>
        </header>
        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(20rem,1fr)] lg:gap-7">
          <div className="min-w-0"><VehicleGallery media={vehicle.media} legacyImages={vehicle.images} name={vehicle.name} /></div>
          <section aria-label="Vehicle pricing and booking" className="rounded-3xl border border-[#0d1b2a]/10 bg-[#fffdf9] p-5 shadow-[0_20px_38px_-26px_rgba(13,27,42,0.52)] sm:p-6">
            <span className="inline-block rounded-full bg-[#fbe8ac] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#0d1b2a]">{category}</span>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-[0.98] tracking-[-0.02em]">Book your ride</h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">Your chauffeur, vehicle and final route price are confirmed before payment.</p>
            <div className="mt-5 rounded-2xl border border-[#e9d69f] bg-[#fff8e7] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8f6717]">{price.eyebrow}</p>
              <p className="mt-1 font-serif text-4xl font-semibold leading-none tracking-[-0.025em] text-[#0d1b2a]">{price.price}</p>
              {price.detail && <p className="mt-2 text-xs font-semibold leading-snug text-[#705621]">{price.detail}</p>}
            </div>
            <div className="my-5 grid grid-cols-2 divide-x divide-[#0d1b2a]/10 border-y border-[#0d1b2a]/10 py-4">
              <div className="flex items-center gap-2.5 pr-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f8f0dd] text-[#986b00]"><Users size={19} aria-hidden="true" /></span><p className="text-xs font-semibold leading-snug">Up to {vehicle.passenger_capacity}<span className="block text-[10px] font-medium text-slate-500">passengers</span></p></div>
              <div className="flex items-center gap-2.5 pl-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f8f0dd] text-[#986b00]"><Luggage size={19} aria-hidden="true" /></span><p className="text-xs font-semibold leading-snug">Up to {vehicle.luggage_capacity}<span className="block text-[10px] font-medium text-slate-500">bags</span></p></div>
            </div>
            <ButtonLink href={priceOnRequest ? enquiryUrl : `/book?vehicle=${vehicle.slug}`} className="w-full !rounded-xl !py-3.5 !text-sm !font-bold">{priceOnRequest ? 'Request a quote' : 'Book now'} <ArrowRight size={17} aria-hidden="true" /></ButtonLink>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-[#40516b]">Final pricing, including VAT, is shown with your route and travel details before payment.</p>
            <Link href={enquiryUrl} className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#0d1b2a]/20 px-4 py-3 text-xs font-bold transition hover:border-[#0d1b2a]/50 hover:bg-[#f8f3e9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d1b2a]">Enquire now <ArrowRight size={15} aria-hidden="true" /></Link>
          </section>
          {(vehicle.description || vehicle.amenities.length > 0) && (
            <section className="rounded-3xl border border-[#0d1b2a]/10 bg-[#fffdf9] p-5 shadow-[0_20px_38px_-30px_rgba(13,27,42,0.36)] sm:p-6 lg:self-stretch">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#986b00]">On-board comfort</p>
              {vehicle.description && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{vehicle.description}</p>}
              {vehicle.amenities.length > 0 && (
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {vehicle.amenities.map((item) => {
                    const Icon = amenityIcon(item);
                    return (
                      <li key={item} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-2 py-2 text-sm shadow-sm">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff8df]">
                          <Icon size={22} strokeWidth={1.8} className="text-[#d99b00]" aria-hidden="true" />
                        </span>
                        {amenityLabel(item)}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          )}
          <section className="rounded-3xl bg-[#0d1b2a] p-5 text-white shadow-[0_20px_38px_-30px_rgba(13,27,42,0.6)] sm:p-6 lg:col-start-2 lg:self-stretch">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1c75b]">Concierge service</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-[0.98] md:text-4xl">Need help choosing?</h2>
            <div className="mt-4 flex items-start gap-4">
              <MessageCircle size={30} className="shrink-0 text-[#f1c75b]" aria-hidden="true" />
              <div className="min-w-0 border-l border-white/35 pl-4"><p className="text-sm leading-relaxed text-white/90">Not sure if {vehicle.name} is right for your trip? Our team can help you choose.</p>
                <Link href={enquiryUrl} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#f1c75b] underline underline-offset-4 hover:text-white">Contact our team <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
