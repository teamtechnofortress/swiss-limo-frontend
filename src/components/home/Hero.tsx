import { ArrowUpRight } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui/primitives';

/**
 * The hero photo is a local asset so it can be swapped without a code change.
 * See public/images/home/README.md for the recommended image format and crop.
 */
const heroImage = '/images/home/hero.png';

export function Hero() {
  return (
    <section className="relative isolate min-h-[620px] overflow-hidden border-b hairline md:min-h-[680px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,12,0.97)_0%,rgba(11,11,12,0.84)_39%,rgba(11,11,12,0.40)_72%,rgba(11,11,12,0.48)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(11,11,12,0.88)_0%,transparent_44%,rgba(11,11,12,0.28)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'linear-gradient(rgba(201,169,110,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.25) 1px, transparent 1px)', backgroundSize: '120px 120px' }} aria-hidden="true" />

      <Container className="relative flex min-h-[620px] items-center py-24 md:min-h-[680px] md:py-32">
        <div className="max-w-3xl">
          <p className="rise mb-8 text-[11px] uppercase tracking-[0.45em] text-gold">Private chauffeur · Switzerland</p>
          <h1 className="rise rise-delay text-5xl leading-[1.05] md:text-7xl">
            Arrive in <span className="italic text-gold-gradient">quiet</span>
            <br /> comfort, every time.
          </h1>
          <p className="rise rise-delay mt-8 max-w-xl text-lg leading-relaxed text-ivory/75">
            Executive transfers, airport journeys and private tours with a professional chauffeur. See your price
            before you book, and confirm in minutes.
          </p>
          <div className="rise rise-delay mt-11 flex flex-wrap items-center gap-4">
            <ButtonLink href="/book" className="!px-8 !py-4 !text-[13px] !shadow-gold">
              Book your ride now <ArrowUpRight size={17} strokeWidth={1.8} />
            </ButtonLink>
            <span className="text-xs uppercase tracking-[0.2em] text-ivory/55">Your journey, your pace</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
