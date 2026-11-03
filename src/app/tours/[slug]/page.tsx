import { redirect } from 'next/navigation';

type Params = Promise<{ slug: string }>;

/** Legacy URL retained for existing links and bookmarks. */
export default async function TourPage({ params }: { params: Params }) {
  const { slug } = await params;
  redirect(`/trips/${encodeURIComponent(slug)}`);
}
