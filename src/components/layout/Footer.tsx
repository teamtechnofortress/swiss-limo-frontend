'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SiteSettings } from '@/lib/public-config';
import type { FooterCopy } from '@/components/layout/copy';

const quickLinks = [
  { href: '/', key: 'home' },
  { href: '/airport-transfers', key: 'airportTransfers' },
  { href: '/trips', key: 'dayTours' },
  { href: '/fleet', key: 'fleet' },
  { href: '/chauffeur-price-estimate', key: 'priceEstimate' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;

const socialLinks = [
  { label: 'Facebook', icon: Facebook },
  { label: 'Instagram', icon: Instagram },
  { label: 'LinkedIn', icon: Linkedin },
  { label: 'YouTube', icon: Youtube },
];

const headingClassName = 'text-sm font-bold text-[#f1c75b]';
const footerLinkClassName = 'transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1c75b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b2a]';

type ContactItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
};

export function Footer({ site, copy, locale }: { site: SiteSettings; copy: FooterCopy; locale: string }) {
  const year = new Date().getFullYear();
  const localizedHref = (path: string) =>
    path === '/' || path === '/fleet' || path === '/airport-transfers' || path === '/trips' || path === '/wef-2027' || path === '/chauffeur-price-estimate' || path === '/contact'
      ? `/${locale}${path === '/' ? '' : path}`
      : path;
  const contactItems: ContactItem[] = [
    site.contact.phone ? {
      icon: Phone,
      label: copy.callUs,
      value: site.contact.phone,
      href: `tel:${site.contact.phone}`,
    } : null,
    site.contact.email ? {
      icon: Mail,
      label: copy.emailUs,
      value: site.contact.email,
      href: `mailto:${site.contact.email}`,
    } : null,
    site.contact.address ? {
      icon: MapPin,
      label: copy.visitUs,
      value: site.contact.address,
    } : null,
  ].filter((item): item is ContactItem => item !== null);

  return (
    <footer className="border-t border-white/10 bg-[#0d1b2a] text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-y-10 py-10 md:grid-cols-[1.2fr_.85fr_1.25fr_.8fr] md:gap-x-12 md:gap-y-0">
          <div>
            <Link href={localizedHref('/')} className="inline-flex flex-col items-start gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1c75b]">
              {site.logoUrl ? (
                <span className="block w-48 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={site.logoUrl} alt={site.name} className="h-full w-full object-contain object-left" />
                </span>
              ) : (
                <p className="font-serif text-2xl font-bold tracking-[0.12em] text-white">
                  {site.name.toUpperCase()}
                </p>
              )}
              <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/80">
                {copy.brandTagline}
              </p>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              {copy.description}
            </p>
          </div>

          <nav aria-label={copy.navigationLabel}>
            <p className={headingClassName}>{copy.quickLinks}</p>
            <ul className="mt-4 space-y-3 text-sm font-medium text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={localizedHref(link.href)} className={footerLinkClassName}>{copy.nav[link.key]}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-contact-heading">
            <p id="footer-contact-heading" className={headingClassName}>{copy.contactUs}</p>
            {contactItems.length > 0 && (
              <ul className="mt-4 space-y-5">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const content = item.href ? (
                    <a href={item.href} className={footerLinkClassName}>{item.value}</a>
                  ) : (
                    <span>{item.value}</span>
                  );

                  return (
                    <li key={item.label} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-x-3">
                      <Icon size={15} aria-hidden="true" className="mt-0.5 text-[#f1c75b]" />
                      <div className="min-w-0 text-sm font-medium leading-5 text-gray-400">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{item.label}</p>
                        {content}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="footer-social-heading">
            <p id="footer-social-heading" className={headingClassName}>{copy.followUs}</p>
            <div className="mt-4 flex gap-2.5">
              {socialLinks.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#f1c75b] hover:text-[#0d1b2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f1c75b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b2a]"
                >
                  <Icon size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 text-center text-xs font-medium text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
          <p>© {year} {site.name}. {copy.allRightsReserved}</p>
          <div className="flex items-center justify-center gap-4 sm:justify-end">
            <Link href="/privacy" className={footerLinkClassName}>{copy.privacyPolicy}</Link>
            <span aria-hidden="true" className="h-3 w-px bg-white/20" />
            <Link href="/terms" className={footerLinkClassName}>{copy.termsAndConditions}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
