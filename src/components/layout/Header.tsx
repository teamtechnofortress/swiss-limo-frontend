'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import { ButtonLink } from '@/components/ui/primitives';
import type { SiteSettings } from '@/lib/public-config';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/fleet', label: 'Fleet' },
  { href: '/airport-transfers', label: 'Airport Transfers' },
  { href: '/wef-2027', label: 'WEF 2027' },
  { href: '/trips', label: 'Day Tours' },     // Renamed to match image
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const bookButtonClass =
  '!rounded-full !border-none !bg-[#f1c75b] !px-6 !py-2.5 !text-[13px] !font-bold !text-[#0d1b2a] transition-all duration-300 hover:!bg-[#e0b54a] hover:!shadow-[0_4px_12px_rgba(241,199,91,0.4)]';

const TRANSPARENT_HEADER_PATHS = new Set([
  '/',
  '/fleet',
  '/airport-transfers',
  '/book',
  '/wef-2027',
  '/trips',
]);

function hasTransparentHeaderPath(pathname: string): boolean {
  return TRANSPARENT_HEADER_PATHS.has(pathname) || /^\/trips\/[^/]+$/.test(pathname);
}

export type HeaderProps = {
  site: SiteSettings;
  /** Shows a dark-to-transparent overlay. Defaults to true on hero pages. */
  transparentGradient?: boolean;
  /** Controls when a transparent header becomes fixed and fully opaque. */
  forceSolid?: boolean;
  /** Optional replacement for the default opaque header background colour. */
  solidHeaderClassName?: string;
};

/**
 * For a hero header, control `forceSolid` from the importing client component:
 * `<Header site={site} transparentGradient forceSolid={!isHeroVisible} />`
 * `isHeroVisible` can be maintained with an IntersectionObserver.
 */
export function Header({
  site,
  transparentGradient,
  forceSolid = false,
  solidHeaderClassName = 'bg-[#0d1b2a]',
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [hasPassedSolidTrigger, setHasPassedSolidTrigger] = useState(false);
  const [isHeaderReady, setIsHeaderReady] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const hasTransparentGradient = transparentGradient ?? hasTransparentHeaderPath(pathname);
  const overlaysHero = hasTransparentGradient;
  const isTransparent = hasTransparentGradient && !forceSolid && !hasPassedSolidTrigger;
  const isHeaderVisible = !hasTransparentGradient || isHeaderReady;

  useLayoutEffect(() => {
    if (!hasTransparentGradient || forceSolid) {
      setHasPassedSolidTrigger(false);
      setIsHeaderReady(true);
      return;
    }

    let animationFrame = 0;
    let restorationTimeout: number | undefined;
    const trigger = document.querySelector<HTMLElement>('[data-header-solid-trigger]');

    if (!trigger) {
      setHasPassedSolidTrigger(false);
      setIsHeaderReady(true);
      return;
    }

    const updateHeaderAppearance = () => {
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      const triggerBottom = trigger.getBoundingClientRect().bottom;

      // The header becomes solid only after the whole trigger has travelled
      // behind it. Reading the live DOM position keeps this accurate when a
      // browser restores scroll after a refresh or history navigation.
      const shouldBeSolid = triggerBottom <= headerBottom;
      setHasPassedSolidTrigger((current) =>
        current === shouldBeSolid ? current : shouldBeSolid,
      );
      setIsHeaderReady(true);
    };

    const scheduleAppearanceUpdate = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateHeaderAppearance);
    };

    // This synchronous check avoids displaying a transparent header after
    // hydration when the browser has already restored the scroll position.
    updateHeaderAppearance();

    const observer = new IntersectionObserver(scheduleAppearanceUpdate, {
      threshold: [0, 1],
    });
    observer.observe(trigger);

    window.addEventListener('scroll', scheduleAppearanceUpdate, { passive: true });
    window.addEventListener('resize', scheduleAppearanceUpdate);
    window.addEventListener('pageshow', scheduleAppearanceUpdate);

    // Some browsers apply their native refresh restoration just after the
    // first client frame, so verify once more after that restoration completes.
    restorationTimeout = window.setTimeout(scheduleAppearanceUpdate, 0);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
      if (restorationTimeout !== undefined) {
        window.clearTimeout(restorationTimeout);
      }
      window.removeEventListener('scroll', scheduleAppearanceUpdate);
      window.removeEventListener('resize', scheduleAppearanceUpdate);
      window.removeEventListener('pageshow', scheduleAppearanceUpdate);
    };
  }, [forceSolid, hasTransparentGradient, pathname]);

  const headerClassName = [
    overlaysHero ? 'fixed inset-x-0 top-0' : 'sticky top-0',
    'z-50 py-2 transition-[transform,opacity,background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none',
    isHeaderVisible
      ? 'translate-y-0 opacity-100'
      : '-translate-y-full pointer-events-none opacity-0',
    isTransparent
      ? 'bg-gradient-to-b from-[#0d1b2a]/90 via-[#0d1b2a]/45 to-transparent shadow-none'
      : `${solidHeaderClassName} shadow-lg`,
  ].join(' ');

  return (
    <header ref={headerRef} className={headerClassName}>
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <Link
          href="/"
          className="group absolute left-1/2 flex h-12 -translate-x-1/2 items-center xl:static xl:min-h-11 xl:h-auto xl:translate-x-0"
          aria-label={`${site.name} home`}
        >
          {site.logoUrl && (
            <span className="block h-12 w-40 shrink-0 xl:h-14 xl:w-48">
              <img
                src={site.logoUrl}
                alt={site.name}
                className="h-full w-full object-contain"
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
        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7" aria-label="Main">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex h-20 items-center whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-[#f1c75b]' : 'text-gray-300 hover:text-[#f1c75b]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4 xl:gap-5">
          
        <div className="relative hidden shrink-0 items-center gap-1.5 text-[12px] font-semibold text-white/90 md:flex">
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
            className="hidden shrink-0 whitespace-nowrap md:inline-flex items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-6 py-2.5 text-[12px] font-bold text-[#0d1b2a] shadow-sm transition hover:bg-[#e0b54a]">
            Book Your Ride <ArrowRight size={16} strokeWidth={2.5} className="ml-1" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-white xl:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 top-full w-full border-t border-white/10 bg-[#0d1b2a] shadow-xl xl:hidden">
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
