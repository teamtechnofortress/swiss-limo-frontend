import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Accessibility, Armchair, ArrowRight, Baby, BatteryCharging, GlassWater, Check, EyeOff, Luggage, MessageCircle, Snowflake, Users, Wifi, Wine } from 'lucide-react';
import { VehicleGallery } from '@/components/fleet/VehicleGallery';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { getVehicle } from '@/lib/fleet';
import { amenityLabel, CATEGORY_LABEL, money } from '@/lib/format';

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
  const priced = vehicle.price_per_km !== null;
  const enquiryUrl = `/contact?type=vehicle&vehicle=${encodeURIComponent(vehicle.slug)}`;
  const category = CATEGORY_LABEL[vehicle.category] ?? vehicle.category;

  return (
    <div className="bg-[#f5f7fa] text-[#0d1b2a]">
      <Container className="py-6 md:py-8 lg:pb-12">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#986b00]">{category}</p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{vehicle.name}</h1>
          <p className="mt-2 text-sm text-slate-600 md:text-base">{vehicle.model_name ?? 'Private chauffeur travel for airport transfers, business trips and personal journeys.'}</p>
        </header>
        <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <div className="min-w-0"><VehicleGallery media={vehicle.media} legacyImages={vehicle.images} name={vehicle.name} /></div>
          <section aria-label="Vehicle pricing and booking" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_12px_32px_-10px_rgba(8,42,72,0.28)] sm:p-6">
            <span className="inline-block rounded-lg bg-[#fbe8ac] px-3 py-1 text-[11px] font-bold uppercase tracking-wider">{category}</span>
            <h2 className="mt-3 text-2xl font-semibold leading-tight md:text-3xl">Your journey, in comfort</h2>
            <div className="mt-4">
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-sans text-3xl font-bold tracking-tight text-[#986b00]">{priced ? money(vehicle.price_per_km!) : 'Price on request'}</span>
                {priced && <span className="text-sm text-slate-600">per km</span>}
              </p>
              {vehicle.minimum_fare !== null && <p className="mt-1 text-sm text-slate-600">Minimum fare {money(vehicle.minimum_fare)}</p>}
            </div>
            <div className="my-5 grid grid-cols-2 divide-x divide-gray-200 border-y border-gray-200 py-4">
              <div className="flex items-center gap-2 pr-2"><Users size={24} className="shrink-0 text-[#986b00]" aria-hidden="true" /><p className="text-sm leading-snug">Up to {vehicle.passenger_capacity}<span className="block text-xs text-slate-600">passengers</span></p></div>
              <div className="flex items-center gap-2 pl-3"><Luggage size={24} className="shrink-0 text-[#986b00]" aria-hidden="true" /><p className="text-sm leading-snug">Up to {vehicle.luggage_capacity}<span className="block text-xs text-slate-600">bags</span></p></div>
            </div>
            <ButtonLink href={priced ? `/book?vehicle=${vehicle.slug}` : enquiryUrl} className="w-full !rounded-xl !font-bold">{priced ? 'Book this vehicle' : 'Request a price'} <ArrowRight size={17} aria-hidden="true" /></ButtonLink>
            <p className="mt-3 text-center text-xs leading-relaxed text-slate-600">Your final price, including VAT, is shown with your route and travel details before payment.</p>
            <Link href={enquiryUrl} className="mt-4 flex w-full items-center justify-center rounded-xl border border-[#0d1b2a]/40 px-4 py-3 text-sm font-semibold transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d1b2a]">Contact us</Link>
          </section>
          {(vehicle.description || vehicle.amenities.length > 0) && (
            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_12px_32px_-10px_rgba(8,42,72,0.28)] lg:self-stretch">
              <h2 className="text-2xl font-semibold md:text-3xl">On-board comfort</h2>
              {vehicle.description && <p className="mt-1 whitespace-pre-line text-sm leading-snug text-slate-600">{vehicle.description}</p>}
              {vehicle.amenities.length > 0 && (
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
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
          <section className="rounded-2xl bg-[#082a48] p-5 text-white shadow-sm sm:p-6 lg:col-start-2 lg:self-stretch">
            <h2 className="text-2xl font-semibold md:text-3xl">Need help choosing?</h2>
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
