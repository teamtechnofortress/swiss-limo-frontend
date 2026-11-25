import { redirect } from 'next/navigation';

export default async function VehicleDetailRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/en/fleet/${encodeURIComponent(slug)}`);
}
