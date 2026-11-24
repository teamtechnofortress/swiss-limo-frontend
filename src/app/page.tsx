import { CalendarDays,Gem, CreditCard, MapPin, Plane,Briefcase,Car, MessageSquare, ArrowRight, Users,Plus, ShieldCheck, Clock, Receipt, Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { VehicleCard } from '@/components/fleet/VehicleCard';
import { ButtonLink, Card, Container, Eyebrow, GoldRule, Section, SectionHeading } from '@/components/ui/primitives';
import { TripCard } from '@/components/trips/TripCard';
import { getVehicles } from '@/lib/fleet';
import { getFeaturedTrips } from '@/lib/trips';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';
import Image from 'next/image';
import Link from 'next/link';
import { TripCarousel } from '@/components/home/TripCarousel';


const TRUST = [
  { icon: Receipt, title: 'Transparent pricing', text: 'A clear rate per kilometre, with VAT shown on every quote. No surprises at the end of the journey.' },
  { icon: ShieldCheck, title: 'Secure online payment', text: 'Pay by card or Apple Pay in a secure checkout, or choose to pay your chauffeur in cash on arrival.' },
  { icon: Clock, title: 'Punctual and discreet', text: 'Professional chauffeurs who plan every journey around your time, your luggage and your comfort.' },
];

const STEPS = [
  { n: '01', title: 'Choose your journey', text: 'Enter pickup, destination, date and time. Add a return if you need one.' },
  { n: '02', title: 'Select your vehicle', text: 'Compare the cars available for your party and see the full price instantly.' },
  { n: '03', title: 'Confirm and ride', text: 'Pay securely, receive your confirmation, and your chauffeur is ready for you.' },
];

export const metadata: Metadata = {
  title: { absolute: 'Private Chauffeur Switzerland | Zurich Airport Transfers' },
  description: 'Book a private chauffeur in Switzerland. Zurich airport transfers, executive travel and fixed-price day tours in Mercedes-Benz vehicles. Book online today.',
};

const HOME_FAQS = [
  {
    question: 'How much does a private transfer from Zurich Airport cost?',
    answer: 'Prices start at CHF 69 for an E-Class sedan and include the first 16 km. Your exact fare depends on the vehicle and destination, and you can see it when you book.',
  },
  {
    question: 'Do you track flights?',
    answer: 'Yes. We monitor your flight, so your driver arrives on time even if your flight is early or delayed.',
  },
  {
    question: 'Can I book a driver for the whole day?',
    answer: 'Yes. Our private chauffeur hire covers hourly or full-day bookings for sightseeing, meetings and events.',
  },
  {
    question: 'How many passengers can ride in one vehicle?',
    answer: 'The E-Class and S-Class seat up to 3 passengers. The V-Class seats up to 7 passengers.',
  },
  {
    question: 'Are your day tours private?',
    answer: 'Yes. Every tour is private, with only your group in the vehicle.',
  },
];

function whatsappLink(phone: string | null | undefined) {
  const digits = (phone ?? '').replace(/\D/g, '').replace(/^00/, '');
  return digits.length >= 7 ? `https://wa.me/${digits}` : null;
}

export default async function HomePage() {
  const [vehicles, featuredTrips, publicConfig] = await Promise.all([
    getVehicles().then((items) => items.slice(0, 3)),
    getFeaturedTrips().catch(() => []),
    getPublicConfig().catch(() => fallbackPublicConfig()),
  ]);
  const whatsappUrl = whatsappLink(publicConfig.site.contact.phone);

  return (
    <>
      <Hero />

            {/* --- PREMIUM CHAUFFEUR SERVICES --- */}
          <section className="relative overflow-hidden bg-[#f8f3e9] pt-24 pb-6 text-[#0d1b2a] md:pt-32 md:pb-8">
        
        <div className="absolute inset-x-0 top-0 h-[500px] pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -right-20 top-10 opacity-[0.06] text-[#0d1b2a]">
            <svg width="600" height="600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>

          <div className="absolute -left-10 top-20 opacity-[0.04] text-[#0d1b2a]">
            <svg width="500" height="500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
            </svg>
          </div>
        </div>

        <Container className="relative z-10">
          
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-8">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[3px] w-8 bg-[#f1c75b] shadow-[0_0_2px_#f1c75b]"/>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0d1b2a]">
                  Chauffeur Services
                </p>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0d1b2a] md:text-4xl lg:text-5xl" style={{ textShadow: '0.75px 0 0 currentColor, -0.75px 0 0 currentColor, 0 0.75px 0 currentColor, 0 -0.75px 0 currentColor' }}>
                 Premium Chauffeur Services Across Switzerland
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                From airport pickups to executive travel and scenic long-distance routes, our chauffeur services cover every type of journey in Switzerland.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="mt-1 h-auto min-h-[40px] w-px shrink-0 bg-gray-400/60" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Plane, title: 'Airport Transfers', text: 'Reliable airport pickups and drop-offs at Zurich and other Swiss airports. Your driver tracks your flight, so a delay never leaves you waiting at the curb.', img: '/images/home/service-airport.jpg', alt: 'Mercedes-Benz chauffeur car on the tarmac at Zurich Airport with a Swiss passenger jet' },
              { icon: Briefcase, title: 'Private Chauffeur Hire', text: 'Hire a professional driver by the hour or by the day for meetings, shopping, sightseeing or events. One driver, one vehicle, and your schedule.', img: '/images/home/service-chauffeur.jpg', alt: 'Professional chauffeur opening a car door for a client' },
              { icon: Users, title: 'Corporate Travel', text: 'Discreet, punctual transport for executives and business teams. Work on the road in a quiet, comfortable cabin with reliable timing for every appointment.', img: '/images/home/service-corporate.jpg', alt: 'Business traveler working on a laptop in the back seat of a chauffeur-driven car' },
              { icon: MapPin, title: 'Long-Distance Transfers', text: 'Comfortable intercity travel between Swiss cities, ski resorts and lakeside towns, with no train changes and no parking worries.', img: '/images/home/service-long-distance.jpg', alt: 'Mercedes sedan driving along a scenic Swiss lakeside road with mountains in the background' },
            ].map((service, i) => (
              <div key={i} className="group relative rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-black/5">
                
                <div className="relative h-44 w-full rounded-t-xl overflow-visible">
                  <div className="absolute inset-0 overflow-hidden rounded-t-xl">
                    <Image 
                      src={service.img} 
                      alt={service.alt}
                      fill 
                      className="object-cover" 
                    />
                  </div>
                  <div className="absolute -bottom-5 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#f1c75b] text-[#0d1b2a] shadow-md ring-2 ring-white">
                    <service.icon size={18} strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="p-4 pt-7">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[15px] font-sans font-bold leading-tight text-black">
                      {service.title}
                    </h3>
                    <ArrowRight size={16} className="mt-1 shrink-0 text-[#f1c75b]" />
                  </div>
                  <p className="mt-2 font-sans text-[12px] leading-relaxed text-black">
                    {service.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 overflow-hidden rounded-2xl bg-[#f3eee5] shadow-sm border border-black/5">
            <div className="grid md:grid-cols-12 gap-6 items-stretch p-4 md:p-6">
              
              <div className="relative min-h-[220px] md:min-h-[280px] w-full md:col-span-7 rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(19,38,56,0.15)]">
                <Image 
                  src="/images/home/zurich-airport.jpg" 
                  alt="Mercedes-Benz chauffeur car parked outside Zurich Airport terminal"
                  fill 
                  className="object-cover object-center" 
                />
              </div>

              <div className="flex flex-col justify-center py-2 md:col-span-5">
                
                <h2 className="font-serif text-2xl font-bold text-[#0d1b2a] md:text-3xl"
                     style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor' }}>
                        Zurich Airport Transfer: Private Chauffeur from ZRH
                </h2>
                
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Start your Swiss journey with a private chauffeur from Zurich Airport (ZRH) to your hotel, business meeting or final destination anywhere in Switzerland. Your driver meets you inside the terminal with a name sign, helps with your luggage and takes you directly to your door in a premium Mercedes-Benz.
                </p>

                <div className="mt-4 grid grid-cols-4 gap-2 mb-4">
                  {[
                    { icon: Plane, text: 'Airport pickup\nand drop-off' },
                    { icon: Clock, text: 'Flight\ntracking' },
                    { icon: Users, text: 'Meet and\ngreet' },
                    { icon: Car, text: 'Premium\nMercedes fleet' }
                  ].map((feature, i) => (
                    <div key={i} className={`flex items-center gap-2 ${i !== 3 ? 'border-r border-[#d2c9bc] pr-2' : ''}`}>
                      <feature.icon size={22} className="shrink-0 text-[#c88d22]" strokeWidth={1.5} />
                      <span className="whitespace-pre-line text-[9px] font-bold leading-tight text-[#0d1b2a]">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <ButtonLink href="/book?from=Zurich%20Airport" className="!rounded-full !border-none !bg-[#f1c75b] !px-4 !py-2.5 !text-[11px] !font-bold !text-[#111e29] hover:!bg-[#e0b54a]"
>
                   <Car size={14} className="mr-1.5" /> Book Your Transfer
                  </ButtonLink>

                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>
      
        {/* --- FEATURED DAY TRIPS & TOURS --- */}
      {featuredTrips.length > 0 && <TripCarousel trips={featuredTrips} />}

          {/* --- OUR LUXURY FLEET --- */}
      <section className="relative overflow-hidden bg-[#f8f3e9] pt-8 pb-12 md:pt-12 md:pb-16">
        <Container className="relative z-10">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="h-[3px] w-6 bg-[#f1c75b]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0d1b2a]">
                  Our Fleet
                </p>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0d1b2a] md:text-4xl lg:text-5xl">
                Our Luxury Fleet: Mercedes-Benz Chauffeur Vehicles
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                Every vehicle is clean, climate-controlled and driven by a professional chauffeur. Base fares include the first 16 km.
              </p>
            </div>
            
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              
              <Link 
                href="/fleet" 
                className="flex items-center gap-1.5 rounded-full border border-[#0d1b2a]/20 bg-transparent px-5 py-2.5 text-[11px] font-bold text-[#0d1b2a] transition hover:border-[#0d1b2a] hover:bg-[#0d1b2a]/5"
              >
                View All Vehicles <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.slug} vehicle={vehicle} />
            ))}
          </div>

        </Container>
      </section>


 <section className="relative bg-[#071e32] py-10 text-white">
  <Container>
    <div className="mb-7 max-w-2xl">
      <h2 className="font-serif text-3xl font-bold md:text-4xl">
        Why Choose Swiss Aero Transfer?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/75">
        Our clients choose us for the details that make a difference.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {[
        { 
          customIcon: (
            <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-sm">
              <svg viewBox="0 0 32 32" className="h-full w-full">
                <rect width="32" height="32" fill="#d52b1e"/>
                <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff"/>
              </svg>
            </span>
          ), 
          title: 'Swiss Quality and Precision',
          text: 'Punctual service, planned routes and attention to every detail.'
        },
        { icon: Users, title: 'Professional Chauffeurs', text: 'Experienced chauffeurs who know Switzerland well.' },
        { icon: Gem, title: 'Luxury and Comfort', text: 'Premium vehicles with climate control, quiet cabins and a smooth ride.' },
        { icon: Clock, title: 'Reliable and On-Time', text: 'Flight tracking and live updates keep you on schedule.' },
        { icon: ShieldCheck, title: 'Safe and Secure Booking', text: 'Transparent, fixed pricing with secure online payment.' }
      ].map((feature, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-white/15 bg-white/[0.03] p-4">
          {feature.customIcon ? (
            feature.customIcon
          ) : feature.icon ? (
            <feature.icon size={28} className="shrink-0 text-[#f1c75b]" strokeWidth={1.5} />
          ) : null}
          <div>
            <h3 className="text-sm font-bold leading-tight">{feature.title}</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-white/70">{feature.text}</p>
          </div>
        </div>
      ))}
    </div>
  </Container>
</section>

      
      {/* --- GET A PERSONALIZED QUOTE --- */}
      <section className="relative overflow-hidden bg-[#0d1b2a]">
        
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url('/images/home/swit.jpg')` }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 bg-[#03192e]/50" aria-hidden="true" />

        <Container className="relative flex min-h-[130px] flex-col items-center justify-between gap-6 py-8 md:flex-row">
          
          {/* Text Content */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">
              Get a Personalized Quote Today
            </h2>
            <p className="mt-1 text-sm text-gray-200">
              Plan your trip with our travel experts and receive a custom offer. Reply within one business day, or message us on WhatsApp for a quick answer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink 
              href="/contact" 
              className="!rounded-full !border-none !bg-[linear-gradient(135deg,#f8d77a,#e7a91f)] !px-6 !py-3 !text-[12px] !font-bold !text-[#111e29] hover:!bg-[#e0b54a]"
            >
              <Mail size={16} className="mr-2" /> Request a Quote <ArrowRight size={16} className="ml-1" />
            </ButtonLink>
            
            {whatsappUrl && <a
              href={whatsappUrl}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12px] font-bold text-[#0d1b2a] transition hover:bg-gray-100"
            >
              <MessageSquare size={16} className="text-[#25D366]" />
              WhatsApp Us
            </a>}
          </div>

        </Container>
      </section>

      <section className="bg-[#f8f3e9] py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-bold text-[#0d1b2a] md:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="mx-auto mt-8 max-w-3xl divide-y divide-[#0d1b2a]/10 rounded-2xl border border-[#0d1b2a]/10 bg-white px-5">
            {HOME_FAQS.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-bold text-[#0d1b2a] marker:content-none">
                  {question}
                  <Plus size={18} className="shrink-0 text-[#9b7012] transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="pt-3 text-sm leading-relaxed text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

    </>
  );
}
