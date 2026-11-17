import type { Metadata } from 'next';
import { Container } from '@/components/ui/primitives';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'How we collect, use, store and protect personal data for your chauffeur journey.',
};

export default async function PrivacyPage() {
  const publicConfig = await getPublicConfig().catch(() => fallbackPublicConfig());
  const { name, contact } = publicConfig.site;
  const contactHref = contact.email ? `mailto:${contact.email}` : '/contact';

  return (
    <div className="bg-[#f8f9fa] text-[#101827]">
      <Container className="py-8 sm:py-10 lg:py-12">
        <article>
          <header className="border-b border-[#0d1b2a]/12 pb-6 sm:pb-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#8c6516]">{name}</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold leading-none tracking-[-0.03em] text-[#0d1b2a] sm:text-6xl lg:text-7xl">Privacy Policy</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
              This policy explains which personal data we collect and how we use it, in line with the Swiss Federal Act on Data Protection (FADP).
            </p>
          </header>

          <div className="space-y-9 py-7 sm:space-y-10 sm:py-8">
            <section>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Data we collect</h2>
              <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
                When you book, we store your name, mobile number, email address, flight number, trip details and notes. We use this data only to carry out and invoice your ride.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Price searches</h2>
              <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
                When you check a price, we store the pick-up and drop-off addresses, distance and prices shown, without your name or contact details, to improve our service. Distances are calculated with Google Maps.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Storage and sharing</h2>
              <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
                Your data is stored securely. We share it only with the chauffeur assigned to your ride and, for payments, with our payment provider.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em] text-[#0d1b2a] sm:text-4xl">Your rights</h2>
              <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
                You can ask us at any time which data we hold about you, and ask us to correct or delete it.
              </p>
              <p className="mt-5 text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
                Write to{' '}
                <a href={contactHref} className="font-semibold text-[#0d1b2a] underline decoration-[#d5a436] decoration-2 underline-offset-4 transition hover:text-[#9b7012]">
                  {contact.email ?? 'our team'}
                </a>.
              </p>
            </section>
          </div>
        </article>
      </Container>
    </div>
  );
}
