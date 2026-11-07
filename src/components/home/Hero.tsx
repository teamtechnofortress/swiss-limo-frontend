import { Car, MapPin, CalendarDays, ChevronDown , ArrowLeftRight, Mountain,Clock, Users, ArrowRight, Star, Users2, Clock3, ShieldCheck } from 'lucide-react';
import { ButtonLink, Container } from '@/components/ui/primitives';
import Link from 'next/link';

const heroImage = '/images/home/herofinal.png';

const TRUST_BADGES = [
  { icon: Star, title: '4.9/5', subtitle: 'Client Rating' },
  { icon: Users2, title: '10,000+', subtitle: 'Happy Travelers' },
  { icon: Clock3, title: '24/7', subtitle: 'Support' },
  { icon: ShieldCheck, title: 'Swiss', subtitle: 'Service Quality' },
];

export function Hero() {
  return (
    <section className="relative isolate h-[450px] bg-[#0d1b2a] md:h-[480px] z-20">
      
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-right bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,42,0.95)_0%,rgba(13,27,42,0.85)_35%,rgba(13,27,42,0.2)_65%,transparent_100%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,42,0.8)_0%,transparent_20%,rgba(13,27,42,0.6)_100%)]" aria-hidden="true" />
      </div>

      <Container className="relative flex h-full flex-col justify-start pt-12 md:pt-16">
        <div className="max-w-2xl">
          
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px w-8 bg-[#f1c75b]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
              Private Chauffeur Services in Switzerland
            </p>
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-6xl"
              style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor' }}
          > Your Journey.<br />
          Our <span className="text-white">Swiss</span> <span className="text-[#f1c75b]">Precision.</span>
          </h1>

          <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-gray-100 drop-shadow-md md:text-base">
            Airport transfers, private chauffeur services and fixed-price day trips across Switzerland.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link 
              href="/book" 
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-6 py-2.5 text-[12px] font-bold text-[#0d1b2a] shadow-sm transition hover:bg-[#e0b54a]" >
              <Car size={16} strokeWidth={2.5} /> Book a Transfer
            </Link>
            
            <ButtonLink 
              href="/trips" 
              variant="outline"
              className="!rounded-full !border-white/50 !bg-black/20 backdrop-blur-sm !px-6 !py-2.5 !text-[12px] !font-bold !text-white hover:!border-white hover:!bg-white/20"
            >
              <MapPin size={16} strokeWidth={2} className="mr-2" /> Explore Day Trips
            </ButtonLink>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-white/20 pt-3 md:gap-6">
            {TRUST_BADGES.map(({ icon: Icon, title, subtitle }, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f1c75b]/50 bg-[#0d1b2a]/50 backdrop-blur-md">
                  <Icon size={14} className="text-[#f1c75b]" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-bold text-white">{title}</span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-300">{subtitle}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>


     
      {/* FLOATING BOOKING FORM */}


<div className="absolute bottom-0 left-1/2 z-50 w-full max-w-[1150px] -translate-x-1/2 translate-y-1/2 px-4">

  <div className="relative flex flex-col">

    <div className="relative z-10 flex w-fit items-center rounded-t-[24px] rounded-tr-[24px] bg-white pt-1 pr-1 pl-1">
      <button
        type="button"
        className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#0d1b2a] px-4 py-2.5 text-[11px] font-bold text-white transition sm:px-6 sm:text-xs"
      >
        <Car size={16} />
        Transfer / Ride
      </button>
      <button
        type="button"
        className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[11px] font-bold text-[#0d1b2a] transition hover:bg-gray-50 sm:px-6 sm:text-xs"
      >
        <Mountain size={16} />
        Day Trip / Tour
      </button>
    </div>

    <div className="-mt-[1px] rounded-[24px] rounded-tl-none border border-gray-100 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.13)] md:p-5">

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_38px_minmax(0,1.3fr)_minmax(0,0.9fr)_minmax(0,0.75fr)_minmax(0,0.95fr)_minmax(0,1.1fr)] xl:items-end xl:gap-2.5">

        <div className="min-w-0">
          <label className="mb-1.5 block text-xs font-bold text-[#0d1b2a]">
            Pickup Location
          </label>
          <div className="flex h-[44px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 shadow-sm transition focus-within:border-[#f1c75b]">
            <MapPin size={18} className="shrink-0 text-[#0d1b2a]" />
            <input
              type="text"
              placeholder="Zurich Airport (ZRH)"
              className="w-full min-w-0 bg-transparent text-[13px] font-medium text-[#0d1b2a] outline-none placeholder:text-gray-500"
            />
            <ChevronDown size={16} className="shrink-0 text-[#0d1b2a]" />
          </div>
        </div>

        <div className="flex items-end justify-center">
          <button
            type="button"
            aria-label="Swap pickup and destination"
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg bg-[#fff8e8] text-[#0d1b2a] shadow-sm transition hover:bg-[#fce8b5] xl:mb-0"
          >
            <ArrowLeftRight size={18} />
          </button>
        </div>

        <div className="min-w-0">
          <label className="mb-1.5 block text-xs font-bold text-[#0d1b2a]">
            Destination
          </label>
          <div className="flex h-[44px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 shadow-sm transition focus-within:border-[#f1c75b]">
            <MapPin size={18} className="shrink-0 text-[#0d1b2a]" />
            <input
              type="text"
              placeholder="Lucerne, Switzerland"
              className="w-full min-w-0 bg-transparent text-[13px] font-medium text-[#0d1b2a] outline-none placeholder:text-gray-500"
            />
            <ChevronDown size={16} className="shrink-0 text-[#0d1b2a]" />
          </div>
        </div>

        <div className="min-w-0">
          <label className="mb-1.5 block text-xs font-bold text-[#0d1b2a]">
            Date
          </label>
          <div className="flex h-[44px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 shadow-sm transition focus-within:border-[#f1c75b]">
            <CalendarDays size={18} className="shrink-0 text-[#0d1b2a]" />
            <input
              type="text"
              placeholder="Select date"
              className="w-full min-w-0 bg-transparent text-[13px] font-medium text-[#0d1b2a] outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="min-w-0">
          <label className="mb-1.5 block text-xs font-bold text-[#0d1b2a]">
            Time
          </label>
          <div className="flex h-[44px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 shadow-sm transition focus-within:border-[#f1c75b]">
            <Clock size={18} className="shrink-0 text-[#0d1b2a]" />
            <input
              type="text"
              placeholder="Select time"
              className="w-full min-w-0 bg-transparent text-[13px] font-medium text-[#0d1b2a] outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex h-[44px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 shadow-sm transition focus-within:border-[#f1c75b]">
            <Users size={18} className="shrink-0 text-[#0d1b2a]" />
            <select className="w-full min-w-0 appearance-none bg-transparent text-[13px] font-medium text-[#0d1b2a] outline-none">
              <option value="1">1 Passenger</option>
              <option value="2">2 Passengers</option>
              <option value="3">3 Passengers</option>
              <option value="4">4 Passengers</option>
              <option value="5">5 Passengers</option>
              <option value="6">6 Passengers</option>
              <option value="7">7 Passengers</option>
            </select>
            <ChevronDown size={16} className="shrink-0 text-[#0d1b2a]" />
          </div>
        </div>

        <div className="flex items-end">
          <Link
            href="/book"
            className="flex h-[48px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border-none bg-[#f1c75b] px-4 text-[13px] font-bold text-[#0d1b2a] shadow-sm transition hover:bg-[#e0b54a]"
          >
            Book Now
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>

      </div>
    </div>
  </div>
</div>

    </section>

  );
}