import { redirect } from 'next/navigation';

export default async function TripBookingRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/en/trips/${encodeURIComponent(slug)}/book`);
}
