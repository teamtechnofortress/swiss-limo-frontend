'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Menu, X, ChevronDown } from 'lucide-react';
import { ButtonLink } from '@/components/ui/primitives';
import type { HeaderCopy } from '@/components/layout/copy';
import { routing } from '@/i18n/routing';
import type { SiteSettings } from '@/lib/public-config';

const NAV = [
  { href: '/', key: 'home' },
  { href: '/fleet', key: 'fleet' },
  { href: '/airport-transfers', key: 'airportTransfers' },
  { href: '/wef-2027', key: 'wef' },
  { href: '/trips', key: 'dayTours' },
  { href: '/contact', key: 'contact' },
] as const;

const LOCALIZED_NAV_PATHS = new Set(['/', '/fleet', '/airport-transfers', '/trips', '/wef-2027', '/chauffeur-price-estimate', '/contact', '/book']);
const LOCALIZED_TRIP_PATH = /^\/trips\/[^/]+(?:\/book)?$/;
const LOCALIZED_VEHICLE_PATH = /^\/fleet\/[^/]+$/;
const LANGUAGES = [
  { locale: 'en', label: 'English' },
  { locale: 'de', label: 'Deutsch (Schweiz)' },
  { locale: 'fr', label: 'Français (Suisse)' },
  { locale: 'it', label: 'Italiano (Svizzera)' },
] as const;

const bookButtonClass =
  '!rounded-full !border-none !bg-[#f1c75b] !px-6 !py-2.5 !text-[13px] !font-bold !text-[#0d1b2a] transition-all duration-300 hover:!bg-[#e0b54a] hover:!shadow-[0_4px_12px_rgba(241,199,91,0.4)]';

const TRANSPARENT_HEADER_PATHS = new Set([
  '/',
  '/fleet',
  '/airport-transfers',
  '/book',
  '/chauffeur-price-estimate',
  '/wef-2027',
  '/trips',
]);

