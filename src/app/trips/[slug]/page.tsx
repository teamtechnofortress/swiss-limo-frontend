import { redirect } from 'next/navigation';

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/en/trips/${encodeURIComponent(slug)}`);
}
