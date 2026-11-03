'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { ButtonLink } from '@/components/ui/primitives';
import type { SiteSettings } from '@/lib/public-config';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/fleet', label: 'Fleet' },
  { href: '/airport-transfers', label: 'Airport' },
  { href: '/trips', label: 'Trips' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const bookButtonClass =
  '!border-[#5c3e16] !bg-[linear-gradient(135deg,#fffdf8_0%,#f2dfc1_100%)] !px-7 !py-3 !font-semibold !tracking-[0.08em] !text-[#201509] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_16px_rgba(68,45,13,0.18)] transition-all duration-300 hover:!border-[#2a1b0b] hover:!text-[#0b0b0c] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_rgba(68,45,13,0.28)]';

export function Header({ site }: { site: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gold-deep/60 bg-gold-gradient shadow-[0_10px_32px_rgba(11,11,12,0.16)]">
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group flex min-h-11 items-center" aria-label={`${site.name} home`}>
          {site.logoUrl && (
            <span className="block h-24 w-52 sm:w-56">
              {/* The configured logo is hosted by the public API, so a native image avoids a fixed host allow-list. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.logoUrl}
                alt={site.name}
                className="h-full w-full scale-110 object-contain drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]"
              />
            </span>
          )}
          {!site.logoUrl && (
            <span className="flex flex-col leading-none">
              <span className="font-serif text-xl tracking-[0.12em] text-ink sm:text-2xl">
                {site.name.toUpperCase()}
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.5em] text-ink/60">Chauffeur service</span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center rounded-full border border-[#7b5d2c]/30 bg-[#fffaf2]/15 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.32),0_5px_16px_rgba(70,48,14,0.08)] lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={`rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-300 ${
                pathname === item.href
                  ? 'bg-ink text-ivory shadow-[0_4px_10px_rgba(42,27,11,0.24)]'
                  : 'text-ink/75 hover:bg-[#fffaf2]/55 hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ButtonLink href="/book" variant="outline" className={`hidden ${bookButtonClass} md:inline-flex`}>
            Book now <ArrowUpRight size={16} strokeWidth={1.8} />
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-[#6b4b1d] bg-[#fffaf2] p-2.5 text-[#201509] shadow-sm lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gold-deep/40 bg-gold-gradient lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-6" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`rounded-xl px-4 py-3 font-serif text-2xl transition ${
                  pathname === item.href ? 'bg-ink text-ivory' : 'text-ink/85 hover:bg-ivory/35 hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/book" variant="outline" className={`mt-4 w-full ${bookButtonClass}`}>
              Book now <ArrowUpRight size={16} strokeWidth={1.8} />
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
