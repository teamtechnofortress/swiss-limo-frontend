import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Images } from 'lucide-react';
import { ButtonLink, Container, Eyebrow, GoldRule, ImagePlaceholder } from '@/components/ui/primitives';
import { getTripDetail } from '@/lib/trips';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const trip = await getTripDetail(slug);
    return trip ? { title: trip.title, description: trip.summary } : { title: 'Trip not found' };
  } catch {
    return { title: 'Private trips' };
  }
}

export default async function TripPage({ params }: { params: Params }) {
  const { slug } = await params;
  let trip;

  try {
    trip = await getTripDetail(slug);
  } catch {
    notFound();
  }

  if (!trip) notFound();

  const gallery = trip.gallery.slice(0, 3);
  const hasGallery = gallery.length > 0;

  return (
    <Container className="pb-32 pt-12 md:pt-20">
      <nav className="mb-10 text-xs uppercase tracking-[0.25em] text-mute" aria-label="Breadcrumb">
        <Link href="/trips" className="hover:text-gold">Trips</Link>
        <span className="mx-3 text-gold/60">/</span>
        <span className="text-ivory/70">{trip.title}</span>
      </nav>

      <header className="max-w-5xl">
        <Eyebrow>{trip.region}</Eyebrow>
        <h1 className="mt-5 text-5xl leading-[0.94] md:text-7xl">{trip.title}</h1>
        <p className="mt-7 max-w-3xl text-xl leading-relaxed text-ivory/80 md:text-2xl">{trip.subtitle}</p>
      </header>

      <section className="mt-12" aria-label={`${trip.title} photo gallery`}>
        {hasGallery ? (
          <div className="grid gap-3 lg:grid-cols-12 lg:h-[34rem]">
            <figure className="relative overflow-hidden rounded-3xl border border-line lg:col-span-7">
              {trip.coverUrl ? (
                // External trip images are managed by the API, so a native image avoids a fixed host allow-list.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={trip.coverUrl} alt={trip.title} className="aspect-[16/10] h-full w-full object-cover" />
              ) : (
                <ImagePlaceholder label={trip.title} className="aspect-[16/10] h-full w-full" />
              )}
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/70 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-ivory/80 backdrop-blur">
                <Images size={14} className="text-gold" /> {gallery.length + 1} moments
              </span>
            </figure>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2 lg:grid-rows-2">
              {gallery.map((image, index) => {
                const layoutClass =
                  gallery.length === 1
                    ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2'
                    : gallery.length === 2 || index === 0
                      ? 'sm:col-span-2 lg:col-span-2'
                      : '';
                return (
                  <figure
                    key={image.id}
                    className={`overflow-hidden rounded-2xl border border-line ${layoutClass}`}
                  >
                    {/* External gallery images are managed by the API, so a native image avoids a fixed host allow-list. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt={`${trip.title} memory ${index + 1}`} className="aspect-[4/3] h-full w-full object-cover transition duration-700 hover:scale-105" />
                  </figure>
                );
              })}
            </div>
          </div>
        ) : (
          <figure className="relative overflow-hidden rounded-3xl border border-line">
            {trip.coverUrl ? (
              // External trip images are managed by the API, so a native image avoids a fixed host allow-list.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={trip.coverUrl} alt={trip.title} className="aspect-[21/8] w-full object-cover" />
            ) : (
              <ImagePlaceholder label={trip.title} className="aspect-[21/8] w-full" />
            )}
          </figure>
        )}
      </section>

      <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-16">
        <article className="lg:col-span-8">
          <Eyebrow>About this experience</Eyebrow>
          <GoldRule className="my-8" />
          <p className="max-w-3xl font-serif text-3xl leading-snug text-ivory/90 md:text-4xl">{trip.summary}</p>
          {trip.descriptionHtml && (
            <div className="trip-rich-text mt-14" dangerouslySetInnerHTML={{ __html: trip.descriptionHtml }} />
          )}
        </article>

        <aside className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-gold/25 bg-ink-soft/80 p-8 backdrop-blur md:p-9">
            <Eyebrow>Private arrangement</Eyebrow>
            <p className="mt-5 font-serif text-3xl leading-tight">Make this day your own</p>
            <p className="mt-4 text-sm leading-relaxed text-mute">Choose your date, party size and preferred stops. We will shape the pace and confirm every detail with you.</p>
            <div className="mt-8">
              <ButtonLink href={`/contact?trip=${encodeURIComponent(trip.slug)}`} className="w-full">
                Enquire about this trip <ArrowUpRight size={16} />
              </ButtonLink>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
