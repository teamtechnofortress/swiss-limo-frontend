import { redirect } from 'next/navigation';

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const query = typeof category === 'string' ? `?category=${encodeURIComponent(category)}` : '';

  redirect(`/en/fleet${query}`);
}
