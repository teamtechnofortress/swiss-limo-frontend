import type { Metadata } from 'next';
import { VehicleCard } from '@/components/fleet/VehicleCard';
import { CategoryTabs } from '@/components/fleet/CategoryTabs';
import { Container } from '@/components/ui/primitives';
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
  const active = CATEGORIES.find((c) => c === category) ?? '';
  const vehicles = await getVehicles(active || undefined);

  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-20 text-[#0d1b2a] md:pb-28">
      <Container className="pt-14 md:pt-20">
        <section className="max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[3px] w-7 bg-[#f1c75b]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#40516b]">Our fleet</p>
          </div>
          <h1 className="font-serif text-4xl font-bold leading-[1.02] text-[#0d1b2a] md:text-5xl">Our Luxury Fleet</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">Travel in comfort with a carefully selected fleet of executive saloons and spacious vans, maintained to an exceptional standard.</p>
        </section>

        <div className="mt-10 flex flex-col gap-4 border-y border-slate-200 py-5 md:mt-12 md:flex-row md:items-center md:justify-between">
          <CategoryTabs active={active} />
          <p className="text-[12px] font-medium text-slate-500"><span className="font-bold text-[#0d1b2a]">{vehicles.length}</span> {vehicles.length === 1 ? 'vehicle' : 'vehicles'} available</p>
        </div>

        {vehicles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-3xl font-bold text-[#0d1b2a]">No vehicles available in this category</p>
            <p className="mt-3 text-sm text-slate-500">Please select another category to view our fleet.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
