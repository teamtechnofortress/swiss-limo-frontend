import type { Metadata } from 'next';
import { ButtonLink, Container, Section, SectionHeading } from '@/components/ui/primitives';
import { TripCard } from '@/components/trips/TripCard';
import { getTrips } from '@/lib/trips';

export const metadata: Metadata = {
  title: 'Private trips',
  description: 'Private chauffeur-driven trips across Switzerland.',
};

type SearchParams = Promise<{ page?: string }>;

function pageFromSearchParam(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function TripsPage({ searchParams }: { searchParams: SearchParams }) {
  const { page: requestedPage } = await searchParams;
  const page = pageFromSearchParam(requestedPage);

  try {
    const trips = await getTrips({ page, perPage: 24 });
    const previousPage = trips.meta.page > 1 ? trips.meta.page - 1 : null;
    const nextPage = trips.meta.page < trips.meta.lastPage ? trips.meta.page + 1 : null;

    return (
      <Section className="pt-20 md:pt-28">
        <Container>
          <SectionHeading
            eyebrow="Private trips"
            title="Switzerland, at your own pace"
            subtitle="Your chauffeur drives, you enjoy the view. Choose a published trip or let us create one around your plans."
          />

          {trips.data.length > 0 ? (
            <>
              <div className="mt-14 grid gap-6">
                {trips.data.map((trip) => (
                  <TripCard key={trip.slug} trip={trip} variant="list" />
                ))}
              </div>
              {trips.meta.lastPage > 1 && (
                <nav className="mt-12 flex items-center justify-center gap-6" aria-label="Trip pages">
                  {previousPage ? <ButtonLink href={`/trips?page=${previousPage}`} variant="outline">Previous</ButtonLink> : <span />}
                  <span className="text-sm text-mute">Page {trips.meta.page} of {trips.meta.lastPage}</span>
                  {nextPage ? <ButtonLink href={`/trips?page=${nextPage}`} variant="outline">Next</ButtonLink> : <span />}
                </nav>
              )}
            </>
          ) : (
            <div className="mt-20 rounded-3xl border border-line bg-ink-soft p-10 text-center">
              <p className="font-serif text-3xl">No trips are available right now.</p>
              <p className="mx-auto mt-4 max-w-lg text-mute">Tell us where you would like to go and we will design the day with you.</p>
            </div>
          )}

          <div className="mt-24 text-center">
            <p className="font-serif text-3xl">Want something different?</p>
            <p className="mx-auto mt-4 max-w-lg text-mute">Tell us where you would like to go and we will design the day with you.</p>
            <div className="mt-10">
              <ButtonLink href="/contact?trip=custom" variant="outline">Ask for a custom trip</ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    );
  } catch {
    return (
      <Section className="pt-20 md:pt-28">
        <Container>
          <SectionHeading eyebrow="Private trips" title="Trips are currently unavailable" subtitle="Please try again shortly, or contact us to plan a bespoke journey." />
          <div className="mt-12">
            <ButtonLink href="/contact?trip=custom">Plan a custom trip</ButtonLink>
          </div>
        </Container>
      </Section>
    );
  }
}
