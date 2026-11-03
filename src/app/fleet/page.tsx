import type { Metadata } from 'next';
import { VehicleCard } from '@/components/fleet/VehicleCard';
import { CategoryTabs } from '@/components/fleet/CategoryTabs';
import { Container, Section, SectionHeading } from '@/components/ui/primitives';
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
    <Section className="pt-20 md:pt-28">
      <Container>
        <SectionHeading
          eyebrow="The fleet"
          title="Choose the car that fits your journey"
          subtitle="Every vehicle is immaculately kept and driven by a professional chauffeur. Prices are per kilometre, with a minimum fare for shorter trips."
        />

        <div className="mt-14">
          <CategoryTabs active={active} />
        </div>

        {vehicles.length === 0 ? (
          <p className="mt-20 text-mute">No vehicles are available in this category right now.</p>
        ) : (
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
