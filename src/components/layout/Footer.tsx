import Link from 'next/link';
import { GoldRule } from '@/components/ui/primitives';
import type { SiteSettings } from '@/lib/public-config';

export function Footer({ site }: { site: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t hairline bg-ink-soft/40">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            {site.logoUrl && (
              <span className="block w-[280px] shrink-0 overflow-hidden">
                {/* The configured logo is hosted by the public API, so a native image avoids a fixed host allow-list. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={site.logoUrl} alt={site.name} className="w-full object-contain drop-shadow-[0_0_18px_rgba(201,169,110,0.16)]" />
              </span>
            )}
            {!site.logoUrl && <p className="font-serif text-3xl tracking-[0.12em] text-gold-gradient">{site.name.toUpperCase()}</p>}
          </div>
          <GoldRule className="my-6" />
          <p className="max-w-md text-sm leading-relaxed text-mute">
            Private chauffeur transfers, airport transfers and tours across Switzerland. Quiet vehicles,
            punctual drivers and prices you can see before you book.
          </p>
        </div>

        <div>
          <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-gold">Explore</p>
          <ul className="space-y-3 text-sm text-ivory/75">
            <li><Link href="/fleet" className="hover:text-gold">Our fleet</Link></li>
            <li><Link href="/airport-transfers" className="hover:text-gold">Airport transfers</Link></li>
            <li><Link href="/trips" className="hover:text-gold">Private trips</Link></li>
            <li><Link href="/book" className="hover:text-gold">Book a journey</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-gold">Contact</p>
          <ul className="space-y-3 text-sm text-ivory/75">
            {site.contact.email && <li><a href={`mailto:${site.contact.email}`} className="hover:text-gold">{site.contact.email}</a></li>}
            {site.contact.phone && <li>{site.contact.phone}</li>}
            {site.contact.address && <li className="max-w-xs leading-relaxed text-mute">{site.contact.address}</li>}
            <li><Link href="/about" className="hover:text-gold">About us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t hairline">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-mute md:flex-row md:justify-between lg:px-10">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p>Prices include VAT where shown. Payments are processed securely by our payment partner.</p>
        </div>
      </div>
    </footer>
  );
}
