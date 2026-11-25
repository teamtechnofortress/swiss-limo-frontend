import { redirect } from 'next/navigation';

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const query = typeof page === 'string' ? `?page=${encodeURIComponent(page)}` : '';

  redirect(`/en/trips${query}`);
}
