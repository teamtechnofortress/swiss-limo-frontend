import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import './globals.css';
import { SiteChrome } from '@/components/layout/SiteChrome';
import type { LayoutCopy } from '@/components/layout/copy';
import { layoutCopy as deCHLayoutCopy } from '@/messages/de-CH/layout';
import { layoutCopy as enLayoutCopy } from '@/messages/en/layout';
import { layoutCopy as frCHLayoutCopy } from '@/messages/fr-CH/layout';
import { layoutCopy as itCHLayoutCopy } from '@/messages/it-CH/layout';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

const layoutCopies: Record<'en' | 'de' | 'fr' | 'it', LayoutCopy> = {
  en: enLayoutCopy,
  de: deCHLayoutCopy,
  fr: frCHLayoutCopy,
  it: itCHLayoutCopy,
};

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'], 
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const publicConfig = await getPublicConfig().catch(() => fallbackPublicConfig());

  return {
    title: {
      default: `${publicConfig.site.name} · Luxury chauffeur service in Switzerland`,
      template: `%s · ${publicConfig.site.name}`,
    },
    description:
      'Book a private chauffeur in Switzerland. Zurich airport transfers, executive travel and fixed-price day tours in Mercedes-Benz vehicles. Book online today.',
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [publicConfig, locale] = await Promise.all([
    getPublicConfig().catch(() => fallbackPublicConfig()),
    getLocale(),
  ]);

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteChrome site={publicConfig.site} copies={layoutCopies}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
