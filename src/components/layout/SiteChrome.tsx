'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import type { LayoutCopy } from '@/components/layout/copy';
import { routing } from '@/i18n/routing';
import type { SiteSettings } from '@/lib/public-config';

type Locale = (typeof routing.locales)[number];

type SiteChromeProps = {
  children: React.ReactNode;
  copies: Record<Locale, LayoutCopy>;
  site: SiteSettings;
};

function localeFromPath(pathname: string): Locale {
  return routing.locales.find(
    (candidate) => pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`),
  ) ?? routing.defaultLocale;
}

export function SiteChrome({ children, copies, site }: SiteChromeProps) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const copy = copies[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <>
      <Header key={`header-${locale}`} site={site} copy={copy.header} />
      <main className="flex-1">{children}</main>
      <Footer key={`footer-${locale}`} site={site} copy={copy.footer} locale={locale} />
    </>
  );
}