function localeFromPath(pathname: string) {
  return routing.locales.find((candidate) =>
    pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`),
  ) ?? routing.defaultLocale;
}

function pathWithoutLocale(pathname: string): string {
  const locale = localeFromPath(pathname);
  const prefix = `/${locale}`;

  if (pathname === prefix) return '/';
  return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
}

function hasTransparentHeaderPath(pathname: string): boolean {
  const normalizedPathname = pathWithoutLocale(pathname);
  return TRANSPARENT_HEADER_PATHS.has(normalizedPathname) || LOCALIZED_TRIP_PATH.test(normalizedPathname);
}

function localizedHref(path: string, locale: string) {
  return LOCALIZED_NAV_PATHS.has(path) || LOCALIZED_TRIP_PATH.test(path) || LOCALIZED_VEHICLE_PATH.test(path)
    ? `/${locale}${path === '/' ? '' : path}`
    : path;
}

function LanguageFlag({ locale, className = '' }: { locale: (typeof routing.locales)[number]; className?: string }) {
  const flag = locale === 'fr'
    ? <><rect width="10.67" height="32" fill="#1f4fa3" /><rect x="10.67" width="10.66" height="32" fill="#fff" /><rect x="21.33" width="10.67" height="32" fill="#e3353e" /></>
    : locale === 'it'
      ? <><rect width="10.67" height="32" fill="#16834a" /><rect x="10.67" width="10.66" height="32" fill="#fff" /><rect x="21.33" width="10.67" height="32" fill="#df3c45" /></>
      : locale === 'de'
        ? <><rect width="32" height="10.67" fill="#161616" /><rect y="10.67" width="32" height="10.66" fill="#d5343b" /><rect y="21.33" width="32" height="10.67" fill="#e9bd35" /></>
        : <><rect width="32" height="32" fill="#24498d" /><path d="M0 3 3 0l29 29v3l-3 0L0 3Zm29-3 3 3L3 32H0v-3L29 0Z" fill="#fff" /><path d="m0 5 5-5h3L0 8V5Zm24-5h3L0 27v-3L24 0Zm8 24v3l-5 5h-3l8-8ZM8 32H5l27-27v3L8 32Z" fill="#d93644" /><path d="M13 0h6v13h13v6H19v13h-6V19H0v-6h13V0Z" fill="#fff" /><path d="M14.5 0h3v14.5H32v3H17.5V32h-3V17.5H0v-3h14.5V0Z" fill="#d93644" /></>;

  return (
    <span className={`flex h-4 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[3px] shadow-sm ${className}`} aria-hidden="true">
      <svg viewBox="0 0 32 32" className="h-full w-full" preserveAspectRatio="none">
        {flag}
      </svg>
    </span>
  );
}

export type HeaderProps = {
  site: SiteSettings;
  copy: HeaderCopy;
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
  copy,
  transparentGradient,
  forceSolid = false,
  solidHeaderClassName = 'bg-[#0d1b2a]',
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [hasPassedSolidTrigger, setHasPassedSolidTrigger] = useState(false);
  const [isHeaderReady, setIsHeaderReady] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const locale = localeFromPath(pathname);
  const currentPath = pathWithoutLocale(pathname);
  const languageTargetPath = LOCALIZED_NAV_PATHS.has(currentPath) || LOCALIZED_TRIP_PATH.test(currentPath) || LOCALIZED_VEHICLE_PATH.test(currentPath) ? currentPath : '/';
  const hasTransparentGradient = transparentGradient ?? hasTransparentHeaderPath(pathname);
  const overlaysHero = hasTransparentGradient;
  const isTransparent = hasTransparentGradient && !forceSolid && !hasPassedSolidTrigger;
  const isHeaderVisible = !hasTransparentGradient || isHeaderReady;
  const activeLanguage = LANGUAGES.find((language) => language.locale === locale) ?? LANGUAGES[0];

  useEffect(() => {
    if (!languageOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !languageMenuRef.current?.contains(event.target)) {
        setLanguageOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLanguageOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [languageOpen]);

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
          href={localizedHref('/', locale)}
          className="group absolute left-1/2 flex h-12 -translate-x-1/2 items-center xl:static xl:min-h-11 xl:h-auto xl:translate-x-0"
          aria-label={`${site.name} ${copy.nav.home}`}
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
              <span className="mt-1 text-[9px] uppercase tracking-[0.5em] text-[#f1c75b]">{copy.brandTagline}</span>
            </span>
          )}
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7" aria-label={copy.navigationLabel}>
          {NAV.map((item) => {
            const isActive = currentPath === item.href;
            const href = localizedHref(item.href, locale);
            return (
              <Link
                key={item.href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex h-20 items-center whitespace-nowrap text-[12px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-[#f1c75b]' : 'text-gray-300 hover:text-[#f1c75b]'
                }`}
              >
                {copy.nav[item.key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4 xl:gap-5">
          <div ref={languageMenuRef} className="relative hidden shrink-0 md:block">
            <button
              type="button"
              onClick={() => setLanguageOpen((current) => !current)}
              aria-label={copy.languageLabel}
              aria-haspopup="menu"
              aria-expanded={languageOpen}
              className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 text-[12px] font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1c75b] ${languageOpen ? 'border-white/35 bg-white/15' : 'border-white/20 bg-white/10 hover:border-white/35 hover:bg-white/15'}`}
            >
              <LanguageFlag locale={activeLanguage.locale} />
              <ChevronDown size={14} className={`ml-0.5 transition-transform duration-200 ${languageOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {languageOpen && (
              <div role="menu" aria-label={copy.languageLabel} className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/15 bg-[#10213a]/95 p-1.5 shadow-[0_18px_40px_rgba(5,14,30,0.42)] backdrop-blur-xl">
                {LANGUAGES.map((language) => {
                  const selected = language.locale === locale;
                  return (
                    <button
                      key={language.locale}
                      type="button"
                      role="menuitemradio"
                      aria-checked={selected}
                      onClick={() => {
                        setLanguageOpen(false);
                        if (!selected) router.push(localizedHref(languageTargetPath, language.locale));
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f1c75b] ${selected ? 'bg-[#f1c75b] text-[#0d1b2a]' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}
                    >
                      <LanguageFlag locale={language.locale} className={selected ? 'opacity-100' : 'opacity-80'} />
                      <span className="min-w-0 flex-1">{language.label}</span>
                      {selected && <Check size={15} strokeWidth={2.5} aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

            <Link 
            href={`/${locale}/book`}
            className="hidden shrink-0 whitespace-nowrap md:inline-flex items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-6 py-2.5 text-[12px] font-bold text-[#0d1b2a] shadow-sm transition hover:bg-[#e0b54a]">
            {copy.bookRide} <ArrowRight size={16} strokeWidth={2.5} className="ml-1" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-white xl:hidden"
            aria-expanded={open}
            aria-label={copy.toggleMenu}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute left-0 top-full w-full border-t border-white/10 bg-[#0d1b2a] shadow-xl xl:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4" aria-label={copy.mobileNavigationLabel}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={localizedHref(item.href, locale)}
                onClick={() => setOpen(false)}
                aria-current={currentPath === item.href ? 'page' : undefined}
                className={`border-b border-white/5 py-4 text-sm font-semibold uppercase tracking-wider transition ${
                  currentPath === item.href ? 'text-[#f1c75b]' : 'text-gray-300 hover:text-white'
                }`}
              >
                {copy.nav[item.key]}
              </Link>
            ))}
            <ButtonLink href={`/${locale}/book`} variant="outline" className={`mt-6 w-full ${bookButtonClass}`}>
              {copy.bookRide} <ArrowRight size={16} strokeWidth={2.5} className="ml-1" />
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}
