import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Luggage, Users } from 'lucide-react';
import { VehicleGallery } from '@/components/fleet/VehicleGallery';
import { ButtonLink, Card, Container, Eyebrow, GoldRule } from '@/components/ui/primitives';
import { getVehicle } from '@/lib/fleet';
import { amenityLabel, CATEGORY_LABEL, money, pricePerKm } from '@/lib/format';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  return vehicle
    ? { title: vehicle.name, description: vehicle.description ?? undefined }
    : { title: 'Vehicle not found' };
}

export default async function VehiclePage({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);

  if (!vehicle) {
    notFound();
  }

  const priced = vehicle.price_per_km !== null;

  return (
    <Container className="pb-32 pt-12 md:pt-20">
      <nav className="mb-10 text-xs uppercase tracking-[0.25em] text-mute" aria-label="Breadcrumb">
        <Link href="/fleet" className="hover:text-gold">Fleet</Link>
        <span className="mx-3 text-gold/60">/</span>
        <span className="text-ivory/70">{vehicle.name}</span>
      </nav>

      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <VehicleGallery images={vehicle.images} name={vehicle.name} />
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>{CATEGORY_LABEL[vehicle.category]}</Eyebrow>
          <h1 className="mt-5 text-5xl leading-tight md:text-6xl">{vehicle.name}</h1>
          {vehicle.model_name && <p className="mt-3 font-serif text-xl italic text-mute">{vehicle.model_name}</p>}
          <GoldRule className="my-8" />

          {vehicle.description && (
            <p className="leading-relaxed text-mute">{vehicle.description}</p>
          )}

          <div className="mt-10 grid grid-cols-2 gap-5">
            <Card className="p-6">
              <Users className="text-gold" size={20} />
              <p className="mt-4 font-serif text-3xl">{vehicle.passenger_capacity}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mute">Passengers</p>
            </Card>
            <Card className="p-6">
              <Luggage className="text-gold" size={20} />
              <p className="mt-4 font-serif text-3xl">{vehicle.luggage_capacity}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mute">Luggage</p>
            </Card>
          </div>

          <Card className="mt-6 p-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-mute">Pricing</p>
            <p className="mt-3 font-serif text-4xl text-gold">{pricePerKm(vehicle.price_per_km)}</p>
            {vehicle.minimum_fare !== null && (
              <p className="mt-2 text-sm text-mute">Minimum fare {money(vehicle.minimum_fare)}</p>
            )}
            <p className="mt-4 text-xs leading-relaxed text-mute/80">
              Your exact price, including VAT, is shown before you pay.
            </p>
          </Card>

          {vehicle.amenities.length > 0 && (
            <div className="mt-10">
              <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-mute">On board</p>
              <ul className="grid grid-cols-2 gap-3">
                {vehicle.amenities.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-ivory/80">
                    <Check size={15} className="text-gold" />
                    {amenityLabel(item)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-12">
            {priced ? (
              <ButtonLink href={`/book?vehicle=${vehicle.slug}`} className="w-full">
                Book this vehicle
              </ButtonLink>
            ) : (
              <ButtonLink href={`/contact?vehicle=${vehicle.slug}`} variant="outline" className="w-full">
                Request a price
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
