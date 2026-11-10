'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import { ButtonLink } from '@/components/ui/primitives';
import type { SiteSettings } from '@/lib/public-config';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/fleet', label: 'Our Fleet' },
  { href: '/airport-transfers', label: 'Services' }, // Renamed to match image
  { href: '/trips', label: 'Day Trips & Tours' },     // Renamed to match image
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const bookButtonClass =
  '!rounded-full !border-none !bg-[#f1c75b] !px-6 !py-2.5 !text-[13px] !font-bold !text-[#0d1b2a] transition-all duration-300 hover:!bg-[#e0b54a] hover:!shadow-[0_4px_12px_rgba(241,199,91,0.4)]';

export function Header({ site }: { site: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0d1b2a] shadow-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link href="/" className="group flex min-h-11 items-center" aria-label={`${site.name} home`}>
          {site.logoUrl && (
            <span className="block h-12 w-40 sm:w-48">
              <img
                src={site.logoUrl}
                alt={site.name}
                className="h-full w-full object-contain object-left drop-shadow-sm"
              />
            </span>
          )}
          {!site.logoUrl && (
            <span className="flex flex-col leading-none">
              <span className="font-serif text-xl tracking-[0.12em] text-white sm:text-2xl">
                {site.name.toUpperCase()}
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.5em] text-[#f1c75b]">Chauffeur service</span>
            </span>
          )}
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex h-20 items-center text-[12px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-[#f1c75b]' : 'text-gray-300 hover:text-[#f1c75b]'
                }`}
              >
                {item.label}
                {/* Gold Underline for Active Link */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#f1c75b]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          
        <div className="relative hidden items-center gap-1.5 text-[12px] font-semibold text-white/90 md:flex">
          <span className="flex h-4 w-6 overflow-hidden rounded-sm">
            <svg viewBox="0 0 32 32" className="h-full w-full">
             <rect width="32" height="32" fill="#d52b1e"/>
             <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff"/>
            </svg>
         </span>
               <select
                   className="cursor-pointer appearance-none bg-transparent pr-4 text-white outline-none transition-colors hover:text-[#f1c75b]"
                   defaultValue="EN"
                 >
               <option value="EN" className="text-white">EN</option>
               <option value="FR" className="text-white">French</option>
               <option value="DE" className="text-white">Spanish</option>
              <option value="NL" className="text-white">Hindi</option>
              </select>
       <ChevronDown size={14} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
</div>

            <Link 
            href="/book" 
            className="hidden md:inline-flex items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-6 py-2.5 text-[12px] font-bold text-[#0d1b2a] shadow-sm transition hover:bg-[#e0b54a]">
            Book Your Ride <ArrowRight size={16} strokeWidth={2.5} className="ml-1" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-white lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 top-full w-full border-t border-white/10 bg-[#0d1b2a] shadow-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`border-b border-white/5 py-4 text-sm font-semibold uppercase tracking-wider transition ${
                  pathname === item.href ? 'text-[#f1c75b]' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/book" variant="outline" className={`mt-6 w-full ${bookButtonClass}`}>
              Book Your Ride <ArrowRight size={16} strokeWidth={2.5} className="ml-1" />
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}