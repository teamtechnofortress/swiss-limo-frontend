import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import type { SiteSettings } from '@/lib/public-config';

export function Footer({ site }: { site: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0d1b2a] text-white">
      {/* Main Footer Content - Reduced py-12 to py-8 for tighter spacing */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-4 lg:px-8 md:divide-x md:divide-white/10">
        
        {/* Column 1: Logo & Description */}
        <div className="pb-6 md:pb-0 md:pr-8">
          <Link href="/" className="inline-flex flex-col items-start gap-1">
            {site.logoUrl && (
              <span className="block h-14 w-48 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={site.logoUrl} 
                  alt={site.name} 
                  className="h-full w-full object-contain object-left" 
                />
              </span>
            )}
            {!site.logoUrl && (
              <p className="font-serif text-2xl font-bold tracking-[0.12em] text-white">
                {site.name.toUpperCase()}
              </p>
            )}
            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.4em] text-white/80">
              Swiss Premium Chauffeur Services
            </p>
          </Link>
        </div>

        {/* Column 2: Quick Links (Split into two visual columns) */}
        <div className="pb-6 md:pb-0 md:px-8">
          <p className="mb-4 text-sm font-bold text-[#f1c75b]">Quick Links</p>
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            {/* Left list */}
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/airport-transfers" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="/trips" className="hover:text-white transition-colors">Day Trips & Tours</Link></li>
            </ul>
            {/* Right list */}
            <ul className="space-y-2">
              <li><Link href="/fleet" className="hover:text-white transition-colors">Our Fleet</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Column 3: Contact Us */}
        <div className="pb-6 md:pb-0 md:px-8">
          <p className="mb-4 text-sm font-bold text-[#f1c75b]">Contact Us</p>
          <ul className="space-y-2 text-sm font-medium text-gray-400">
            {site.contact.phone && (
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-[#f1c75b]" />
                <a href={`tel:${site.contact.phone}`} className="hover:text-white transition-colors">
                  {site.contact.phone}
                </a>
              </li>
            )}
            {site.contact.email && (
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-[#f1c75b]" />
                <a href={`mailto:${site.contact.email}`} className="hover:text-white transition-colors">
                  {site.contact.email}
                </a>
              </li>
            )}
            {site.contact.address && (
              <li className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#f1c75b]" />
                <span className="leading-relaxed">{site.contact.address}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Column 4: Follow Us */}
        <div className="md:pl-8">
          <p className="mb-4 text-sm font-bold text-[#f1c75b]">Follow Us</p>
          <div className="flex gap-2">
            <a href="#" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#f1c75b] hover:text-[#0d1b2a]">
              <Facebook size={14} />
            </a>
            <a href="#" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#f1c75b] hover:text-[#0d1b2a]">
              <Instagram size={14} />
            </a>
            <a href="#" aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#f1c75b] hover:text-[#0d1b2a]">
              <Linkedin size={14} />
            </a>
            <a href="#" aria-label="YouTube" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#f1c75b] hover:text-[#0d1b2a]">
              <Youtube size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Reduced py-4 to py-3 for tighter spacing */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-3 text-xs font-medium text-gray-400 md:flex-row lg:px-8">
          <p>© {year} {site.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}