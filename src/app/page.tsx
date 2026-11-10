import { CalendarDays,Gem, CreditCard, MapPin, Plane,Briefcase,Car, MessageSquare, ArrowRight, Users,Plus, ShieldCheck, Clock, Receipt, Mail } from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { VehicleCard } from '@/components/fleet/VehicleCard';
import { ButtonLink, Card, Container, Eyebrow, GoldRule, Section, SectionHeading } from '@/components/ui/primitives';
import { TripCard } from '@/components/trips/TripCard';
import { getVehicles } from '@/lib/fleet';
import { getTrips } from '@/lib/trips';
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

export default async function HomePage() {
  const [vehicles, trips] = await Promise.all([
    getVehicles().then((items) => items.slice(0, 3)),
    getTrips({ featured: true, perPage: 3 }).catch(() => null),
  ]);

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
                  Our Chauffeur Services
                </p>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#0d1b2a] md:text-4xl lg:text-5xl" style={{ textShadow: '0.75px 0 0 currentColor, -0.75px 0 0 currentColor, 0 0.75px 0 currentColor, 0 -0.75px 0 currentColor' }}>
                 Premium Chauffeur Services
              </h2>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="mt-1 h-auto min-h-[40px] w-px shrink-0 bg-gray-400/60" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Plane, title: 'Airport Transfers', text: 'Punctual and reliable airport pickups and drop-offs.', img: '/images/home/service-airport.jpg' },
              { icon: Briefcase, title: 'Private Chauffeur', text: 'Flexible hourly or daily chauffeur service.', img: '/images/home/service-chauffeur.jpg' },
              { icon: Users, title: 'Corporate Travel', text: 'Professional and discreet business transportation.', img: '/images/home/service-corporate.jpg' },
              { icon: MapPin, title: 'Long Distance Transfers', text: 'Comfortable intercity travel across Switzerland and beyond.', img: '/images/home/service-long-distance.jpg' },
            ].map((service, i) => (
              <div key={i} className="group relative rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-black/5">
                
                <div className="relative h-44 w-full rounded-t-xl overflow-visible">
                  <div className="absolute inset-0 overflow-hidden rounded-t-xl">
                    <Image 
                      src={service.img} 
                      alt={service.title} 
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
                  alt="Zurich Airport Transfer" 
                  fill 
                  className="object-cover object-center" 
                />
              </div>

              <div className="flex flex-col justify-center py-2 md:col-span-5">
                
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-[3px] w-6 bg-[#f1c75b]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#172332]">
                    Premium Airport Transfers
                  </p>
                </div>
                
                <h2 className="font-serif text-2xl font-bold text-[#0d1b2a] md:text-3xl"
                     style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor' }}>
                        Zurich Airport Transfer
                </h2>
                
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Start your Swiss journey in comfort. Enjoy a private chauffeur transfer from Zurich Airport to your hotel, business meeting or destination anywhere in Switzerland.
                </p>

                <div className="mt-4 grid grid-cols-4 gap-2 mb-4">
                  {[
                    { icon: Plane, text: 'Airport Pickup\n& Drop-off' },
                    { icon: Clock, text: 'Flight\nTracking' },
                    { icon: Users, text: 'Meet &\nGreet' },
                    { icon: Car, text: 'Premium\nMercedes Fleet' }
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
                   <Car size={14} className="mr-1.5" /> Book Transfer
                  </ButtonLink>

                  <ButtonLink 
                    href="/airport-transfers"
                    variant="outline"
                    className="!rounded-full !border !border-black !bg-white !px-4 !py-2.5 !text-[11px] !font-bold !text-[#111e29] !shadow-none hover:!bg-gray-50"
                  > 
                    Airport Transfers
                  </ButtonLink>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>
      
        {/* --- FEATURED DAY TRIPS & TOURS --- */}
 <TripCarousel trips={trips} />

          {/* --- OUR LUXURY FLEET --- */}
      <section className="relative overflow-hidden bg-[#f8f3e9] pt-8 pb-12 md:pt-12 md:pb-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat  pointer-events-none scale-105"
          style={{ backgroundImage: `url('/images/home/homepage_fleet_background.png')` }}
          aria-hidden="true"
        />
                <div className="absolute inset-0 bg-gradient-to-b from-[#f8f3e9]/60 via-transparent to-[#f8f3e9]/90 pointer-events-none" aria-hidden="true" />

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
                Our Luxury Fleet
              </h2>
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


           {/* --- WHY CHOOSE US --- */}
 <section className="relative bg-[#071e32] py-4 text-white">
  <Container className="flex flex-col items-center justify-between gap-6 md:flex-row"> 
    <h2 className="font-serif text-2xl font-bold whitespace-nowrap md:text-4xl">
      Why Choose Us?
    </h2>
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 lg:gap-8">
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
          text: 'Swiss Quality\n& Precision' 
        },
        { icon: Users, text: 'Professional\nChauffeurs' },
        { icon: Gem, text: 'Luxury &\nComfort' },
        { icon: Clock, text: 'Reliable &\nOn-Time' },
        { icon: ShieldCheck, text: 'Safe &\nSecure Booking' }
      ].map((feature, i) => (
        <div key={i} className="flex items-center gap-3 border-l border-white/20 pl-4 lg:pl-6 first:border-l-0 first:pl-0">
          {feature.customIcon ? (
            feature.customIcon
          ) : feature.icon ? (
            <feature.icon size={28} className="shrink-0 text-[#f1c75b]" strokeWidth={1.5} />
          ) : null}
          <span className="whitespace-pre-line text-[11px] font-normal leading-tight">
            {feature.text}
          </span>
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
              Plan your trip with our travel experts and receive a custom offer.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink 
              href="/contact" 
              className="!rounded-full !border-none !bg-[linear-gradient(135deg,#f8d77a,#e7a91f)] !px-6 !py-3 !text-[12px] !font-bold !text-[#111e29] hover:!bg-[#e0b54a]"
            >
              <Mail size={16} className="mr-2" /> Request a Quote <ArrowRight size={16} className="ml-1" />
            </ButtonLink>
            
            <a 
              href="https://wa.me/41791234567"
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12px] font-bold text-[#0d1b2a] transition hover:bg-gray-100"
            >
              <MessageSquare size={16} className="text-[#25D366]" />
              WhatsApp Us
            </a>
          </div>

        </Container>
      </section>

    </>
  );
}
