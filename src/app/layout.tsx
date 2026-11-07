import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

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
      'Private chauffeur transfers, airport transfers and tours across Switzerland. Executive and luxury vehicles, transparent per-kilometre pricing and secure online booking.',
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const publicConfig = await getPublicConfig().catch(() => fallbackPublicConfig());

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Header site={publicConfig.site} />
        <main className="flex-1">{children}</main>
        <Footer site={publicConfig.site} />
      </body>
    </html>
  );
}
